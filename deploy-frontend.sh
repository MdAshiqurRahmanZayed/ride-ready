#!/bin/bash

# Build and deploy React frontend to S3

set -e

echo "🚀 Building and deploying frontend..."

# Navigate to project root
cd "$(dirname "$0")"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env with backend URL
echo "⚙️  Configuring environment..."
cat > .env << EOF
REACT_APP_BACKEND_URL=http://3.64.19.143:9000
EOF

# Build production bundle
echo "🏗️  Building production bundle..."
npm run build

# Get S3 bucket name from Terraform
echo "📥 Getting S3 bucket name..."
cd terraform
BUCKET_NAME=$(terraform output -raw frontend_bucket_name 2>/dev/null || echo "")

if [ -z "$BUCKET_NAME" ]; then
    echo "❌ Could not get S3 bucket name from Terraform"
    echo "Run 'terraform apply' first or set BUCKET_NAME manually"
    exit 1
fi

# Upload to S3
echo "☁️  Uploading to S3: $BUCKET_NAME"
aws s3 sync ../build s3://$BUCKET_NAME --delete --profile ostad-account --region eu-central-1

echo "✅ Frontend deployed successfully!"
echo "🌐 URL: http://$BUCKET_NAME.s3-website.eu-central-1.amazonaws.com"
