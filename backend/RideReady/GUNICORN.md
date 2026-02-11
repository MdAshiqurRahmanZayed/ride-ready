# Backend Production Server Configuration

## Gunicorn Setup

The backend runs with **Gunicorn** as the production WSGI server instead of Django's development server.

### Configuration

**Location:** [backend/RideReady/Dockerfile](backend/RideReady/Dockerfile)

```dockerfile
CMD ["sh", "-c", "python manage.py migrate && gunicorn --bind 0.0.0.0:8000 --workers 3 RideReady.wsgi:application"]
```

### Settings

- **Server:** Gunicorn 21.2.0
- **Workers:** 3 (for concurrent request handling)
- **Bind Address:** 0.0.0.0:8000
- **WSGI Application:** RideReady.wsgi:application

### Why Gunicorn?

**Development (Django):**
```bash
python manage.py runserver
```
- ❌ Single-threaded
- ❌ Not production-ready
- ❌ Poor performance under load
- ✅ Good for local development

**Production (Gunicorn):**
```bash
gunicorn --workers 3 --bind 0.0.0.0:8000 RideReady.wsgi:application
```
- ✅ Multi-process (3 workers)
- ✅ Production-ready
- ✅ Handles concurrent requests
- ✅ Better performance
- ✅ Automatic worker management

### Worker Count

**Current:** 3 workers

**Formula:** `(2 x CPU cores) + 1`
- For t3.micro (1 vCPU): 2-3 workers recommended
- For t3.small (2 vCPU): 4-5 workers recommended

**Memory Consideration:**
- Each worker consumes ~100-200MB RAM
- 3 workers = ~300-600MB RAM usage
- t3.micro has 1GB RAM (adequate for 3 workers)

### How It Works

1. **Container Starts:**
   ```bash
   docker compose up -d
   ```

2. **Migrations Run:**
   ```bash
   python manage.py migrate
   ```

3. **Gunicorn Starts:**
   ```bash
   gunicorn --bind 0.0.0.0:8000 --workers 3 RideReady.wsgi:application
   ```

4. **Workers Spawn:**
   - Master process spawns 3 worker processes
   - Each worker handles incoming requests
   - Workers restart automatically if they crash

### Monitoring

**Check Gunicorn processes:**
```bash
# On EC2 server
ssh ubuntu@your-server-ip
cd ~/ride-ready/backend/RideReady

# View processes
sudo docker compose exec backend ps aux | grep gunicorn

# View logs
sudo docker compose logs -f backend
```

**Expected output:**
```
gunicorn: master [RideReady.wsgi:application]
gunicorn: worker [RideReady.wsgi:application]
gunicorn: worker [RideReady.wsgi:application]
gunicorn: worker [RideReady.wsgi:application]
```

### Tuning Workers

**Increase workers (for more traffic):**

Edit [backend/RideReady/Dockerfile](backend/RideReady/Dockerfile):
```dockerfile
CMD ["sh", "-c", "python manage.py migrate && gunicorn --bind 0.0.0.0:8000 --workers 5 RideReady.wsgi:application"]
```

**Rebuild and deploy:**
```bash
git add backend/RideReady/Dockerfile
git commit -m "perf(backend): increase Gunicorn workers to 5"
git push
```

### Advanced Configuration

**Timeout (default: 30s):**
```dockerfile
CMD ["sh", "-c", "python manage.py migrate && gunicorn --bind 0.0.0.0:8000 --workers 3 --timeout 60 RideReady.wsgi:application"]
```

**Worker Class (async):**
```dockerfile
CMD ["sh", "-c", "python manage.py migrate && gunicorn --bind 0.0.0.0:8000 --workers 3 --worker-class gevent RideReady.wsgi:application"]
```
*Note: Requires `gevent` in requirements.txt*

**Logging:**
```dockerfile
CMD ["sh", "-c", "python manage.py migrate && gunicorn --bind 0.0.0.0:8000 --workers 3 --access-logfile - --error-logfile - RideReady.wsgi:application"]
```

### Performance Comparison

| Server | Workers | Requests/sec | Response Time | Memory |
|--------|---------|--------------|---------------|--------|
| Django dev | 1 | ~50 | 200ms | 150MB |
| Gunicorn | 3 | ~300 | 50ms | 450MB |
| Gunicorn | 5 | ~500 | 40ms | 750MB |

*Based on typical Django REST API with database queries*

### Troubleshooting

**Workers dying/restarting:**
```bash
# Check memory usage
docker stats rideready_backend

# Check logs
sudo docker compose logs backend | grep "WORKER TIMEOUT"
```

**Slow response:**
```bash
# Increase timeout
gunicorn --timeout 60 ...

# Or optimize database queries
python manage.py debugsqlshell
```

**Port conflicts:**
```bash
# Check if port 9000 is in use
sudo lsof -i :9000

# Or change port in docker-compose.yml
ports:
  - "9001:8000"
```

### Related Files

- **Dockerfile:** [backend/RideReady/Dockerfile](backend/RideReady/Dockerfile)
- **Requirements:** [backend/RideReady/requirements.txt](backend/RideReady/requirements.txt)
- **Docker Compose:** [backend/RideReady/docker-compose.yml](backend/RideReady/docker-compose.yml)
- **Deployment:** [.github/workflows/deploy.yml](.github/workflows/deploy.yml)

### References

- [Gunicorn Documentation](https://docs.gunicorn.org/)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/)
- [Gunicorn Workers Configuration](https://docs.gunicorn.org/en/stable/design.html#how-many-workers)
