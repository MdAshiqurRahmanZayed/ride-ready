# Load Balancing & Auto Scaling Setup Guide

## Overview
This guide walks through deploying RideReady with:
- **Application Load Balancer (ALB)** for traffic distribution
- **Auto Scaling Group (ASG)** with 2-3 instances
- **RDS PostgreSQL** for production database
- **Automatic scaling** based on CPU utilization

## Architecture

```
Internet
    ↓
Application Load Balancer (ALB)
    ↓
Target Group (Health Check: /api/health-check/)
    ↓
Auto Scaling Group (2-3 instances)
    ↓
RDS PostgreSQL (Private Subnet)
```

**Scaling Policy:**
- Scale UP when CPU > 40% (add 1 instance)
- Scale DOWN when CPU < 20% (remove 1 instance)
- Min instances: 2
- Max instances: 3

## Prerequisites

1. **Find Second Subnets** (different AZs for high availability):
```bash
# List all subnets in your VPC
aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=vpc-09bc47b9062766336" \
  --query 'Subnets[*].[SubnetId,AvailabilityZone,CidrBlock,Tags[?Key==`Name`].Value|[0]]' \
  --output table \
  --profile ostad-account
```

2. **Update terraform.tfvars** with second subnet IDs:
```hcl
public_subnet_id_2  = "subnet-xxxxxxxxx"  # Different AZ from public_subnet_id
private_subnet_id_2 = "subnet-xxxxxxxxx"  # Different AZ from private_subnet_id
```

3. **Update GitHub Repository URL**:
```hcl
github_repo_url = "https://github.com/your-username/ride-ready.git"
github_branch   = "main"
```

## Deployment Steps

### Step 1: Initialize Terraform
```bash
cd terraform
terraform init
```

### Step 2: Review Changes
```bash
terraform plan
```

**Expected Resources:**
- 1 RDS PostgreSQL instance
- 1 Application Load Balancer
- 1 Target Group
- 1 Launch Template
- 1 Auto Scaling Group
- 3 Security Groups (ALB, ASG, RDS)
- 2-3 EC2 instances (via ASG)
- CloudWatch alarms & dashboard

### Step 3: Deploy Infrastructure
```bash
terraform apply
```

**Deployment Time:** ~15-20 minutes
- RDS creation: ~10 minutes
- ALB creation: ~3 minutes
- ASG instances: ~5 minutes (user-data script execution)

### Step 4: Get Outputs
```bash
terraform output
```

**Important Outputs:**
```
alb_dns_name          = "zayed-ride-ready-dev-alb-123456789.eu-central-1.elb.amazonaws.com"
backend_url           = "http://zayed-ride-ready-dev-alb-123456789.eu-central-1.elb.amazonaws.com"
rds_endpoint          = "zayed-ride-ready-dev-db.xxxxx.eu-central-1.rds.amazonaws.com:5432"
asg_name              = "zayed-ride-ready-dev-backend-asg"
frontend_website_url  = "http://zayed-ride-ready-dev-frontend.s3-website.eu-central-1.amazonaws.com"
```

### Step 5: Update Frontend Environment
Update [frontend/.env](../frontend/.env):
```bash
REACT_APP_BACKEND_URL=http://YOUR-ALB-DNS-NAME
```

Rebuild and redeploy frontend:
```bash
cd frontend
npm run build
aws s3 sync build/ s3://YOUR-FRONTEND-BUCKET --delete --profile ostad-account
```

## Monitoring & Management

### Check ASG Status
```bash
# List instances in ASG
aws autoscaling describe-auto-scaling-groups \
  --auto-scaling-group-names zayed-ride-ready-dev-backend-asg \
  --profile ostad-account \
  --query 'AutoScalingGroups[0].Instances[*].[InstanceId,HealthStatus,LifecycleState]' \
  --output table

# Check target health in ALB
aws elbv2 describe-target-health \
  --target-group-arn $(terraform output -raw target_group_arn) \
  --profile ostad-account
```

### View CloudWatch Dashboard
1. Go to AWS Console → CloudWatch → Dashboards
2. Open: `zayed-ride-ready-dev-backend-dashboard`
3. Monitor: CPU utilization, Healthy hosts, Request count

### Manual Scaling
```bash
# Scale to 3 instances
aws autoscaling set-desired-capacity \
  --auto-scaling-group-name zayed-ride-ready-dev-backend-asg \
  --desired-capacity 3 \
  --profile ostad-account

# Scale to 2 instances
aws autoscaling set-desired-capacity \
  --auto-scaling-group-name zayed-ride-ready-dev-backend-asg \
  --desired-capacity 2 \
  --profile ostad-account
```

