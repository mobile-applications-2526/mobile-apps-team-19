# Azure App Service Deployment Guide

## Prerequisites
- Azure account ([Free tier available](https://azure.microsoft.com/free/))
- Azure CLI installed: `winget install Microsoft.AzureCLI`
- Docker Desktop installed and running

## Step 1: Test Docker Build Locally

```bash
# Navigate to Backend folder
cd Backend

# Build the Docker image
docker build -t recall-backend .

# Test locally with docker-compose
docker-compose up
```

Visit `http://localhost:8080/swagger-ui.html` to verify it works.

## Step 2: Azure Login

```bash
az login
```

## Step 3: Create Azure Resources

```bash
# Set variables
RESOURCE_GROUP="recall-app-rg"
LOCATION="westeurope"  # or your preferred region
APP_NAME="recall-backend-api"  # Must be globally unique

# Create resource group
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create App Service Plan (Free tier for testing, change to B1 for production)
az appservice plan create \
  --name recall-app-plan \
  --resource-group $RESOURCE_GROUP \
  --is-linux \
  --sku F1  # Free tier - change to B1 ($13/month) for production

# Create Web App with Docker container
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan recall-app-plan \
  --name $APP_NAME \
  --deployment-container-image-name eclipse-temurin:21-jre-alpine
```

## Step 4: Configure Environment Variables

```bash
# Set production environment variables
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --settings \
    SPRING_PROFILES_ACTIVE=prod \
    SPRING_DATASOURCE_URL="jdbc:postgresql://db.xbkaijymsgwlqwxibdqt.supabase.co:5432/postgres" \
    SPRING_DATASOURCE_USERNAME="postgres" \
    SPRING_DATASOURCE_PASSWORD="VodkaCola7" \
    SUPABASE_URL="YOUR_SUPABASE_URL" \
    SUPABASE_ANON_KEY="YOUR_ANON_KEY" \
    SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_KEY" \
    JWT_SECRET_KEY="YOUR_JWT_SECRET" \
    CORS_ALLOWED_ORIGINS="https://your-app-domain.com,http://localhost:8081"
```

## Step 5: Deploy Using Azure Container Registry (ACR)

### Option A: Using ACR (Recommended for Production)

```bash
# Create Azure Container Registry
ACR_NAME="recallacr"  # Must be globally unique, alphanumeric only
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $ACR_NAME \
  --sku Basic

# Enable admin access
az acr update -n $ACR_NAME --admin-enabled true

# Get ACR credentials
ACR_USERNAME=$(az acr credential show -n $ACR_NAME --query username -o tsv)
ACR_PASSWORD=$(az acr credential show -n $ACR_NAME --query passwords[0].value -o tsv)

# Build and push to ACR
az acr build \
  --registry $ACR_NAME \
  --image recall-backend:latest \
  --file Dockerfile \
  .

# Configure Web App to use ACR image
az webapp config container set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --docker-custom-image-name $ACR_NAME.azurecr.io/recall-backend:latest \
  --docker-registry-server-url https://$ACR_NAME.azurecr.io \
  --docker-registry-server-user $ACR_USERNAME \
  --docker-registry-server-password $ACR_PASSWORD
```

### Option B: Using Docker Hub (Simpler)

```bash
# Build and tag image
docker build -t your-dockerhub-username/recall-backend:latest .

# Login to Docker Hub
docker login

# Push to Docker Hub
docker push your-dockerhub-username/recall-backend:latest

# Configure Web App
az webapp config container set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --docker-custom-image-name your-dockerhub-username/recall-backend:latest
```

## Step 6: Enable Health Check & Logging

```bash
# Enable health check
az webapp config set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --health-check-path "/actuator/health"

# Enable logging
az webapp log config \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --docker-container-logging filesystem

# Stream logs
az webapp log tail \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP
```

## Step 7: Get Your API URL

```bash
echo "Your API is deployed at: https://$APP_NAME.azurewebsites.net"
```

## Update Frontend Configuration

Update your Frontend `.env` file with the deployed API URL:
```
EXPO_PUBLIC_API_URL=https://recall-backend-api.azurewebsites.net
```

## CI/CD with GitHub Actions (Optional)

Create `.github/workflows/azure-deploy.yml` for automatic deployments on push.

## Monitoring & Troubleshooting

```bash
# Check app status
az webapp show --name $APP_NAME --resource-group $RESOURCE_GROUP --query state

# View logs
az webapp log tail --name $APP_NAME --resource-group $RESOURCE_GROUP

# Restart app
az webapp restart --name $APP_NAME --resource-group $RESOURCE_GROUP
```

## Cost Optimization

- **Free tier (F1)**: Good for testing, limited to 60 CPU minutes/day
- **Basic tier (B1)**: ~$13/month, suitable for production
- **Scale up/down**: `az appservice plan update --sku <tier>`

## Cleanup Resources

```bash
# Delete everything when no longer needed
az group delete --name $RESOURCE_GROUP --yes --no-wait
```
