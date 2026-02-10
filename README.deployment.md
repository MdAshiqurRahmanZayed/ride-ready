# RideReady Deployment Guide

## Prerequisites

### On EC2 Server
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo apt update
sudo apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version
```

## Initial Server Setup

### 1. Clone Repository
```bash
cd ~
git clone https://github.com/yourusername/ride-ready.git
cd ride-ready/backend/RideReady
```

### 2. Configure Environment
```bash
# Copy and edit environment file
cp .env.docker.example .env
nano .env

# Update these values:
# - SECRET_KEY (generate new one)
# - DEBUG=False
# - ALLOWED_HOSTS=your-domain.com,your-ip
# - DB_PASSWORD (secure password)
# - CORS_ALLOWED_ORIGINS
```

### 3. Deploy
```bash
# Make script executable
chmod +x deploy-server.sh

# Run deployment
./deploy-server.sh
```

## GitHub Actions Setup

### 1. Add Repository Secrets
Go to GitHub → Settings → Secrets → Actions, add:

- `EC2_HOST`: Your EC2 public IP or domain
- `EC2_USER`: `ubuntu` (or your SSH user)
- `EC2_SSH_KEY`: Your private SSH key content

### 2. Push to Deploy
```bash
git push origin main
# Deployment will trigger automatically
```

## Manual Deployment

### Local to Server
```bash
# On your local machine
./deploy.sh
```

### On Server
```bash
# SSH to server
ssh ubuntu@your-server-ip

# Navigate and deploy
cd ~/ride-ready/backend/RideReady
sudo docker compose down
sudo docker compose up -d --build
sudo docker compose exec backend python manage.py migrate
```

## Nginx Configuration (Optional)

### For Production with SSL
```bash
# Install nginx on host
sudo apt install nginx certbot python3-certbot-nginx -y

# Copy nginx config
sudo cp nginx.conf /etc/nginx/sites-available/rideready
sudo ln -s /etc/nginx/sites-available/rideready /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com
```

### Or use Docker Nginx
```bash
# Use production compose file
sudo docker compose -f docker-compose.prod.yml up -d --build
```

## Common Commands

### Check Status
```bash
sudo docker compose ps
sudo docker compose logs -f backend
```

### Restart Services
```bash
sudo docker compose restart
```

### Database Backup
```bash
# Backup
sudo docker compose exec db pg_dump -U rideready rideready_db > backup-$(date +%Y%m%d).sql

# Restore
sudo docker compose exec -T db psql -U rideready rideready_db < backup.sql
```

### Update Code
```bash
git pull origin main
sudo docker compose up -d --build
```

### Clean Up
```bash
# Remove unused images
sudo docker system prune -a

# Remove volumes (WARNING: deletes data)
sudo docker compose down -v
```

## Monitoring

### View Logs
```bash
# All services
sudo docker compose logs -f

# Backend only
sudo docker compose logs -f backend

# Last 100 lines
sudo docker compose logs --tail=100 backend
```

### Check Resources
```bash
sudo docker stats
```

## Troubleshooting

### Container won't start
```bash
# Check logs
sudo docker compose logs backend

# Rebuild
sudo docker compose down
sudo docker compose build --no-cache
sudo docker compose up -d
```

### Database connection error
```bash
# Check DB is running
sudo docker compose ps db

# Restart DB
sudo docker compose restart db
```

### Permission issues
```bash
# Fix permissions
sudo chown -R ubuntu:ubuntu ~/ride-ready
sudo chmod -R 755 ~/ride-ready/backend/RideReady/media
```

## Security Checklist

- [ ] Change default passwords in `.env`
- [ ] Set `DEBUG=False` in production
- [ ] Update `SECRET_KEY` with secure random value
- [ ] Configure `ALLOWED_HOSTS` properly
- [ ] Set up SSL/HTTPS with Certbot
- [ ] Configure firewall (allow 80, 443, 22 only)
- [ ] Regular database backups
- [ ] Keep Docker images updated
- [ ] Monitor logs for suspicious activity

## URLs

- Backend API: http://your-server-ip:9000
- Admin Panel: http://your-server-ip:9000/admin
- API Docs: http://your-server-ip:9000/api/docs/
- Health Check: http://your-server-ip:9000/api/health-check/
