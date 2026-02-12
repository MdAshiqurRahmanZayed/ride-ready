# Auto Scaling & Load Balancing - Quick Reference

## What Was Created

✅ **RDS PostgreSQL** - Production database (replaces Docker PostgreSQL)
✅ **Application Load Balancer** - Distributes traffic across instances
✅ **Auto Scaling Group** - 2-3 instances based on CPU
✅ **Launch Template** - Automated instance setup with user-data
✅ **Security Groups** - ALB, ASG instances, RDS
✅ **CloudWatch Alarms** - CPU monitoring & scaling triggers
✅ **IAM Roles** - S3, CloudWatch, SSM access for EC2

## Files Created

```
terraform/
├── rds.tf              # RDS PostgreSQL database
├── alb.tf              # Application Load Balancer + Target Group
├── launch_template.tf  # Launch template with IAM role
├── asg.tf              # Auto Scaling Group + Scaling Policies
├── user-data.sh        # Bootstrap script for new instances
├── variables.tf        # Updated with ASG/RDS variables
├── terraform.tfvars    # Updated with configuration
├── outputs.tf          # ALB DNS, RDS endpoint, ASG details
└── ASG_SETUP.md        # Complete setup guide
```

## Key Configuration (terraform.tfvars)

**Before deploying, update these:**

```hcl
# REQUIRED: Find second subnets in different AZs
public_subnet_id_2  = ""  # TODO: Add subnet ID
private_subnet_id_2 = ""  # TODO: Add subnet ID

# REQUIRED: Update with your GitHub repo
github_repo_url = "https://github.com/YOUR-USERNAME/ride-ready.git"
github_branch   = "main"

# Auto Scaling Settings
asg_min_size = 2
asg_max_size = 3
asg_cpu_target = 40  # Scale up at 40% CPU
```

## Deployment Commands

```bash
# 1. Find second subnets
aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=vpc-09bc47b9062766336" \
  --query 'Subnets[*].[SubnetId,AvailabilityZone,CidrBlock]' \
  --output table --profile ostad-account

# 2. Update terraform.tfvars with subnet IDs

# 3. Deploy
cd terraform
terraform init
terraform plan   # Review changes
terraform apply  # Deploy (takes 15-20 min)

# 4. Get ALB DNS
terraform output alb_dns_name

# 5. Update frontend
cd ../frontend
echo "REACT_APP_BACKEND_URL=http://YOUR-ALB-DNS" > .env
npm run build
aws s3 sync build/ s3://YOUR-BUCKET --delete --profile ostad-account
```

## How It Works

### Normal Operation (2 instances)
```
Internet → ALB → Instance 1 → RDS
              → Instance 2 → RDS
```

### High Load (CPU > 40%)
```
1. CloudWatch detects CPU > 40%
2. ASG launches Instance 3
3. ALB starts health checks
4. After 2 successful checks, Instance 3 receives traffic
```

### Low Load (CPU < 20%)
```
1. CloudWatch detects CPU < 20% for 15 min
2. ASG terminates 1 instance
3. Always keeps minimum 2 instances
```

## Monitoring

**CloudWatch Dashboard:**
- AWS Console → CloudWatch → Dashboards
- Name: `zayed-ride-ready-dev-backend-dashboard`
- Metrics: CPU, Healthy Hosts, Request Count

**Check Instance Health:**
```bash
aws autoscaling describe-auto-scaling-groups \
  --auto-scaling-group-names zayed-ride-ready-dev-backend-asg \
  --profile ostad-account
```

**Test Health Endpoint:**
```bash
curl http://YOUR-ALB-DNS/api/health-check/
```

## Cost (Monthly)

| Resource | Cost |
|----------|------|
| ALB | $16-18 |
| EC2 (2x t3.micro) | $14 |
| RDS (db.t3.micro) | $15 |
| Data Transfer | $5 |
| **Total** | **~$50/month** |

During scale-up (3 instances): +$7/month

## Important Notes

⚠️ **RDS takes 10 minutes** to create - be patient
⚠️ **User-data script** takes 5 minutes to complete on each instance
⚠️ **Health checks** require 2 successful checks (60 seconds) before instance receives traffic
⚠️ **Scaling activities** log to CloudWatch - check there if issues

## Troubleshooting

**Instances not healthy?**
```bash
ssh -i ~/.ssh/deployment-fun.pem ubuntu@INSTANCE-IP
sudo tail -f /var/log/user-data.log
```

**Database connection failed?**
- User-data waits for RDS automatically
- Check security group allows port 5432 from ASG

**ASG not scaling?**
- Check CloudWatch alarms
- Verify CPU metrics are being reported
- Min/Max size limits may prevent scaling

## Full Guide

See [ASG_SETUP.md](ASG_SETUP.md) for complete documentation.
