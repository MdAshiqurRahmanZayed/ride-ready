# Deployment Guide

## Overview

RideReady uses a monorepo structure with independent frontend and backend deployments.

## Architecture

```
┌─────────────┐         ┌─────────────┐
│  Frontend   │ → S3    │   Backend   │ → EC2
│   (React)   │         │  (Django)   │
└─────────────┘         └──────┬──────┘
                               │
                        ┌──────▼──────┐
                        │ PostgreSQL  │
                        │  (Docker)   │
                        └─────────────┘
```

## Quick Start

### Automated (GitHub Actions)
Push to `main` branch automatically deploys:
- `frontend/**` changes → S3
- `backend/**` changes → EC2

### Manual Deployment

```bash
# Frontend only
./deploy-frontend.sh

# Backend only (standard - 1-2 min downtime)
./deploy.sh

# Backend (blue-green - zero downtime)
./deploy-blue-green.sh deploy

# Interactive helper
./deploy-helper.sh
```

---

## Frontend Deployment

### Local Setup
```bash
cd frontend
npm install
npm start  # http://localhost:3000
```

### Environment Variables
Create `frontend/.env`:
```env
REACT_APP_BACKEND_URL=http://backend-ip:9000
```

### Manual Deploy
```bash
./deploy-frontend.sh
```

**What it does:**
1. Builds React app
2. Uploads to S3 bucket
3. Available at S3 website URL

### CI/CD
`.github/workflows/deploy-frontend.yml` triggers on `frontend/**` changes

---

## Backend Deployment

### Local Setup
```bash
cd backend/RideReady
docker compose up -d  # http://localhost:9000
```

### Environment Variables
Create `backend/RideReady/.env`:
```env
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=your-ip,your-domain
DB_HOST=db
DB_NAME=rideready_db
DB_USER=rideready
DB_PASSWORD=secure-password
USE_S3=True
AWS_STORAGE_BUCKET_NAME=your-bucket
AWS_S3_REGION_NAME=eu-central-1
CORS_ALLOWED_ORIGINS=http://frontend-url,http://localhost:3000
```

### Deployment Options

#### Option 1: Standard Deployment (1-2 min downtime)
```bash
# On server
cd ~/ride-ready
./deploy.sh
```

**Process:**
1. Stops containers
2. Pulls latest code
3. Rebuilds with Gunicorn (3 workers)
4. Runs migrations
5. Collects static files

#### Option 2: Blue-Green Deployment (Zero downtime)
```bash
# Automated
./deploy-blue-green.sh deploy

# Manual steps
./deploy-blue-green.sh green   # Deploy to inactive
./deploy-blue-green.sh switch  # Switch traffic
./deploy-blue-green.sh rollback # If issues
./deploy-blue-green.sh cleanup # When stable
```

**Blue-Green Architecture:**
```
Nginx → Blue (port 9000) ✅ Active
     → Green (port 9001) 🚧 Standby
```

**Benefits:**
- Zero downtime
- Instant rollback
- Test before switch
- Both environments share database


### CI/CD
`.github/workflows/deploy.yml` triggers on `backend/**` changes, runs `./deploy.sh`

---

## Monorepo Workflow

### Change Frontend Only
```bash
cd frontend
# Make changes...
git add frontend/
git commit -m "feat(frontend): description"
git push  # Only frontend deploys
```

### Change Backend Only
```bash
cd backend/RideReady
# Make changes...
git add backend/
git commit -m "feat(backend): description"
git push  # Only backend deploys
```

### Change Both
```bash
git add frontend/ backend/
git commit -m "feat: description
- frontend: changes
- backend: changes"
git push  # Both deploy independently
```

---

## Commands Reference

### Development
```bash
# Frontend
cd frontend && npm start

# Backend
cd backend/RideReady && docker compose up -d
```

### Deployment
```bash
# Frontend
./deploy-frontend.sh                 # ~2-3 min

# Backend (choose one)
./deploy.sh                          # Standard, ~2 min, 1-2 min downtime
./deploy-blue-green.sh deploy        # Zero downtime, ~3 min

# Helper
./deploy-helper.sh                   # Interactive menu
```

