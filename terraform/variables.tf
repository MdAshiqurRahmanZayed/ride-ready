variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "aws_profile" {
  description = "AWS CLI profile name"
  type        = string
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "ride-ready"
}

variable "environment" {
  description = "Environment (dev/staging/prod)"
  type        = string
  default     = "dev"
}

# Existing VPC and Subnet
variable "vpc_id" {
  description = "Existing VPC ID"
  type        = string
}

variable "public_subnet_id" {
  description = "Existing public subnet ID for EC2"
  type        = string
}

variable "private_subnet_id" {
  description = "Existing private subnet ID for RDS"
  type        = string
}

variable "private_subnet_id_2" {
  description = "Second private subnet ID for RDS (different AZ) - optional, will auto-find if not provided"
  type        = string
  default     = ""
}

variable "public_subnet_id_2" {
  description = "Second public subnet ID for ALB (different AZ)"
  type        = string
  default     = ""
}

variable "nat_gateway_id" {
  description = "Existing NAT Gateway ID for private subnet"
  type        = string
}

variable "private_route_table_id" {
  description = "Existing route table ID for private subnet"
  type        = string
}

# EC2 Configuration
variable "instance_type" {
  description = "EC2 instance type for backend server"
  type        = string
}

variable "key_name" {
  description = "SSH key pair name"
  type        = string
}

variable "db_instance_type" {
  description = "EC2 instance type for database management server (pgAdmin)"
  type        = string
  default     = "t3.micro"
}

# RDS Configuration
variable "db_name" {
  description = "Database name"
  type        = string
  default     = "rideready"
}

variable "db_username" {
  description = "Database master username"
  type        = string
  default     = "admin"
}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

# Frontend Configuration
variable "backend_url" {
  description = "Backend API URL for frontend (will use Elastic IP if not provided)"
  type        = string
  default     = ""
}

# Django Backend Configuration
variable "django_secret_key" {
  description = "Django SECRET_KEY"
  type        = string
  sensitive   = true
}

variable "django_debug" {
  description = "Django DEBUG mode"
  type        = string
  default     = "False"
}

variable "django_allowed_hosts" {
  description = "Django ALLOWED_HOSTS (comma-separated)"
  type        = string
  default     = "*"
}

variable "use_sqlite" {
  description = "Use SQLite instead of PostgreSQL"
  type        = bool
  default     = false
}

variable "cors_allowed_origins" {
  description = "CORS allowed origins (comma-separated)"
  type        = string
  default     = ""
}

variable "ssl_store_id" {
  description = "SSL Commerce Store ID"
  type        = string
  default     = ""
}

variable "ssl_api_key" {
  description = "SSL Commerce API Key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "use_s3" {
  description = "Use S3 for static and media files"
  type        = bool
  default     = true
}

variable "aws_access_key_id" {
  description = "AWS Access Key ID for S3 (leave empty to use IAM role)"
  type        = string
  sensitive   = true
  default     = ""
}

variable "aws_secret_access_key" {
  description = "AWS Secret Access Key for S3 (leave empty to use IAM role)"
  type        = string
  sensitive   = true
  default     = ""
}

# RDS PostgreSQL Configuration
variable "rds_engine_version" {
  description = "PostgreSQL engine version"
  type        = string
  default     = "15.4"
}

variable "rds_allocated_storage" {
  description = "Allocated storage for RDS (GB)"
  type        = number
  default     = 20
}

variable "rds_multi_az" {
  description = "Enable Multi-AZ for RDS"
  type        = bool
  default     = false
}

variable "rds_backup_retention_days" {
  description = "RDS backup retention period in days"
  type        = number
  default     = 7
}

# Auto Scaling Configuration
variable "ami_id" {
  description = "AMI ID for launch template (Ubuntu 22.04 LTS recommended)"
  type        = string
  default     = "ami-0084a47cc718c111a" # Ubuntu 22.04 LTS eu-central-1
}

variable "asg_min_size" {
  description = "Minimum number of instances in ASG"
  type        = number
  default     = 2
}

variable "asg_max_size" {
  description = "Maximum number of instances in ASG"
  type        = number
  default     = 3
}

variable "asg_desired_capacity" {
  description = "Desired number of instances in ASG"
  type        = number
  default     = 2
}

variable "asg_cpu_target" {
  description = "Target CPU utilization for scaling (percentage)"
  type        = number
  default     = 40
}

# GitHub Repository
variable "github_repo_url" {
  description = "GitHub repository URL"
  type        = string
  default     = "https://github.com/your-username/ride-ready.git"
}

variable "github_branch" {
  description = "GitHub branch to deploy"
  type        = string
  default     = "main"
}

