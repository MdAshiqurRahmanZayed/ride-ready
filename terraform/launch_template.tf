# Launch Template for Backend Auto Scaling Group

# Launch Template
resource "aws_launch_template" "backend" {
  name_prefix   = "${var.project_name}-${var.environment}-backend-"
  image_id      = var.ami_id
  instance_type = var.instance_type
  key_name      = var.key_name

  vpc_security_group_ids = [aws_security_group.backend_asg_sg.id]

  user_data = base64encode(templatefile("${path.module}/user-data.sh", {
    db_name               = var.db_name
    db_user               = var.db_username
    db_password           = var.db_password
    django_secret_key     = var.django_secret_key
    django_debug          = var.django_debug
    django_allowed_hosts  = "${aws_lb.backend_alb.dns_name},localhost,127.0.0.1"
    aws_access_key_id     = var.aws_access_key_id
    aws_secret_access_key = var.aws_secret_access_key
    aws_bucket_name       = aws_s3_bucket.media_bucket.bucket
    aws_region            = var.aws_region
    cors_allowed_origins  = var.backend_url != "" ? var.backend_url : "http://${aws_lb.backend_alb.dns_name}"
    frontend_url          = var.backend_url != "" ? var.backend_url : "http://${aws_lb.backend_alb.dns_name}"
    ssl_store_id          = var.ssl_store_id
    ssl_api_key           = var.ssl_api_key
    github_repo           = var.github_repo_url
    github_branch         = var.github_branch
  }))

  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"
    http_put_response_hop_limit = 1
    instance_metadata_tags      = "enabled"
  }

  monitoring {
    enabled = true
  }

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name        = "${var.project_name}-${var.environment}-backend-asg"
      Environment = var.environment
      ManagedBy   = "Terraform"
      AutoScaling = "true"
    }
  }

  tag_specifications {
    resource_type = "volume"
    tags = {
      Name        = "${var.project_name}-${var.environment}-backend-volume"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-backend-lt"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}
