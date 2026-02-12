#!/bin/bash

#############################################
# RideReady Backend Deployment Script
# Blue-Green Deployment with Docker
#############################################
# 
# Blue-Green Deployment Strategy:
# - Detects current active environment (blue on port 9000 or green on port 9001)
# - Deploys to inactive environment while current serves traffic
# - Validates new deployment with health checks
# - Switches traffic to new environment
# - Destroys old environment (zero downtime)
#
# What it does:
# 1. Pulls latest code from main branch
# 2. Determines active environment (blue/green)
# 3. Deploys to inactive environment
# 4. Runs health checks on new environment
# 5. Switches traffic to new environment
# 6. Destroys old environment
# 7. Runs database migrations
# 8. Collects static files to S3
#
# Usage:
#   On server:  cd ~/ride-ready && ./deploy.sh
#   GitHub Actions: Calls this script automatically
#
#############################################

set -e

# Colors for output
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🚀 Starting Blue-Green Backend Deployment${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Navigate to backend directory (handle both root and backend/RideReady locations)
if [ -d "backend/RideReady" ]; then
    cd backend/RideReady
elif [ -f "manage.py" ]; then
    # Already in backend/RideReady
    echo -e "${GREEN}📍 Already in backend directory${NC}"
else
    echo -e "${RED}❌ Error: Cannot find backend/RideReady directory${NC}"
    exit 1
fi

# Pull latest changes
echo -e "${YELLOW}📥 Pulling latest code...${NC}"
git pull origin main

# Copy environment if not exists
if [ ! -f .env ]; then
    echo -e "${RED}⚠️  .env file not found! Copying from example...${NC}"
    cp .env.docker.example .env
    echo "✏️  Please edit .env with production values"
    exit 1
fi

# Function to check if container is running
is_running() {
    local container_name=$1
    docker ps --format '{{.Names}}' | grep -q "^${container_name}$"
}

# Function to check health
check_health() {
    local port=$1
    local max_attempts=20
    local attempt=0
    
    echo -e "${YELLOW}🔍 Checking health on port $port...${NC}"
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -f -s "http://localhost:$port/api/health-check/" > /dev/null 2>&1; then
            # Double check - wait 2 seconds and try again
            sleep 2
            if curl -f -s "http://localhost:$port/api/health-check/" > /dev/null 2>&1; then
                echo -e "${GREEN}✅ Health check passed on port $port${NC}"
                return 0
            fi
        fi
        attempt=$((attempt + 1))
        sleep 1
    done
    
    echo -e "${RED}❌ Health check failed after $max_attempts attempts${NC}"
    return 1
}

# Determine current active environment
echo -e "${YELLOW}🔍 Detecting active environment...${NC}"

BLUE_RUNNING=false
GREEN_RUNNING=false

if is_running "rideready_backend_blue"; then
    BLUE_RUNNING=true
    echo -e "${BLUE}🔵 Blue environment is running (port 9000)${NC}"
fi

if is_running "rideready_backend_green"; then
    GREEN_RUNNING=true
    echo -e "${GREEN}🟢 Green environment is running (port 9001)${NC}"
fi

# Decide which environment to deploy to
if [ "$BLUE_RUNNING" = true ] && [ "$GREEN_RUNNING" = false ]; then
    # Blue is active, deploy to green
    DEPLOY_ENV="green"
    DEPLOY_PORT=9001
    DEPLOY_COMPOSE="docker-compose.green.yml"
    OLD_ENV="blue"
    OLD_COMPOSE="docker-compose.blue.yml"
    echo -e "${GREEN}📍 Deploying to GREEN environment (port 9001)${NC}"
elif [ "$GREEN_RUNNING" = true ] && [ "$BLUE_RUNNING" = false ]; then
    # Green is active, deploy to blue
    DEPLOY_ENV="blue"
    DEPLOY_PORT=9000
    DEPLOY_COMPOSE="docker-compose.blue.yml"
    OLD_ENV="green"
    OLD_COMPOSE="docker-compose.green.yml"
    echo -e "${BLUE}📍 Deploying to BLUE environment (port 9000)${NC}"
elif [ "$BLUE_RUNNING" = false ] && [ "$GREEN_RUNNING" = false ]; then
    # Nothing running, start with blue
    DEPLOY_ENV="blue"
    DEPLOY_PORT=9000
    DEPLOY_COMPOSE="docker-compose.blue.yml"
    OLD_ENV=""
    OLD_COMPOSE=""
    echo -e "${BLUE}📍 No active environment. Starting with BLUE (port 9000)${NC}"
else
    # Both running, prefer deploying to green
    DEPLOY_ENV="green"
    DEPLOY_PORT=9001
    DEPLOY_COMPOSE="docker-compose.green.yml"
    OLD_ENV="blue"
    OLD_COMPOSE="docker-compose.blue.yml"
    echo -e "${YELLOW}⚠️  Both environments running. Deploying to GREEN${NC}"
fi

# Deploy to target environment
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🚀 Deploying to $DEPLOY_ENV environment${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Build and start new environment
echo -e "${YELLOW}🏗️  Building $DEPLOY_ENV containers...${NC}"
sudo docker compose -f $DEPLOY_COMPOSE up -d --build

# Wait for services to start
echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
sleep 10

# Run migrations on new environment
echo -e "${YELLOW}📊 Running migrations...${NC}"
sudo docker compose -f $DEPLOY_COMPOSE exec -T backend python manage.py migrate

# Collect static files
echo -e "${YELLOW}📦 Collecting static files...${NC}"
sudo docker compose -f $DEPLOY_COMPOSE exec -T backend python manage.py collectstatic --noinput

# Health check on new environment
if check_health $DEPLOY_PORT; then
    echo -e "${GREEN}✅ New $DEPLOY_ENV environment is healthy${NC}"
    
    # Update nginx if installed
    if command -v nginx &> /dev/null; then
        echo -e "${YELLOW}🔄 Updating nginx configuration...${NC}"
        NGINX_CONF="/etc/nginx/sites-available/rideready"
        if [ -f "$NGINX_CONF" ]; then
            # Update upstream to point to new environment
            sudo sed -i "s/server localhost:[0-9]\+;/server localhost:$DEPLOY_PORT;/" "$NGINX_CONF"
            # Graceful reload (keeps existing connections)
            sudo nginx -t && sudo systemctl reload nginx
            echo -e "${GREEN}✅ Nginx updated to port $DEPLOY_PORT${NC}"
            # Wait for connections to drain
            sleep 5
        fi
    fi
    
    # Destroy old environment if exists
    if [ -n "$OLD_ENV" ]; then
        echo -e "${YELLOW}🗑️  Destroying old $OLD_ENV environment...${NC}"
        # Give extra time for nginx to fully switch traffic
        sleep 3
        sudo docker compose -f $OLD_COMPOSE down
        echo -e "${GREEN}✅ Old $OLD_ENV environment stopped${NC}"
    fi
    
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🎉 Deployment complete!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ Active: $DEPLOY_ENV environment (port $DEPLOY_PORT)${NC}"
    echo -e "${GREEN}🌐 Backend: http://localhost:$DEPLOY_PORT${NC}"
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ Deployment failed!${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}New $DEPLOY_ENV environment failed health check${NC}"
    echo -e "${YELLOW}🔄 Keeping old $OLD_ENV environment running${NC}"
    echo -e "${YELLOW}🗑️  Cleaning up failed $DEPLOY_ENV deployment...${NC}"
    sudo docker compose -f $DEPLOY_COMPOSE down
    exit 1
fi

# Show final status
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 Container Status:${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
sudo docker compose -f $DEPLOY_COMPOSE ps

echo "📊 Admin: http://localhost:9000/admin"
