#!/bin/bash

#############################################
# RideReady Backend Deployment Script
#############################################
# 
# Use this script to manually deploy BACKEND ONLY to EC2 server
# 
# When to use:
# - After making changes to backend/ directory
# - After updating docker-compose.yml or Dockerfile
# - After modifying Django models (migrations)
# - When GitHub Actions is not available
# - Called automatically by GitHub Actions workflow
#
# What it does:
# 1. Pulls latest code from main branch
# 2. Stops running containers
# 3. Rebuilds Docker images with new code
# 4. Starts containers (backend with Gunicorn + database)
# 5. Runs database migrations
# 6. Collects static files to S3
#
# Backend runs with Gunicorn (3 workers) for production performance
#
# Usage:
#   On server:  cd ~/ride-ready && ./deploy.sh
#   GitHub Actions: Calls this script automatically
#
# Note: Frontend is NOT deployed by this script.
#       Use ./deploy-frontend.sh for frontend deployment.
#
# GitHub Actions Alternative:
#   Push to main branch → backend/** changes trigger auto-deploy
#
#############################################

set -e

echo "🚀 Starting BACKEND deployment..."

# Navigate to backend directory (handle both root and backend/RideReady locations)
if [ -d "backend/RideReady" ]; then
    cd backend/RideReady
elif [ -f "manage.py" ]; then
    # Already in backend/RideReady
    echo "📍 Already in backend directory"
else
    echo "❌ Error: Cannot find backend/RideReady directory"
    exit 1
fi

# Pull latest changes
echo "📥 Pulling latest code..."
git pull origin main

# Copy environment if not exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found! Copying from example..."
    cp .env.docker.example .env
    echo "✏️  Please edit .env with production values"
    exit 1
fi

# Stop existing containers
echo "🛑 Stopping containers..."
sudo docker compose down

# Build and start containers
echo "🏗️  Building containers..."
sudo docker compose up -d --build

# Wait for containers to start
echo "⏳ Waiting for services to start..."
sleep 10

# Run migrations
echo "📊 Running migrations..."
sudo docker compose exec -T backend python manage.py migrate

# Collect static files
echo "📦 Collecting static files..."
sudo docker compose exec -T backend python manage.py collectstatic --noinput

# Check status
echo "✅ Checking container status..."
sudo docker compose ps

echo "🎉 Deployment complete!"
echo "🌐 Backend: http://localhost:9000"
echo "📊 Admin: http://localhost:9000/admin"
