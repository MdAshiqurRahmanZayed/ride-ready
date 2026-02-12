# RideReady

Full-stack vehicle rental application with React frontend and Django REST Framework backend.

## Tech Stack

**Frontend:** React 18, Redux Toolkit, React Router, Bootstrap 5  
**Backend:** Django 5, DRF, Gunicorn, PostgreSQL 15  
**Infrastructure:** AWS EC2, S3, Docker, Terraform  
**CI/CD:** GitHub Actions

## Quick Start

### Local Development
```bash
# Frontend (http://localhost:3000)
cd frontend && npm install && npm start

# Backend (http://localhost:9000)
cd backend/RideReady && docker compose up -d
```

### Deployment
```bash
# Automated (GitHub Actions)
git push  # Auto-deploys based on changed files

# Manual
./deploy.sh                    # Backend (1-2 min downtime)
./deploy-blue-green.sh deploy  # Backend (zero downtime)
./deploy-frontend.sh           # Frontend to S3
./deploy-helper.sh             # Interactive menu
```

## Project Structure

```
ride-ready/
├── frontend/              # React app
├── backend/RideReady/     # Django API
├── terraform/             # Infrastructure
├── deploy*.sh             # Deployment scripts
└── .github/workflows/     # CI/CD
```

## Environment Setup

**Frontend** (`frontend/.env`):
```env
REACT_APP_BACKEND_URL=http://backend-ip:9000
```

**Backend** (`backend/RideReady/.env`):
```env
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=your-ip,domain
DB_HOST=db
DB_NAME=rideready_db
DB_USER=rideready
DB_PASSWORD=secure-password
USE_S3=True
AWS_STORAGE_BUCKET_NAME=your-bucket
AWS_S3_REGION_NAME=eu-central-1
CORS_ALLOWED_ORIGINS=http://frontend-url
```

## Monorepo Workflow

```bash
# Frontend only
git add frontend/ && git commit -m "feat(frontend): description"

# Backend only
git add backend/ && git commit -m "feat(backend): description"

# Both
git add frontend/ backend/ && git commit -m "feat: description"
```

Push to `main` triggers deployment:
- `frontend/**` changes → S3
- `backend/**` changes → EC2

## Documentation

See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment guide.

## Features

- Vehicle browsing and booking
- User authentication (JWT)
- Admin dashboard
- Image uploads to S3
- Responsive design
- Zero-downtime deployment option

## License

MIT
