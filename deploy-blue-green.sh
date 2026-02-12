#!/bin/bash

#############################################
# RideReady Blue-Green Backend Deployment
#############################################
#
# Blue-Green Deployment Strategy:
# - Runs two versions: blue (current) and green (new)
# - Deploys to green while blue serves traffic
# - Validates green deployment
# - Switches traffic to green
# - Keeps blue for quick rollback
#
# Usage:
#   ./deploy-blue-green.sh [blue|green|switch|rollback|status]
#
#############################################

set -e

# Colors for output
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
BACKEND_DIR="backend/RideReady"
COMPOSE_BLUE="docker-compose.blue.yml"
COMPOSE_GREEN="docker-compose.green.yml"
NGINX_CONF="/etc/nginx/sites-available/rideready"
HEALTH_CHECK_URL="http://localhost"

# Navigate to correct directory
if [ -d "$BACKEND_DIR" ]; then
    cd $BACKEND_DIR
elif [ -f "manage.py" ]; then
    echo "Already in backend directory"
else
    echo -e "${RED}❌ Error: Cannot find backend directory${NC}"
    exit 1
fi

# Function to get current active environment
get_active_env() {
    if docker ps | grep -q "rideready_backend_blue"; then
        if docker ps | grep -q "rideready_backend_green"; then
            echo "both"
        else
            echo "blue"
        fi
    elif docker ps | grep -q "rideready_backend_green"; then
        echo "green"
    else
        echo "none"
    fi
}

# Function to check health
check_health() {
    local port=$1
    local max_attempts=30
    local attempt=0
    
    echo "🔍 Checking health on port $port..."
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -f -s "$HEALTH_CHECK_URL:$port/api/health-check/" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Health check passed${NC}"
            return 0
        fi
        attempt=$((attempt + 1))
        echo "Attempt $attempt/$max_attempts..."
        sleep 2
    done
    
    echo -e "${RED}❌ Health check failed after $max_attempts attempts${NC}"
    return 1
}

