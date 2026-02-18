#!/bin/bash

# Cloud Run Deployment Script for CSN React Node
# Usage: ./deploy.sh

# ==========================================
# CONFIGURATION (PLEASE EDIT BEFORE RUNNING)
# ==========================================
PROJECT_ID="csn-production-2026"
REGION="us-central1"

# Backend Secrets
DATABASE_URL="postgresql://user:password@hostname:5432/dbname?sslmode=require"
JWT_SECRET="your-jwt-secret"
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLERK_SECRET_KEY=sk_test_...
RAZORPAY_KEY_ID="your_razorpay_id"
RAZORPAY_KEY_SECRET="your_razorpay_secret"

# Frontend Secrets
VITE_API_URL=http://localhost:3001
VITE_WEB3FORMS_KEY=your_web3forms_key
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...


# ==========================================

echo "🚀 Starting Deployment to Google Cloud Run..."
echo "Project: $PROJECT_ID"
echo "Region:  $REGION"

# Check if gcloud is installed
GCLOUD_BIN="$HOME/Desktop/google-cloud-sdk/bin/gcloud"
if [ ! -f "$GCLOUD_BIN" ]; then
    echo "❌ Error: gcloud CLI not found at $GCLOUD_BIN"
    echo "Please ensure the Google Cloud SDK is installed on your Desktop."
    exit 1
fi

# 1. Deploy Backend
echo "----------------------------------------"
echo "📦 Deploying Backend (Server)..."
echo "----------------------------------------"

$GCLOUD_BIN builds submit ./server --tag gcr.io/$PROJECT_ID/csn-server

$GCLOUD_BIN run deploy csn-server \
  --image gcr.io/$PROJECT_ID/csn-server \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production" \
  --set-env-vars="DATABASE_URL=$DATABASE_URL" \
  --set-env-vars="JWT_SECRET=$JWT_SECRET" \
  --set-env-vars="CLERK_SECRET_KEY=$CLERK_SECRET_KEY" \
  --set-env-vars="RAZORPAY_KEY_ID=$RAZORPAY_KEY_ID" \
  --set-env-vars="RAZORPAY_KEY_SECRET=$RAZORPAY_KEY_SECRET" \
  --set-env-vars="CLOUDINARY_CLOUD_NAME=$CLOUDINARY_CLOUD_NAME" \
  --set-env-vars="CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY" \
  --set-env-vars="CLOUDINARY_API_SECRET=$CLOUDINARY_API_SECRET" \
  --set-env-vars="CORS_ORIGIN=*"

# Capture Server URL
SERVER_URL=$($GCLOUD_BIN run services describe csn-server --region $REGION --format 'value(status.url)')
echo "✅ Backend Deployed at: $SERVER_URL"

# 2. Deploy Frontend
echo "----------------------------------------"
echo "🎨 Deploying Frontend (Client)..."
echo "----------------------------------------"

# Use Cloud Build config for safe build-time arg injection
$GCLOUD_BIN builds submit ./client \
  --config ./client/cloudbuild.yaml \
  --substitutions=_VITE_API_URL="$SERVER_URL",_VITE_CLERK_PUBLISHABLE_KEY="$VITE_CLERK_PUBLISHABLE_KEY",_VITE_WEB3FORMS_KEY="$VITE_WEB3FORMS_KEY"

$GCLOUD_BIN run deploy csn-client \
  --image gcr.io/$PROJECT_ID/csn-client \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated

# Capture Client URL
CLIENT_URL=$($GCLOUD_BIN run services describe csn-client --region $REGION --format 'value(status.url)')
echo "✅ Frontend Deployed at: $CLIENT_URL"

# 3. Secure Backend CORS
echo "----------------------------------------"
echo "🔒 Securing Backend CORS..."
echo "----------------------------------------"

$GCLOUD_BIN run services update csn-server \
  --region $REGION \
  --update-env-vars="CORS_ORIGIN=https://csnworld.com"

echo "========================================"
echo "🎉 Deployment Complete!"
echo "Backend:  $SERVER_URL"
echo "Frontend: $CLIENT_URL"
echo "========================================"
