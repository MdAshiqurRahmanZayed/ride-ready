#!/bin/bash

# Server Deployment Script (Run on EC2)

set -e

PROJECT_DIR="/home/ubuntu/ride-ready"
BACKEND_DIR="$PROJECT_DIR/backend/RideReady"

echo "🚀 Deploying RideReady Backend..."

# Navigate to project
cd $PROJECT_DIR

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Navigate to backend
cd $BACKEND_DIR

# Build and deploy
echo "🏗️  Building and starting services..."
sudo docker compose down
sudo docker compose up -d --build

# Wait for services
echo "⏳ Waiting for services..."
sleep 10

# Run migrations
echo "📊 Running migrations..."
sudo docker compose exec -T backend python manage.py migrate

# Collect static
echo "📦 Collecting static files..."
sudo docker compose exec -T backend python manage.py collectstatic --noinput

# Show status
echo "✅ Deployment complete!"
sudo docker compose ps
sudo docker compose logs --tail=50 backend
