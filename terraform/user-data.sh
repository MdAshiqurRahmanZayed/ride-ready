#!/bin/bash
# User Data Script for Backend EC2 Instances in Auto Scaling Group
set -e

# Log everything to a file
exec > >(tee /var/log/user-data.log)
exec 2>&1

echo "========================================="
echo "Starting RideReady Backend Setup"
echo "Timestamp: $(date)"
echo "========================================="

# Update system
apt-get update -y
apt-get upgrade -y

# Install required packages
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    python3-pip \
    postgresql-client

# Install Docker
echo "Installing Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start and enable Docker
systemctl start docker
systemctl enable docker

# Add ubuntu user to docker group
usermod -aG docker ubuntu

# Install Docker Compose standalone
echo "Installing Docker Compose..."
curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

# Clone repository
echo "Cloning repository..."
cd /home/ubuntu
git clone -b ${github_branch} ${github_repo} ride-ready || (cd ride-ready && git pull origin ${github_branch})
cd ride-ready
chown -R ubuntu:ubuntu /home/ubuntu/ride-ready

# Create .env file for backend
echo "Creating .env file..."
cat > /home/ubuntu/ride-ready/backend/RideReady/.env << EOF
# Django Configuration
DJANGO_SECRET_KEY=${django_secret_key}
DJANGO_DEBUG=${django_debug}
DJANGO_ALLOWED_HOSTS=${django_allowed_hosts}

# Database Configuration (Docker PostgreSQL)
USE_SQLITE=False
DB_NAME=${db_name}
DB_USER=${db_user}
DB_PASSWORD=${db_password}
DB_HOST=db
DB_PORT=5432

# AWS S3 Configuration
USE_S3=True
AWS_ACCESS_KEY_ID=${aws_access_key_id}
AWS_SECRET_ACCESS_KEY=${aws_secret_access_key}
AWS_STORAGE_BUCKET_NAME=${aws_bucket_name}
AWS_S3_REGION_NAME=${aws_region}

# CORS Configuration
CORS_ALLOWED_ORIGINS=${cors_allowed_origins}
FRONTEND_URL=${frontend_url}

# SSL Commerce
SSL_STORE_ID=${ssl_store_id}
SSL_API_KEY=${ssl_api_key}
EOF

chown ubuntu:ubuntu /home/ubuntu/ride-ready/backend/RideReady/.env

# Build and start Docker containers (includes PostgreSQL)
echo "Building and starting Docker containers..."
cd /home/ubuntu/ride-ready/backend/RideReady
docker-compose down || true
docker-compose build --no-cache
docker-compose up -d

# Wait for backend to be healthy
echo "Waiting for backend to be healthy..."
sleep 30

# Check if backend is running
for i in {1..30}; do
  if curl -f http://localhost:9000/api/health-check/ > /dev/null 2>&1; then
    echo "Backend is healthy!"
    break
  fi
  echo "Waiting for backend... ($i/30)"
  sleep 10
done

echo "========================================="
echo "RideReady Backend Setup Complete!"
echo "Timestamp: $(date)"
echo "========================================="
