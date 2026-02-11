# RideReady Monorepo Workflow

## 📁 Project Structure

This is a **monorepo** containing both frontend and backend in a single repository:

```
ride-ready/
├── frontend/          # React application
├── backend/           # Django application
├── terraform/         # Infrastructure as Code
└── .github/workflows/ # CI/CD pipelines
```

## 🔄 Development Workflow

### Working on Frontend Only

```bash
# Navigate to frontend
cd frontend

# Install dependencies (first time)
npm install

# Start development server
npm start

# Make your changes...

# Test locally
npm test

# Build for production (optional)
npm run build
```

**Commits:**
```bash
git add frontend/
git commit -m "feat(frontend): add new booking component"
git push origin main
```

**Result:** Only frontend pipeline triggers, deploys to S3.

---

### Working on Backend Only

```bash
# Navigate to backend
cd backend/RideReady

# Start development server
docker compose up -d

# Make your changes...

# Test migrations
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate

# Run tests
docker compose exec backend python manage.py test

# View logs
docker compose logs -f backend
```

**Commits:**
```bash
git add backend/
git commit -m "feat(backend): add vehicle availability check"
git push origin main
```

**Result:** Only backend pipeline triggers, deploys to EC2.

---

### Working on Both Frontend & Backend

```bash
# 1. Start backend
cd backend/RideReady
docker compose up -d

# 2. Start frontend (in new terminal)
cd frontend
npm start

# 3. Make changes in both...

# 4. Test integration
# Frontend calls backend API: http://localhost:9000
```

**Commits:**
```bash
git add frontend/ backend/
git commit -m "feat: add real-time booking status
- Frontend: add status polling component
- Backend: add booking status endpoint"
git push origin main
```

**Result:** Both pipelines trigger independently, deploy to their respective targets.

---

### Working on Infrastructure

```bash
# Navigate to terraform
cd terraform

# Make changes to *.tf files

# Plan changes
terraform plan

# Apply changes
terraform apply
```

**Commits:**
```bash
git add terraform/
git commit -m "infra: increase EC2 instance size"
git push origin main
```

**Result:** Backend pipeline may trigger to update server configuration.

---

## 🚀 Deployment Strategy

### Automated (Recommended)

**GitHub Actions** automatically deploys when you push to `main` branch:

| Change Type | Triggers | Deploys To | Time |
|-------------|----------|------------|------|
| `frontend/**` | Frontend Pipeline | S3 Bucket | ~2-3 min |
| `backend/**` | Backend Pipeline | EC2 Docker | ~3-5 min |
| Both | Both Pipelines | S3 + EC2 | ~3-5 min |
| `terraform/**` | Backend Pipeline | EC2 (config) | ~3-5 min |

**Pipeline Details:**

```yaml
# .github/workflows/deploy-frontend.yml
# Triggers on: frontend/** changes
# Actions: npm build → S3 sync

# .github/workflows/deploy.yml  
# Triggers on: backend/** or terraform/** changes
# Actions: SSH to server → Run deploy.sh script
#   - git pull
#   - docker compose rebuild
#   - migrations
#   - collectstatic
```

### Manual Deployment

#### Frontend Only
```bash
./deploy-frontend.sh
```

What it does:
1. Navigate to `frontend/`
2. Install dependencies
3. Create `.env` with backend URL
4. Build React app
5. Upload to S3

#### Backend Only
```bash
# SSH to server and run deploy script
ssh ubuntu@your-server-ip
cd ~/ride-ready
./deploy.sh
```

The deploy.sh script automatically:
1. Pulls latest code
2. Stops containers
3. Rebuilds with new code
4. Runs migrations
5. Collects static files

#### Both (Full Deployment)
```bash
# 1. Deploy backend first
ssh ubuntu@your-server-ip "cd ~/ride-ready && ./deploy.sh"

# 2. Then deploy frontend
./deploy-frontend.sh
```

---

## 🔀 Git Branching Strategy

### Main Branch
```bash
main              # Production-ready code
  ├── frontend/   # Auto-deploys to S3
  └── backend/    # Auto-deploys to EC2
```

### Feature Branches
```bash
# Frontend feature
git checkout -b feature/frontend/booking-calendar
# Make changes in frontend/ only
git push origin feature/frontend/booking-calendar
# Create PR → merge to main → auto-deploy frontend

# Backend feature
git checkout -b feature/backend/payment-api
# Make changes in backend/ only
git push origin feature/backend/payment-api
# Create PR → merge to main → auto-deploy backend

# Full-stack feature
git checkout -b feature/real-time-notifications
# Make changes in frontend/ AND backend/
git push origin feature/real-time-notifications
# Create PR → merge to main → auto-deploy both
```

---

## 📝 Commit Message Convention

Use conventional commits with scope:

