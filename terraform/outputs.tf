output "backend_public_ip" {
  description = "Public IP of backend EC2 instance (legacy - use ALB instead)"
  value       = try(aws_eip.backend_eip.public_ip, "N/A - Using ALB")
}

output "backend_instance_id" {
  description = "EC2 Instance ID (legacy - using ASG now)"
  value       = try(aws_instance.backend.id, "N/A - Using ASG")
}

# Application Load Balancer Outputs
output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.backend_alb.dns_name
}

output "alb_zone_id" {
  description = "Zone ID of the Application Load Balancer"
  value       = aws_lb.backend_alb.zone_id
}

output "alb_arn" {
  description = "ARN of the Application Load Balancer"
  value       = aws_lb.backend_alb.arn
}

output "target_group_arn" {
  description = "ARN of the Target Group"
  value       = aws_lb_target_group.backend_tg.arn
}

output "backend_url" {
  description = "Backend API URL (use this for frontend)"
  value       = "http://${aws_lb.backend_alb.dns_name}"
}

# RDS disabled - using Docker PostgreSQL on each instance
# Note: Each instance has its own database (not shared)
# output "rds_endpoint" {
#   description = "RDS PostgreSQL endpoint"
#   value       = aws_db_instance.postgres.endpoint
# }

# Auto Scaling Group Outputs
output "asg_name" {
  description = "Name of the Auto Scaling Group"
  value       = aws_autoscaling_group.backend.name
}

output "asg_arn" {
  description = "ARN of the Auto Scaling Group"
  value       = aws_autoscaling_group.backend.arn
}

output "asg_min_size" {
  description = "Minimum size of ASG"
  value       = aws_autoscaling_group.backend.min_size
}

output "asg_max_size" {
  description = "Maximum size of ASG"
  value       = aws_autoscaling_group.backend.max_size
}

output "asg_desired_capacity" {
  description = "Desired capacity of ASG"
  value       = aws_autoscaling_group.backend.desired_capacity
}

# Legacy database outputs removed (using Docker PostgreSQL)

output "frontend_bucket_name" {
  description = "S3 frontend bucket name"
  value       = aws_s3_bucket.frontend_bucket.id
}

output "frontend_website_endpoint" {
  description = "S3 website endpoint"
  value       = aws_s3_bucket_website_configuration.frontend_website.website_endpoint
}

output "frontend_website_url" {
  description = "S3 website URL"
  value       = "http://${aws_s3_bucket_website_configuration.frontend_website.website_endpoint}"
}

output "media_bucket_name" {
  description = "S3 media bucket name"
  value       = aws_s3_bucket.media_bucket.id
}

output "media_bucket_domain" {
  description = "S3 media bucket domain"
  value       = "${aws_s3_bucket.media_bucket.id}.s3.amazonaws.com"
}

output "ssh_command" {
  description = "SSH command to connect to backend"
  value       = "ssh -i ~/.ssh/${var.key_name}.pem ubuntu@${aws_eip.backend_eip.public_ip}"
}

output "database_info" {
  description = "Database information"
  value       = "PostgreSQL runs in Docker container on backend server. Connect via docker compose exec db psql -U rideready -d rideready_db"
}

output "frontend_env_file" {
  description = "Frontend .env file location"
  value       = "Generated at project root: .env with backend URL ${var.backend_url != "" ? var.backend_url : "http://${aws_eip.backend_eip.public_ip}"}/"
}

output "backend_env_file" {
  description = "Backend .env file location"
  value       = "Generated at backend/RideReady/.env with all configuration"
}
