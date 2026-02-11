#!/bin/bash

#############################################
# RideReady Deployment Helper
#############################################
# Interactive script to help decide what to deploy
#############################################

echo "╔════════════════════════════════════════════════════════════╗"
echo "║        RideReady Monorepo Deployment Helper               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "This script helps you deploy the right part of the application."
echo ""

# Function to check git status
check_changes() {
    local frontend_changes=$(git diff --name-only HEAD origin/main | grep "^frontend/" || echo "")
    local backend_changes=$(git diff --name-only HEAD origin/main | grep "^backend/" || echo "")
    local terraform_changes=$(git diff --name-only HEAD origin/main | grep "^terraform/" || echo "")
    
    if [ -n "$frontend_changes" ]; then
        echo "📝 Frontend changes detected:"
        echo "$frontend_changes" | sed 's/^/   /'
        echo ""
    fi
    
    if [ -n "$backend_changes" ]; then
        echo "📝 Backend changes detected:"
        echo "$backend_changes" | sed 's/^/   /'
        echo ""
    fi
    
    if [ -n "$terraform_changes" ]; then
        echo "📝 Infrastructure changes detected:"
        echo "$terraform_changes" | sed 's/^/   /'
        echo ""
    fi
    
    if [ -z "$frontend_changes" ] && [ -z "$backend_changes" ] && [ -z "$terraform_changes" ]; then
        echo "✅ No changes detected compared to origin/main"
        echo ""
    fi
}

# Check for changes
echo "Checking for changes..."
check_changes

# Show options
echo "What would you like to deploy?"
echo ""
echo "1) 🎨 Frontend only  (React → S3)"
echo "2) 🔧 Backend only   (Django → EC2)"
echo "3) ☁️  Infrastructure (Terraform → AWS)"
echo "4) 🚀 Both Frontend & Backend"
echo "5) 📊 Check deployment status"
echo "6) ❌ Exit"
echo ""

read -p "Enter your choice [1-6]: " choice

case $choice in
    1)
        echo ""
        echo "═══════════════════════════════════════════════════════"
        echo "  Deploying FRONTEND to S3"
        echo "═══════════════════════════════════════════════════════"
        echo ""
        echo "This will:"
        echo "  • Build React application"
        echo "  • Upload to S3 bucket"
        echo "  • Update website content"
        echo ""
        read -p "Continue? [y/N]: " confirm
        if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
            ./deploy-frontend.sh
        else
            echo "Cancelled."
        fi
        ;;
    2)
        echo ""
        echo "═══════════════════════════════════════════════════════"
        echo "  Deploying BACKEND to EC2"
        echo "═══════════════════════════════════════════════════════"
        echo ""
        echo "This will:"
        echo "  • Pull latest code"
        echo "  • Rebuild Docker containers"
        echo "  • Run database migrations"
        echo "  • Collect static files"
        echo ""
        echo "⚠️  This requires SSH access to EC2 server"
        echo ""
        read -p "Continue? [y/N]: " confirm
        if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
            ./deploy.sh
        else
            echo "Cancelled."
        fi
        ;;
    3)
        echo ""
        echo "═══════════════════════════════════════════════════════"
        echo "  Applying Infrastructure Changes"
        echo "═══════════════════════════════════════════════════════"
        echo ""
        echo "This will:"
        echo "  • Run terraform plan"
        echo "  • Show infrastructure changes"
        echo "  • Apply if confirmed"
        echo ""
        read -p "Continue? [y/N]: " confirm
        if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
            cd terraform
            terraform plan
            echo ""
            read -p "Apply these changes? [y/N]: " apply_confirm
            if [ "$apply_confirm" = "y" ] || [ "$apply_confirm" = "Y" ]; then
                terraform apply
            else
                echo "Terraform apply cancelled."
            fi
        else
            echo "Cancelled."
        fi
        ;;
    4)
        echo ""
        echo "═══════════════════════════════════════════════════════"
        echo "  Deploying BOTH Frontend & Backend"
        echo "═══════════════════════════════════════════════════════"
        echo ""
        echo "Recommended order:"
        echo "  1. Deploy Backend first (API changes)"
        echo "  2. Deploy Frontend second (UI updates)"
        echo ""
        read -p "Continue? [y/N]: " confirm
        if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
            echo ""
            echo "Step 1/2: Deploying Backend..."
            ./deploy.sh
            
            echo ""
            echo "Step 2/2: Deploying Frontend..."
            ./deploy-frontend.sh
            
            echo ""
            echo "✅ Full deployment complete!"
        else
            echo "Cancelled."
        fi
        ;;
    5)
        echo ""
        echo "═══════════════════════════════════════════════════════"
        echo "  Deployment Status"
        echo "═══════════════════════════════════════════════════════"
        echo ""
        
        # Check frontend
        echo "📦 Frontend (S3):"
        cd terraform
        FRONTEND_URL=$(terraform output -raw frontend_website_url 2>/dev/null || echo "Not deployed")
        echo "   URL: $FRONTEND_URL"
        
        # Check backend
        echo ""
        echo "🔧 Backend (EC2):"
        BACKEND_IP=$(terraform output -raw backend_public_ip 2>/dev/null || echo "Not deployed")
        echo "   URL: http://$BACKEND_IP:9000"
        echo "   Admin: http://$BACKEND_IP:9000/admin"
        
        # GitHub Actions
        echo ""
        echo "🚀 GitHub Actions:"
        echo "   View pipelines: https://github.com/your-username/ride-ready/actions"
        echo ""
        echo "💡 Tip: Check GitHub Actions for automated deployment status"
        ;;
    6)
        echo "Exiting."
        exit 0
        ;;
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "Done! 🎉"
