FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p media static

EXPOSE 8000

# Run migrations then start Gunicorn with 3 workers for production
# - Binds to 0.0.0.0:8000 (accessible from host)
# - 3 workers handle concurrent requests efficiently
# - Each worker can handle multiple requests using async
CMD ["sh", "-c", "python manage.py migrate && gunicorn --bind 0.0.0.0:8000 --workers 3 RideReady.wsgi:application"]
