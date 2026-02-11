# RideReady Quick Reference

## 🎯 When You Change...

### Frontend Only (React, Components, Styles)
```bash
# Location: frontend/
# Files: src/, public/, package.json

# Development:
cd frontend && npm start

# Commit:
git add frontend/
git commit -m "feat(frontend): your message"
git push

# Result:
# ✅ Frontend deploys to S3 (~2-3 min)
# ⏸️  Backend unchanged
```

### Backend Only (Django, API, Models)
```bash
# Location: backend/RideReady/
# Files: *.py, requirements.txt, Dockerfile

# Development:
cd backend/RideReady && docker compose up -d

# Commit:
git add backend/
git commit -m "feat(backend): your message"
git push

# Result:
# ✅ Backend deploys to EC2 (~3-5 min)
# ⏸️  Frontend unchanged
```

### Both Frontend & Backend
```bash
# Development:
cd backend/RideReady && docker compose up -d  # Terminal 1
cd frontend && npm start                       # Terminal 2

# Commit:
git add frontend/ backend/
git commit -m "feat: your message
- frontend: UI changes
- backend: API changes"
git push

# Result:
# ✅ Both deploy independently (~3-5 min)
```

### Infrastructure (Terraform, AWS Resources)
```bash
# Location: terraform/
# Files: *.tf, terraform.tfvars

# Apply changes:
cd terraform
terraform plan
terraform apply

# Commit:
git add terraform/
git commit -m "infra: your message"
git push

# Result:
# ✅ Infrastructure updated
# ⚠️  May trigger backend redeploy
```

---

## 🚀 Deployment Commands

| What | Command | Location | Time |
|------|---------|----------|------|
| **Frontend** | `./deploy-frontend.sh` | Root | ~2-3 min |
| **Backend** | SSH + pull + docker compose | EC2 | ~3-5 min |
| **Both** | `./deploy-helper.sh` | Root | ~5 min |
| **Interactive** | `./deploy-helper.sh` | Root | - |

---

## 📝 Commit Message Format

```bash
# Frontend
git commit -m "feat(frontend): add booking form"
git commit -m "fix(frontend): resolve date picker bug"

# Backend
git commit -m "feat(backend): add payment endpoint"
git commit -m "fix(backend): resolve auth token issue"

# Both
git commit -m "feat: implement notifications
- frontend: add notification component
- backend: add notification API"

# Infrastructure
git commit -m "infra: increase EC2 instance size"
```

---

## 🌐 URLs

### Development
- Frontend: http://localhost:3000
- Backend: http://localhost:9000
- Admin: http://localhost:9000/admin

### Production
- Frontend: http://bucket-name.s3-website.eu-central-1.amazonaws.com
- Backend: http://backend-ip:9000
- Admin: http://backend-ip:9000/admin

---

## 🔍 Check Status

### View Deployments
```bash
# GitHub Actions
https://github.com/your-repo/actions

# Frontend deployment status
# Backend deployment status
```

### Check Logs
```bash
# Backend logs (on EC2)
ssh ubuntu@your-server
cd ~/ride-ready/backend/RideReady
sudo docker compose logs -f backend

# Frontend (S3)
aws s3 ls s3://your-bucket --profile ostad-account
```

### Test Endpoints
```bash
# Backend health check
curl http://backend-ip:9000/api/health-check/

# Frontend
curl http://bucket-name.s3-website.eu-central-1.amazonaws.com
```

---

## 🛠️ Common Tasks

### Create Django Migration
```bash
cd backend/RideReady
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate
git add backend/
git commit -m "feat(backend): add new field to model"
```

### Update Dependencies

**Frontend:**
```bash
cd frontend
npm install package-name
git add frontend/package.json frontend/package-lock.json
git commit -m "chore(frontend): update dependencies"
```

**Backend:**
```bash
cd backend/RideReady
# Add to requirements.txt
git add backend/RideReady/requirements.txt
git commit -m "chore(backend): update dependencies"
```

### Update Environment Variables

**Frontend:**
```bash
# Update GitHub secret: BACKEND_URL
# Or edit frontend/.env locally
```

**Backend:**
```bash
# SSH to server
ssh ubuntu@your-server
cd ~/ride-ready/backend/RideReady
nano .env
sudo docker compose restart backend
```

### Roll Back Deployment

**Frontend:**
```bash
# Revert commit and push
git revert HEAD
git push
# Or manually upload old build/ to S3
```

**Backend:**
```bash
# SSH to server
git revert HEAD
git push
# On server:
cd ~/ride-ready/backend/RideReady
git pull
sudo docker compose up -d --build
```

---

## 🐛 Troubleshooting

### Frontend not updating
```bash
# Clear browser cache: Cmd+Shift+R (Mac)
# Check S3 bucket content
aws s3 ls s3://your-bucket/ --recursive --profile ostad-account
```

### Backend deployment fails
```bash
# SSH to server
ssh ubuntu@your-server
cd ~/ride-ready/backend/RideReady
sudo docker compose logs backend
sudo docker compose ps
```

### CORS errors
```bash
# Update backend .env CORS_ALLOWED_ORIGINS
# Include frontend S3 URL
sudo docker compose restart backend
```

---

## 📚 Full Documentation

- **Monorepo Workflow**: [MONOREPO_WORKFLOW.md](MONOREPO_WORKFLOW.md)
- **Project Structure**: [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
- **Frontend Guide**: [frontend/README.md](frontend/README.md)
- **Backend Guide**: [backend/RideReady/README.md](backend/RideReady/README.md)
- **Deployment**: [README.deployment.md](README.deployment.md)

---

## 💡 Pro Tips

1. **Use feature branches** for new features
2. **Test locally first** before pushing
3. **Deploy backend before frontend** if API changes
4. **Check GitHub Actions** for deployment status
5. **Monitor logs** after deployment
6. **Use deploy-helper.sh** for guided deployment
7. **Keep .env files in sync** between local and production
8. **Commit with descriptive scope** (frontend/backend)

---

## ⚡ Fast Commands

```bash
# Start both locally
cd backend/RideReady && docker compose up -d && cd ../../frontend && npm start

# Deploy frontend
./deploy-frontend.sh

# Check backend status on server
ssh ubuntu@your-server "cd ~/ride-ready/backend/RideReady && sudo docker compose ps"

# View backend logs
ssh ubuntu@your-server "cd ~/ride-ready/backend/RideReady && sudo docker compose logs -f backend"

# Interactive deployment
./deploy-helper.sh
```
