#!/bin/bash

# Quick deployment script for Azure App Service
# Make sure you have Azure CLI installed: winget install Microsoft.AzureCLI

set -e  # Exit on error

echo "🚀 Recall Backend - Azure Deployment Script"
echo "==========================================="
echo ""

# Configuration
RESOURCE_GROUP="recall-app-rg"
LOCATION="westeurope"
APP_NAME="recall-backend-api-$(date +%s)"  # Unique name with timestamp
ACR_NAME="recallacr$(date +%s | tail -c 6)"  # Must be alphanumeric only
PLAN_NAME="recall-app-plan"

echo "📝 Configuration:"
echo "   Resource Group: $RESOURCE_GROUP"
echo "   Location: $LOCATION"
echo "   App Name: $APP_NAME"
echo "   ACR Name: $ACR_NAME"
echo ""

# Check if logged in to Azure
echo "🔐 Checking Azure login status..."
if ! az account show &> /dev/null; then
    echo "❌ Not logged in to Azure. Please login..."
    az login
fi

SUBSCRIPTION=$(az account show --query name -o tsv)
echo "✅ Logged in to subscription: $SUBSCRIPTION"
echo ""

# Create resource group
echo "📦 Creating resource group..."
az group create --name $RESOURCE_GROUP --location $LOCATION --output none
echo "✅ Resource group created"
echo ""

# Create App Service Plan
echo "📋 Creating App Service Plan (Basic B1 - $13/month)..."
az appservice plan create \
  --name $PLAN_NAME \
  --resource-group $RESOURCE_GROUP \
  --is-linux \
  --sku B1 \
  --output none
echo "✅ App Service Plan created"
echo ""

# Create Azure Container Registry
echo "🐳 Creating Azure Container Registry..."
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $ACR_NAME \
  --sku Basic \
  --admin-enabled true \
  --output none
echo "✅ ACR created"
echo ""

# Build and push image to ACR
echo "🏗️  Building Docker image and pushing to ACR (this may take a few minutes)..."
az acr build \
  --registry $ACR_NAME \
  --image recall-backend:latest \
  --file Dockerfile \
  . \
  --output table
echo "✅ Image built and pushed"
echo ""

# Get ACR credentials
echo "🔑 Getting ACR credentials..."
ACR_USERNAME=$(az acr credential show -n $ACR_NAME --query username -o tsv)
ACR_PASSWORD=$(az acr credential show -n $ACR_NAME --query passwords[0].value -o tsv)
ACR_LOGIN_SERVER="$ACR_NAME.azurecr.io"
echo "✅ Credentials retrieved"
echo ""

# Create Web App
echo "🌐 Creating Web App..."
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan $PLAN_NAME \
  --name $APP_NAME \
  --deployment-container-image-name $ACR_LOGIN_SERVER/recall-backend:latest \
  --docker-registry-server-url https://$ACR_LOGIN_SERVER \
  --docker-registry-server-user $ACR_USERNAME \
  --docker-registry-server-password "$ACR_PASSWORD" \
  --output none
echo "✅ Web App created"
echo ""

# Configure environment variables
echo "⚙️  Configuring environment variables..."
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --settings \
    SPRING_PROFILES_ACTIVE=prod \
    WEBSITES_PORT=8080 \
    JAVA_OPTS="-Xms256m -Xmx512m" \
  --output none

echo "⚠️  Please set these sensitive environment variables manually:"
echo "   az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $APP_NAME --settings \\"
echo "     SPRING_DATASOURCE_PASSWORD='your-db-password' \\"
echo "     SUPABASE_URL='your-supabase-url' \\"
echo "     SUPABASE_ANON_KEY='your-anon-key' \\"
echo "     SUPABASE_SERVICE_ROLE_KEY='your-service-key' \\"
echo "     JWT_SECRET_KEY='your-jwt-secret' \\"
echo "     CORS_ALLOWED_ORIGINS='https://your-frontend.com,http://localhost:8081'"
echo ""

# Enable health check
echo "🏥 Enabling health check..."
az webapp config set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --health-check-path "/actuator/health" \
  --output none
echo "✅ Health check enabled"
echo ""

# Enable logging
echo "📊 Enabling container logging..."
az webapp log config \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --docker-container-logging filesystem \
  --output none
echo "✅ Logging enabled"
echo ""

# Get app URL
APP_URL="https://$APP_NAME.azurewebsites.net"

echo "========================================="
echo "🎉 Deployment Complete!"
echo "========================================="
echo ""
echo "📍 Your API URL: $APP_URL"
echo "📍 Swagger UI: $APP_URL/swagger-ui.html"
echo "📍 Health Check: $APP_URL/actuator/health"
echo ""
echo "🔧 Next steps:"
echo "   1. Set the sensitive environment variables (see above)"
echo "   2. Update your Frontend .env file with: EXPO_PUBLIC_API_URL=$APP_URL"
echo "   3. View logs: az webapp log tail --name $APP_NAME --resource-group $RESOURCE_GROUP"
echo "   4. Monitor: https://portal.azure.com"
echo ""
echo "💰 Estimated cost: ~$13/month (Basic B1 plan + minimal ACR usage)"
echo ""
