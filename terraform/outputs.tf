output "backend_public_ip" {
  description = "Public IP of backend EC2 instance"
  value       = aws_eip.backend_eip.public_ip
}

output "backend_instance_id" {
  description = "EC2 Instance ID"
  value       = aws_instance.backend.id
}

output "db_endpoint" {
  description = "Database server private IP"
  value       = aws_instance.pgadmin.private_ip
}

output "db_address" {
  description = "Database server private IP"
  value       = aws_instance.pgadmin.private_ip
}

output "db_port" {
  description = "Database port"
  value       = "5432"
}

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

output "pgadmin_private_ip" {
  description = "Private IP of pgAdmin EC2 instance"
  value       = aws_instance.pgadmin.private_ip
}

output "pgadmin_connection_guide" {
  description = "How to access pgAdmin"
  value       = "SSH tunnel: ssh -i ~/.ssh/${var.key_name}.pem -L 8080:${aws_instance.pgadmin.private_ip}:80 ubuntu@${aws_eip.backend_eip.public_ip}, then browse to http://localhost:8080"
}

output "frontend_env_file" {
  description = "Frontend .env file location"
  value       = "Generated at project root: .env with backend URL ${var.backend_url != "" ? var.backend_url : "http://${aws_eip.backend_eip.public_ip}"}/"
}

output "backend_env_file" {
  description = "Backend .env file location"
  value       = "Generated at backend/RideReady/.env with all configuration"
}
