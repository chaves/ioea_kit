#!/bin/bash
# Deployment script for AlwaysData
# This script should be run on the server after git pull

set -e  # Exit on error

echo "🚀 Starting deployment..."

# Navigate to project directory
cd "$(dirname "$0")"

# Pull latest changes (if using git)
# Uncomment if you want to pull from git in this script
# git pull origin main

# Install/update dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Build the application
echo "🏗️  Building application..."
npm run build

# Restart the application
# AlwaysData uses systemd or supervisor - adjust based on your setup
echo "🔄 Restarting application..."
# For AlwaysData, you might need to restart via their interface or use:
# pm2 restart ioea-kit
# or
# supervisorctl restart ioea-kit

echo "✅ Deployment complete!"

