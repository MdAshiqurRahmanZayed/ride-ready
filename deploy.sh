#!/bin/bash

# RideReady Deployment Script

set -e

echo "🚀 Starting deployment..."

# Navigate to backend directory
cd backend/RideReady

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
