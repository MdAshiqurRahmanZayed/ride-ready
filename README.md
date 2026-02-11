# RideReady

A full-stack vehicle rental platform built with Django (backend) and React (frontend), deployed on AWS.

## 🎯 Monorepo Structure

This is a **monorepo** containing both frontend and backend in one repository. Each part can be developed and deployed independently.

```
ride-ready/
├── frontend/              # React frontend → Deploys to S3
│   ├── src/              # React components and logic
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
├── backend/              # Django backend → Deploys to EC2
│   └── RideReady/        # Django project
│       ├── Account/      # User authentication
│       ├── Vehicle/      # Vehicle management
│       ├── Order/        # Booking/orders
│       └── manage.py     # Django management
├── terraform/            # AWS infrastructure as code
└── .github/workflows/    # CI/CD pipelines
```

## 🚀 Quick Start

### Frontend Development
```bash
cd frontend
npm install
npm start  # http://localhost:3000
```
See [frontend/README.md](frontend/README.md) for details.

### Backend Development
```bash
cd backend/RideReady
docker compose up -d  # http://localhost:9000
```
See [backend/RideReady/README.md](backend/RideReady/README.md) for details.

## 📦 Deployment

### Option 1: Automated (GitHub Actions)
Push to `main` branch:
- Changes in `frontend/**` → Auto-deploy to S3
- Changes in `backend/**` → Auto-deploy to EC2
- Changes in both → Both deploy independently

### Option 2: Manual Deployment

**Interactive Helper:**
```bash
./deploy-helper.sh
```

**Frontend Only:**
```bash
./deploy-frontend.sh  # Deploys React app to S3
```

**Backend Only:**
```bash
./deploy.sh  # Deploys Django app to EC2
```

## 📚 Documentation

### Core Guides
- **🔄 [Monorepo Workflow](MONOREPO_WORKFLOW.md)** - How to work with frontend & backend together
- **🏗️ [Project Structure](PROJECT_STRUCTURE.md)** - Complete architecture overview
- **🚀 [Deployment Guide](README.deployment.md)** - Backend deployment details
- **🎨 [Frontend Deployment](README.frontend-deployment.md)** - Frontend deployment details

### Component Guides
- **Frontend**: [frontend/README.md](frontend/README.md)
- **Backend**: [backend/RideReady/README.md](backend/RideReady/README.md)
- **Infrastructure**: [terraform/README.md](terraform/README.md)
- **Remote State**: [terraform/REMOTE_STATE.md](terraform/REMOTE_STATE.md)

## 💡 Common Workflows

### Working on Frontend Only
```bash
cd frontend
# Make changes...
git add frontend/
git commit -m "feat(frontend): add new feature"
git push  # Only frontend deploys
```

### Working on Backend Only
```bash
cd backend/RideReady
# Make changes...
git add backend/
git commit -m "feat(backend): add new API"
git push  # Only backend deploys
```

### Working on Both
```bash
# Make changes in both directories...
git add frontend/ backend/
git commit -m "feat: implement new feature
- frontend: add UI component
- backend: add API endpoint"
git push  # Both deploy
```

See [MONOREPO_WORKFLOW.md](MONOREPO_WORKFLOW.md) for detailed workflows.

## 🛠️ Tech Stack

**Frontend:** React 18, Redux Toolkit, React Router, Bootstrap 5  
**Backend:** Django 5, DRF, PostgreSQL 15, Docker  
**Infrastructure:** AWS (EC2, S3), Terraform, GitHub Actions  

## 📸 Screenshots

Demo:
![](screenshot/a.png)
![](screenshot/b.png)
![](screenshot/c.png)
![](screenshot/d.png)
![](screenshot/e.png)
![](screenshot/f.png)
![](screenshot/g.png)