```bash
# Frontend changes
git commit -m "feat(frontend): add vehicle search filter"
git commit -m "fix(frontend): resolve booking form validation"
git commit -m "style(frontend): update header design"

# Backend changes
git commit -m "feat(backend): add payment webhook"
git commit -m "fix(backend): resolve database connection issue"
git commit -m "refactor(backend): optimize vehicle query"

# Infrastructure changes
git commit -m "infra(terraform): add RDS database"
git commit -m "infra(docker): update PostgreSQL to v15"

# Both frontend & backend
git commit -m "feat: implement booking notifications
- frontend: add notification component
- backend: add notification endpoints"

# Documentation
git commit -m "docs: update deployment guide"
```

---

## 🛠️ Common Scenarios

### Scenario 1: Frontend needs new backend API

1. **Backend first:**
   ```bash
   cd backend/RideReady
   # Create new endpoint in views.py
   # Add URL in urls.py
   # Test with curl or Postman
   git commit -m "feat(backend): add vehicle availability endpoint"
   git push
   ```

2. **Wait for backend deployment** (3-5 min)

3. **Frontend next:**
   ```bash
   cd frontend
   # Update redux actions to call new endpoint
   # Update components
   git commit -m "feat(frontend): integrate availability check"
   git push
   ```

### Scenario 2: Urgent frontend hotfix

```bash
cd frontend
# Fix the issue
npm run build  # Test build
git commit -m "fix(frontend): correct booking date format"
git push
# Frontend deploys in ~2 min, backend unaffected
```

### Scenario 3: Database migration

```bash
cd backend/RideReady
# Create migration
docker compose exec backend python manage.py makemigrations
# Test locally
docker compose exec backend python manage.py migrate
# Update models, serializers, views
git add backend/
git commit -m "feat(backend): add vehicle rating field"
git push
# Backend pipeline runs migration automatically
```

### Scenario 4: Environment variable change

**Backend:**
```bash
# SSH to server
ssh ubuntu@your-server-ip
cd ~/ride-ready/backend/RideReady
nano .env  # Edit variables
sudo docker compose restart backend
```

**Frontend:**
```bash
# Update GitHub secret BACKEND_URL
# Re-trigger frontend deployment
git commit --allow-empty -m "chore(frontend): trigger redeploy"
git push
```

---

## 🔍 Monitoring Deployments

### View Pipeline Status
```bash
# GitHub Actions
https://github.com/your-repo/actions

# Check frontend build
# Check backend deployment logs
```

### Check Deployment Logs

**Frontend (S3):**
```bash
# AWS CLI
aws s3 ls s3://your-frontend-bucket --profile ostad-account

# Check website
curl http://your-frontend-bucket.s3-website.eu-central-1.amazonaws.com
```

**Backend (EC2):**
```bash
# SSH to server
ssh ubuntu@your-server-ip

# View logs
cd ~/ride-ready/backend/RideReady
sudo docker compose logs -f backend
sudo docker compose logs -f db

# Check container status
sudo docker compose ps
```

---

## 🚨 Troubleshooting

### Frontend builds but old version shows
```bash
# Clear browser cache
# Or hard refresh: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)

# Check S3 bucket content
aws s3 ls s3://your-frontend-bucket/ --recursive --profile ostad-account
```

### Backend deployment fails
```bash
# SSH to server and check logs
ssh ubuntu@your-server-ip
cd ~/ride-ready/backend/RideReady
sudo docker compose logs backend

# Check if containers are running
sudo docker compose ps

# Restart if needed
sudo docker compose restart backend
```

### Both need to deploy but only one triggers
```bash
# Commit to both directories
git add frontend/ backend/
git commit -m "feat: update feature X"
git push
# Both pipelines should trigger
```

---

## 📚 Related Documentation

- **Frontend Development**: [frontend/README.md](frontend/README.md)
- **Backend Development**: [backend/RideReady/README.md](backend/RideReady/README.md)
- **Infrastructure**: [terraform/README.md](terraform/README.md)
- **Backend Deployment**: [README.deployment.md](README.deployment.md)
- **Frontend Deployment**: [README.frontend-deployment.md](README.frontend-deployment.md)
- **Project Structure**: [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

---

## 🎯 Quick Reference

| Task | Command | Location |
|------|---------|----------|
| Start frontend dev | `npm start` | `frontend/` |
| Start backend dev | `docker compose up -d` | `backend/RideReady/` |
| Deploy frontend | `./deploy-frontend.sh` | Root |
| Deploy backend | Push to main | GitHub Actions |
| View backend logs | `docker compose logs -f` | `backend/RideReady/` |
| Apply infrastructure | `terraform apply` | `terraform/` |
| Run migrations | `docker compose exec backend python manage.py migrate` | `backend/RideReady/` |
| Create superuser | `docker compose exec backend python manage.py createsuperuser` | `backend/RideReady/` |

---

## ✅ Best Practices

1. **Commit frequently** with descriptive messages using scopes
2. **Test locally** before pushing (both frontend and backend)
3. **One feature per branch** for easier reviews
4. **Wait for backend** deployment before deploying frontend if API changes
5. **Use feature flags** for incomplete features
6. **Keep .env files** in sync between local and production
7. **Document API changes** in commit messages
8. **Monitor deployments** in GitHub Actions
9. **Check logs** after deployment for errors
10. **Backup database** before major backend changes
