# Django Configuration
DJANGO_SECRET_KEY=${django_secret_key}
DJANGO_DEBUG=${django_debug}
DJANGO_ALLOWED_HOSTS=${allowed_hosts}

# Database Configuration
USE_SQLITE=${use_sqlite}
DB_NAME=${db_name}
DB_USER=${db_user}
DB_PASSWORD=${db_password}
DB_HOST=${db_host}
DB_PORT=5432

# AWS S3 Configuration
USE_S3=${use_s3}
%{ if aws_access_key_id != "" ~}
AWS_ACCESS_KEY_ID=${aws_access_key_id}
%{ endif ~}
%{ if aws_secret_access_key != "" ~}
AWS_SECRET_ACCESS_KEY=${aws_secret_access_key}
%{ endif ~}
AWS_STORAGE_BUCKET_NAME=${aws_storage_bucket_name}
AWS_S3_REGION_NAME=${aws_region}

# CORS Configuration
CORS_ALLOWED_ORIGINS=${cors_origins}
FRONTEND_URL=${frontend_url}

# SSL Commerce
SSL_STORE_ID=${ssl_store_id}
SSL_API_KEY=${ssl_api_key}