# Function to deploy to specific environment
deploy_env() {
    local env=$1
    local port=$2
    local compose_file=$3
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  Deploying to $env environment (port $port)${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Pull latest code
    echo "📥 Pulling latest code..."
    git pull origin main
    
    # Stop existing containers for this environment
    echo "🛑 Stopping $env containers..."
    docker compose -f $compose_file down || true
    
    # Build and start
    echo "🏗️  Building $env containers..."
    docker compose -f $compose_file up -d --build
    
    # Wait for startup
    echo "⏳ Waiting for services to start..."
    sleep 10
    
    # Run migrations
    echo "📊 Running migrations..."
    docker compose -f $compose_file exec -T backend python manage.py migrate
    
    # Collect static files
    echo "📦 Collecting static files..."
    docker compose -f $compose_file exec -T backend python manage.py collectstatic --noinput
    
    # Health check
    if check_health $port; then
        echo -e "${GREEN}✅ $env deployment successful${NC}"
        return 0
    else
        echo -e "${RED}❌ $env deployment failed health check${NC}"
        return 1
    fi
}

# Function to switch traffic
switch_traffic() {
    local to_env=$1
    local port=$2
    
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}  Switching traffic to $to_env${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Update Nginx configuration (if exists)
    if [ -f "$NGINX_CONF" ]; then
        echo "🔄 Updating Nginx configuration..."
        sudo sed -i "s/proxy_pass http:\/\/localhost:[0-9]\+/proxy_pass http:\/\/localhost:$port/" $NGINX_CONF
        sudo nginx -t && sudo systemctl reload nginx
    fi
    
    echo -e "${GREEN}✅ Traffic switched to $to_env${NC}"
}

# Function to show status
show_status() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  Blue-Green Deployment Status${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    local active=$(get_active_env)
    echo "Active Environment: $active"
    echo ""
    
    echo "Blue Environment (port 9000):"
    if docker ps | grep -q "rideready_backend_blue"; then
        echo -e "  Status: ${GREEN}Running${NC}"
        docker ps --format "table {{.Names}}\t{{.Status}}" | grep blue
    else
        echo -e "  Status: ${RED}Stopped${NC}"
    fi
    echo ""
    
    echo "Green Environment (port 9001):"
    if docker ps | grep -q "rideready_backend_green"; then
        echo -e "  Status: ${GREEN}Running${NC}"
        docker ps --format "table {{.Names}}\t{{.Status}}" | grep green
    else
        echo -e "  Status: ${RED}Stopped${NC}"
    fi
    echo ""
    
    echo "Database:"
    docker ps --format "table {{.Names}}\t{{.Status}}" | grep postgres || echo "  No database running"
}

# Main command handler
case "${1:-status}" in
    blue)
        deploy_env "blue" "9000" "$COMPOSE_BLUE"
        ;;
    green)
        deploy_env "green" "9001" "$COMPOSE_GREEN"
        ;;
    switch)
        local active=$(get_active_env)
        if [ "$active" = "blue" ]; then
            switch_traffic "green" "9001"
        elif [ "$active" = "green" ]; then
            switch_traffic "blue" "9000"
        else
            echo -e "${RED}❌ No environment is running${NC}"
            exit 1
        fi
        ;;
    rollback)
        echo -e "${YELLOW}⏮️  Rolling back...${NC}"
        local active=$(get_active_env)
        if [ "$active" = "blue" ]; then
            switch_traffic "green" "9001"
        elif [ "$active" = "green" ]; then
            switch_traffic "blue" "9000"
        else
            echo -e "${RED}❌ No environment to rollback to${NC}"
            exit 1
        fi
        ;;
    status)
        show_status
        ;;
    deploy)
        echo -e "${BLUE}🚀 Starting Blue-Green Deployment${NC}"
        echo ""
        
        # Determine which environment to deploy to
        local active=$(get_active_env)
        
        if [ "$active" = "none" ]; then
            echo "No active environment. Deploying to blue..."
            deploy_env "blue" "9000" "$COMPOSE_BLUE"
            switch_traffic "blue" "9000"
        elif [ "$active" = "blue" ]; then
            echo "Blue is active. Deploying to green..."
            if deploy_env "green" "9001" "$COMPOSE_GREEN"; then
                read -p "Switch traffic to green? [y/N]: " confirm
                if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
                    switch_traffic "green" "9001"
                    echo ""
                    echo "💡 Blue environment is still running for quick rollback"
                    echo "   Run './deploy-blue-green.sh rollback' to switch back"
                fi
            fi
        elif [ "$active" = "green" ]; then
            echo "Green is active. Deploying to blue..."
            if deploy_env "blue" "9000" "$COMPOSE_BLUE"; then
                read -p "Switch traffic to blue? [y/N]: " confirm
                if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
                    switch_traffic "blue" "9000"
                    echo ""
                    echo "💡 Green environment is still running for quick rollback"
                    echo "   Run './deploy-blue-green.sh rollback' to switch back"
                fi
            fi
        fi
        ;;
    cleanup)
        echo "🧹 Cleaning up inactive environment..."
        local active=$(get_active_env)
        
        if [ "$active" = "blue" ]; then
            echo "Stopping green environment..."
            docker compose -f $COMPOSE_GREEN down
        elif [ "$active" = "green" ]; then
            echo "Stopping blue environment..."
            docker compose -f $COMPOSE_BLUE down
        fi
        echo -e "${GREEN}✅ Cleanup complete${NC}"
        ;;
    *)
        echo "Usage: $0 [blue|green|deploy|switch|rollback|status|cleanup]"
        echo ""
        echo "Commands:"
        echo "  deploy    - Automated blue-green deployment"
        echo "  blue      - Deploy to blue environment (port 9000)"
        echo "  green     - Deploy to green environment (port 9001)"
        echo "  switch    - Switch traffic between environments"
        echo "  rollback  - Quick rollback to previous environment"
        echo "  status    - Show current deployment status"
        echo "  cleanup   - Remove inactive environment"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Operation complete!${NC}"