### Monitoring
```bash
# Backend logs (on server)
cd ~/ride-ready/backend/RideReady
sudo docker compose logs -f backend

# Container status
sudo docker compose ps

# Blue-Green status
./deploy-blue-green.sh status
```

### Rollback
```bash
# Standard deployment
git revert HEAD && git push

# Blue-Green deployment
./deploy-blue-green.sh rollback  # Instant
```

---

## Troubleshooting

### Frontend not updating
```bash
# Clear browser cache (Cmd+Shift+R)
# Verify S3 content
aws s3 ls s3://bucket-name --recursive --profile ostad-account
```

### Backend deployment fails
```bash
# SSH to server
ssh ubuntu@your-server
cd ~/ride-ready/backend/RideReady

# Check logs
sudo docker compose logs backend

# Restart
sudo docker compose restart backend
```

### CORS errors
Update `backend/RideReady/.env`:
```env
CORS_ALLOWED_ORIGINS=http://frontend-url,http://localhost:3000
```
Then restart: `sudo docker compose restart backend`

### Database migrations
```bash
# Check status
docker compose exec backend python manage.py showmigrations

# Run migrations
docker compose exec backend python manage.py migrate

# Create migrations
docker compose exec backend python manage.py makemigrations
```

### Port conflicts (Blue-Green)
```bash
# Check port usage
sudo lsof -i :9001

# Stop containers
docker compose -f docker-compose.green.yml down
```

---

## Infrastructure

### AWS Resources (via Terraform)
```bash
cd terraform
terraform plan
terraform apply
```

**Created resources:**
- EC2 instance (backend)
- S3 buckets (frontend + media)
- Security groups
- Elastic IP

### Server Setup
```bash
# SSH to server
ssh ubuntu@your-server-ip

# Clone repo
cd ~
git clone https://github.com/username/ride-ready.git
cd ride-ready/backend/RideReady

# Create .env file
cp .env.example .env
nano .env  # Edit values

# Deploy
cd ~/ride-ready
./deploy.sh
```

---

## Best Practices

1. **Test locally first** before pushing
2. **Use feature branches** for new features
3. **Deploy backend before frontend** if API changes
4. **Monitor logs** after deployment
5. **Backup database** before major migrations
6. **Use blue-green** for production deployments
7. **Keep .env in sync** between local and production
8. **Commit with scope**: `feat(frontend):` or `feat(backend):`

---

## Production Checklist

- [ ] Set `DEBUG=False` in backend `.env`
- [ ] Generate secure `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS` properly
- [ ] Update `CORS_ALLOWED_ORIGINS` with frontend URL
- [ ] Setup S3 buckets for media/static files
- [ ] Configure GitHub secrets for CI/CD
- [ ] Setup Nginx for blue-green (optional)
- [ ] Enable HTTPS with Let's Encrypt (optional)
- [ ] Setup database backups
- [ ] Configure monitoring/alerts

---

## URLs

### Development
- Frontend: http://localhost:3000
- Backend: http://localhost:9000
- Admin: http://localhost:9000/admin

### Production
- Frontend: http://bucket-name.s3-website.eu-central-1.amazonaws.com
- Backend: http://backend-ip:9000 (blue) or :9001 (green)
- Admin: http://backend-ip:9000/admin

---

## Tech Stack

**Frontend:** React 18, Redux Toolkit, React Router, Bootstrap 5  
**Backend:** Django 5, DRF, Gunicorn (3 workers), PostgreSQL 15  
**Infrastructure:** AWS EC2, S3, Docker, Terraform  
**CI/CD:** GitHub Actions

---

## Related Files

- `deploy.sh` - Standard backend deployment
- `deploy-blue-green.sh` - Zero-downtime deployment
- `deploy-frontend.sh` - Frontend deployment
- `deploy-helper.sh` - Interactive deployment menu
- `.github/workflows/deploy.yml` - Backend CI/CD
- `.github/workflows/deploy-frontend.yml` - Frontend CI/CD
- `terraform/` - Infrastructure as code
- `backend/RideReady/docker-compose.yml` - Standard setup
- `backend/RideReady/docker-compose.blue.yml` - Blue environment
- `backend/RideReady/docker-compose.green.yml` - Green environment
