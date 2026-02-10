# RideReady Terraform Infrastructure

## Prerequisites

- AWS CLI configured with your profile
- Terraform >= 1.0
- Existing VPC with public and private subnets
- SSH key pair created in AWS

## Setup

1. Copy the example tfvars file:
```bash
cp terraform.tfvars.example terraform.tfvars
```

2. Edit `terraform.tfvars` with your actual values:
   - AWS profile name
   - VPC ID
   - Subnet IDs (1 public, 2 private in different AZs)
   - EC2 instance type
   - Key pair name
   - Your IP address
   - Database credentials

## Deploy

```bash
# Initialize Terraform
terraform init

# Plan the deployment
terraform plan

# Apply the infrastructure
terraform apply

# View outputs
terraform output
```

## Infrastructure Created

- **EC2 Instance**: Backend Django application server
- **RDS PostgreSQL**: Database in private subnet
- **S3 Buckets**: 
  - Frontend static files (public)
  - Media files (public)
- **Security Groups**: For EC2 and RDS
- **IAM Role**: EC2 role with S3 access
- **Elastic IP**: Static IP for backend

## After Deployment

1. SSH to backend server:
```bash
ssh -i ~/.ssh/your-key.pem ubuntu@<backend-ip>
```

2. Deploy Django application

3. Configure database connection

4. **Frontend .env file is auto-generated** at project root with backend URL

5. Build and upload React frontend to S3:
```bash
npm run build
aws s3 sync build/ s3://<frontend-bucket-name>/
```

## Destroy Infrastructure

```bash
terraform destroy
```

## Outputs

After `terraform apply`, you'll get:
- Backend public IP
- Database endpoint
- S3 bucket names
- Website URLs
- SSH command
