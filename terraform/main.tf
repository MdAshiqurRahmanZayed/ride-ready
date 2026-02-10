# Security Group for EC2 Backend
resource "aws_security_group" "backend_sg" {
  name        = "${var.project_name}-${var.environment}-backend-sg"
  description = "Security group for backend EC2 instance"
  vpc_id      = var.vpc_id

  # SSH access
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "SSH from anywhere"
  }

  # HTTP
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP from anywhere"
  }

  # HTTPS
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS from anywhere"
  }

  # Django dev server (optional)
  ingress {
    from_port   = 8000
    to_port     = 8090
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Django application"
  }

  # Outbound
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound"
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-backend-sg"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Security Group for Private EC2 (pgAdmin)
resource "aws_security_group" "pgadmin_sg" {
  name        = "${var.project_name}-${var.environment}-pgadmin-sg"
  description = "Security group for pgAdmin EC2 instance"
  vpc_id      = var.vpc_id

  # SSH from backend server
  ingress {
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.backend_sg.id]
    description     = "SSH from backend"
  }

  # pgAdmin web interface from backend
  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.backend_sg.id]
    description     = "pgAdmin HTTP from backend"
  }

  # PostgreSQL port for database access
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.backend_sg.id]
    description     = "PostgreSQL from backend"
  }

  # ICMP (ping) from backend server
  ingress {
    from_port       = -1
    to_port         = -1
    protocol        = "icmp"
    security_groups = [aws_security_group.backend_sg.id]
    description     = "ICMP ping from backend"
  }

  # Outbound
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound"
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-pgadmin-sg"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Route Table Association for Private Subnet
resource "aws_route_table_association" "private_subnet_association" {
  subnet_id      = var.private_subnet_id
  route_table_id = var.private_route_table_id
}

# EC2 Instance for Backend
resource "aws_instance" "backend" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  key_name              = var.key_name
  subnet_id             = var.public_subnet_id
  vpc_security_group_ids = [aws_security_group.backend_sg.id]

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  user_data = <<-EOF
              #!/bin/bash
              apt-get update
              apt-get install -y python3-pip python3-venv nginx

              # Create app directory
              mkdir -p /opt/rideready
              chown ubuntu:ubuntu /opt/rideready
              EOF

  tags = {
    Name        = "${var.project_name}-${var.environment}-backend"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Elastic IP for Backend
resource "aws_eip" "backend_eip" {
  instance = aws_instance.backend.id
  domain   = "vpc"

  tags = {
    Name        = "${var.project_name}-${var.environment}-backend-eip"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Data source for Ubuntu AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# S3 Bucket for Frontend
resource "aws_s3_bucket" "frontend_bucket" {
  bucket = "${var.project_name}-${var.environment}-frontend"

  tags = {
    Name        = "${var.project_name}-${var.environment}-frontend"
    Environment = var.environment
    Project     = var.project_name
  }
}

# S3 Bucket Public Access
resource "aws_s3_bucket_public_access_block" "frontend_public_access" {
  bucket = aws_s3_bucket.frontend_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# S3 Bucket Policy for Public Read
resource "aws_s3_bucket_policy" "frontend_bucket_policy" {
  bucket = aws_s3_bucket.frontend_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.frontend_bucket.arn}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.frontend_public_access]
}

# S3 Website Configuration
resource "aws_s3_bucket_website_configuration" "frontend_website" {
  bucket = aws_s3_bucket.frontend_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

# S3 Bucket for Media Files
resource "aws_s3_bucket" "media_bucket" {
  bucket = "${var.project_name}-${var.environment}-media"

  tags = {
    Name        = "${var.project_name}-${var.environment}-media"
    Environment = var.environment
    Project     = var.project_name
  }
}

# S3 Media Bucket Public Access
resource "aws_s3_bucket_public_access_block" "media_public_access" {
  bucket = aws_s3_bucket.media_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# S3 Media Bucket Policy
resource "aws_s3_bucket_policy" "media_bucket_policy" {
  bucket = aws_s3_bucket.media_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.media_bucket.arn}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.media_public_access]
}

# Generate .env file for frontend with backend URL
resource "local_file" "frontend_env" {
  content = templatefile("${path.module}/.env.tpl", {
    backend_ip = var.backend_url != "" ? var.backend_url : "http://${aws_eip.backend_eip.public_ip}"
  })
  filename = "${path.module}/../.env"

  depends_on = [aws_eip.backend_eip]
}

# Generate .env file for backend Django app
resource "local_file" "backend_env" {
  content = templatefile("${path.module}/.env.backend.tpl", {
    django_secret_key     = var.django_secret_key
    django_debug          = var.django_debug
    allowed_hosts         = var.django_allowed_hosts != "*" ? var.django_allowed_hosts : "${aws_eip.backend_eip.public_ip},localhost,127.0.0.1"
    use_sqlite            = var.use_sqlite ? "True" : "False"
    db_name               = var.db_name
    db_user               = var.db_username
    db_password           = var.db_password
    db_host               = "db"
    use_s3                = var.use_s3 ? "True" : "False"
    aws_access_key_id     = var.aws_access_key_id
    aws_secret_access_key = var.aws_secret_access_key
    aws_storage_bucket_name = aws_s3_bucket.media_bucket.id
    aws_region            = var.aws_region
    cors_origins          = var.cors_allowed_origins != "" ? var.cors_allowed_origins : var.backend_url != "" ? var.backend_url : "http://${aws_eip.backend_eip.public_ip}"
    frontend_url          = var.backend_url != "" ? var.backend_url : "http://${aws_eip.backend_eip.public_ip}/"
    ssl_store_id          = var.ssl_store_id
    ssl_api_key           = var.ssl_api_key
  })
  filename = "${path.module}/../backend/RideReady/.env"

  depends_on = [aws_eip.backend_eip]
}
