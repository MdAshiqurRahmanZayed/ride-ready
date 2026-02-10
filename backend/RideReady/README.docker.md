# RideReady Backend - Docker Setup

## Quick Start

```bash
# 1. Setup environment
cp .env.docker.example .env

# 2. Build and run
docker-compose up -d --build

# 3. View logs
docker-compose logs -f

# 4. Stop
docker-compose down
```

## Access
- API: http://localhost:9000
- Admin: http://localhost:9000/admin
- Docs: http://localhost:9000/api/docs/
- Health: http://localhost:9000/api/health-check/

## Common Commands

```bash
# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Run migrations
docker-compose exec backend python manage.py migrate

# Access database
docker-compose exec db psql -U rideready -d rideready_db

# View logs
docker-compose logs -f backend

# Shell access
docker-compose exec backend bash

# Rebuild
docker-compose up -d --build
```

## Production Notes

- Uses Gunicorn with 3 workers
- Set `DEBUG=False` in production
- Update `SECRET_KEY` and `ALLOWED_HOSTS`
- Add nginx for SSL and static files
