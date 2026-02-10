# Frontend Deployment Guide

## Prerequisites

1. **AWS CLI configured** with your profile:
```bash
aws configure --profile ostad-account
```

2. **Terraform applied** to create S3 bucket:
```bash
cd terraform
terraform apply
```

## Manual Deployment

### 1. Build and Deploy
```bash
# Make script executable
chmod +x deploy-frontend.sh

# Deploy
./deploy-frontend.sh
```

### 2. Get Frontend URL
```bash
cd terraform
terraform output frontend_website_url
```

## GitHub Actions Deployment

### 1. Add Repository Secrets
Go to GitHub → Settings → Secrets → Actions:

- `BACKEND_URL`: http://your-backend-ip:9000
- `AWS_ACCESS_KEY_ID`: Your AWS access key
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
- `S3_BUCKET_NAME`: Get from `terraform output frontend_bucket_name`

### 2. Auto-Deploy on Push
```bash
git add .
git commit -m "Update frontend"
git push origin main
```

## Update Backend URL

### Option 1: During Build
```bash
# Edit .env
echo "REACT_APP_BACKEND_URL=http://your-ip:9000" > .env

# Build
npm run build

# Deploy
./deploy-frontend.sh
```

### Option 2: Environment Variable
```bash
REACT_APP_BACKEND_URL=http://your-ip:9000 npm run build
```

## Manual S3 Upload

```bash
# Build
npm run build

# Upload
aws s3 sync build/ s3://zayed-ride-ready-dev-frontend --delete --profile ostad-account
```

## Custom Domain (Optional)

### 1. Add CloudFront Distribution
```hcl
# Add to terraform/main.tf
resource "aws_cloudfront_distribution" "frontend" {
  # ... configuration
}
```

### 2. Configure Route53
```bash
# Add DNS record pointing to CloudFront
```

## URLs

- **Development**: http://localhost:3000
- **S3 Website**: http://bucket-name.s3-website.eu-central-1.amazonaws.com
- **Backend API**: http://backend-ip:9000

## Troubleshooting

### CORS Issues
Update backend `.env`:
```bash
CORS_ALLOWED_ORIGINS=http://bucket-name.s3-website.eu-central-1.amazonaws.com
```

### 404 on Routes
S3 website config already set to redirect to index.html

### Build Fails
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run build
```
