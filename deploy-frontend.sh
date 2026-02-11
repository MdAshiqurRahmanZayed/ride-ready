#!/bin/bash

#############################################
# RideReady Frontend Deployment Script
#############################################
# 
# Use this script to manually deploy FRONTEND ONLY to S3
# 
# When to use:
# - After making changes to frontend/ directory
# - After updating React components, styles, or configs
# - When backend URL changes (updates .env)
# - When GitHub Actions is not available
#
# What it does:
# 1. Navigates to frontend/ directory
# 2. Installs/updates npm dependencies
# 3. Creates .env with backend URL
# 4. Builds optimized production bundle
# 5. Uploads build/ to S3 bucket
# 6. Clears old files with --delete flag
#
# Note: Backend is NOT deployed by this script.
#       Use ./deploy.sh for backend deployment.
#
# Requirements:
# - AWS CLI configured with ostad-account profile
# - Terraform outputs available (for bucket name)
# - Node.js 18+ installed
#
# GitHub Actions Alternative:
#   Push to main branch → frontend/** changes trigger auto-deploy
#
#############################################

set -e

echo "🚀 Building and deploying FRONTEND..."

# Navigate to frontend directory
cd "$(dirname "$0")/frontend"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env with backend URL
echo "⚙️  Configuring environment..."
cat > .env << EOF
REACT_APP_BACKEND_URL=http://3.64.19.143/
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
aws s3 sync ./build s3://$BUCKET_NAME --delete --profile ostad-account --region eu-central-1

echo "✅ Frontend deployed successfully!"
echo "🌐 URL: http://$BUCKET_NAME.s3-website.eu-central-1.amazonaws.com"