### Access Instance Logs
```bash
# Get instance IDs
aws autoscaling describe-auto-scaling-groups \
  --auto-scaling-group-names zayed-ride-ready-dev-backend-asg \
  --profile ostad-account \
  --query 'AutoScalingGroups[0].Instances[*].InstanceId' \
  --output text

# SSH to instance
ssh -i ~/.ssh/deployment-fun.pem ubuntu@INSTANCE-PUBLIC-IP

# View user-data logs
sudo tail -f /var/log/user-data.log

# View application logs
cd /home/ubuntu/ride-ready/backend/RideReady
sudo docker-compose logs -f backend
```

## Health Checks

**ALB Health Check:**
- Path: `/api/health-check/`
- Interval: 30 seconds
- Timeout: 5 seconds
- Healthy threshold: 2 consecutive successes
- Unhealthy threshold: 3 consecutive failures

**Test Health Endpoint:**
```bash
curl http://YOUR-ALB-DNS-NAME/api/health-check/
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-12T10:30:00.123456",
  "database": "healthy",
  "service": "RideReady API"
}
```

## Database Migration

### Initial Setup (Automatic)
User-data script automatically:
1. Waits for RDS to be ready
2. Runs migrations: `python manage.py migrate`
3. Collects static files (if needed)

### Manual Migration
```bash
# SSH to any ASG instance
ssh -i ~/.ssh/deployment-fun.pem ubuntu@INSTANCE-IP

cd /home/ubuntu/ride-ready/backend/RideReady
sudo docker-compose exec backend python manage.py migrate
```

## Troubleshooting

### Instances Failing Health Checks
```bash
# Check target health
aws elbv2 describe-target-health \
  --target-group-arn $(terraform output -raw target_group_arn) \
  --profile ostad-account

# SSH to unhealthy instance and check logs
ssh -i ~/.ssh/deployment-fun.pem ubuntu@INSTANCE-IP
sudo tail -100 /var/log/user-data.log
cd /home/ubuntu/ride-ready/backend/RideReady
sudo docker-compose logs backend
```

**Common Issues:**
- Database not ready → user-data waits automatically
- Docker build failed → check logs for missing dependencies
- Health endpoint unreachable → verify port 9000 is open

### RDS Connection Issues
```bash
# Test from ASG instance
ssh -i ~/.ssh/deployment-fun.pem ubuntu@INSTANCE-IP
pg_isready -h YOUR-RDS-ENDPOINT -p 5432 -U rideready -d rideready_db
```

### ASG Not Scaling
```bash
# Check CloudWatch alarms
aws cloudwatch describe-alarms \
  --alarm-name-prefix zayed-ride-ready-dev \
  --profile ostad-account

# Check scaling activities
aws autoscaling describe-scaling-activities \
  --auto-scaling-group-name zayed-ride-ready-dev-backend-asg \
  --max-records 10 \
  --profile ostad-account
```

## Cost Estimation (eu-central-1)

**Monthly Costs:**
- ALB: ~$16-18/month
- EC2 (2x t3.micro): ~$14/month
- RDS (db.t3.micro): ~$15/month
- Data transfer: ~$5/month
- **Total: ~$50-52/month**

**During Scale Up (3 instances):**
- Additional t3.micro: +$7/month
- **Total: ~$57-59/month**

## Rollback to Single Instance

If you need to revert to single EC2 instance:

```bash
# Option 1: Keep resources but scale down
aws autoscaling update-auto-scaling-group \
  --auto-scaling-group-name zayed-ride-ready-dev-backend-asg \
  --min-size 0 --max-size 0 --desired-capacity 0 \
  --profile ostad-account

# Option 2: Destroy ASG/ALB resources (comment out in Terraform)
# Comment out these files in main.tf:
# - alb.tf
# - asg.tf
# - launch_template.tf
# Then run:
terraform apply
```

## Next Steps

1. **Add SSL Certificate** for HTTPS:
   - Request certificate in ACM
   - Uncomment HTTPS listener in [alb.tf](alb.tf)
   - Update frontend to use `https://`

2. **Enable Multi-AZ RDS** for production:
   ```hcl
   rds_multi_az = true
   ```

3. **Add CloudWatch Alarms** with SNS notifications

4. **Configure Auto Scaling Schedule** for predictable traffic patterns

5. **Create AMI** from running instance for faster launch time

## Support

For issues or questions, check:
- [DEPLOYMENT.md](../DEPLOYMENT.md) - General deployment guide
- [README.md](../README.md) - Project overview
- User-data logs: `/var/log/user-data.log` on EC2 instances
- Application logs: `docker-compose logs -f backend`
