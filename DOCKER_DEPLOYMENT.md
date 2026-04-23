# 🐳 Docker Deployment Guide

Deploy your app in Docker containers - for maximum control and portability.

## What is Docker?

Docker packages your app with all dependencies into a container that runs anywhere:
- Local machine
- AWS, Google Cloud, Azure
- DigitalOcean, Linode, etc.
- Your own server

---

## Prerequisites

✅ Docker Desktop installed  
- Windows: https://www.docker.com/products/docker-desktop
- Mac: Same link
- Linux: `sudo apt-get install docker.io`

Verify installation:
```bash
docker --version
docker run hello-world
```

---

## Option 1: Local Testing with Docker

### 1.1 Build the Image

```bash
cd c:\Users\Dell\Documents\breed-detection-ai
docker build -t breed-detection-ai:latest .
```

This creates an image with everything bundled.

### 1.2 Run the Container

```bash
docker run -p 8000:8000 breed-detection-ai:latest
```

Then open: http://localhost:8000

### 1.3 Stop the Container

```bash
# Find container ID
docker ps

# Stop it
docker stop CONTAINER_ID
```

---

## Option 2: Deploy to Cloud Container Services

### Platform Comparison

| Platform | Cost | Complexity | Free Tier | Best For |
|----------|------|-----------|-----------|----------|
| **Google Cloud Run** | Per request | ⭐⭐ Medium | Free monthly | Simple deployment |
| **AWS ECS + Fargate** | Per hour | ⭐⭐⭐ Complex | 1 year free | Complex setups |
| **Azure Container Instances** | Per second | ⭐⭐ Medium | Free trial | Azure ecosystem |
| **DigitalOcean App Platform** | $5-12/month | ⭐ Easy | Paid | Simplicity |
| **Heroku Containers** | Paid only | ⭐ Easy | None | (Deprecated) |

---

## Google Cloud Run (Recommended)

### 2.1 Prerequisites

1. Install Google Cloud CLI: https://cloud.google.com/sdk/docs/install
2. Create GCP account: https://console.cloud.google.com
3. Create a project in GCP

### 2.2 Setup

```bash
# Login
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 2.3 Deploy

```bash
cd c:\Users\Dell\Documents\breed-detection-ai

# Deploy from Dockerfile
gcloud run deploy breed-detection-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --memory 512Mi \
  --port 8000 \
  --allow-unauthenticated
```

Takes 5-10 minutes. You get a public URL automatically!

### 2.4 Get Your URL

```bash
gcloud run services list
# Shows: https://breed-detection-api-xxxx.a.run.app
```

---

## AWS with ECR & ECS

For more complex deployments.

### 3.1 Setup AWS

```bash
# Install AWS CLI
# Windows: https://aws.amazon.com/cli/
# Or: pip install awscli

# Configure
aws configure
# Enter: Access Key, Secret Key, Region (us-east-1), Output (json)
```

### 3.2 Create ECR Repository

```bash
# Create registry for your image
aws ecr create-repository --repository-name breed-detection-ai

# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
```

### 3.3 Build and Push

```bash
# Build
docker build -t breed-detection-ai:latest .

# Tag
docker tag breed-detection-ai:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/breed-detection-ai:latest

# Push
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/breed-detection-ai:latest
```

### 3.4 Create ECS Task

In AWS Console:
1. Go to **ECS** → **Clusters**
2. Create new cluster
3. Create task definition
4. Reference your ECR image
5. Set memory: 512MB, CPU: 256
6. Create service
7. Configure load balancer

(See AWS docs for detailed steps)

---

## DigitalOcean App Platform

Simplest alternative to Render/Railway with better free options.

### 4.1 Create Account

https://www.digitalocean.com

### 4.2 Create App

1. Dashboard → **Create** → **Apps**
2. Connect GitHub repository
3. DigitalOcean auto-detects Dockerfile
4. Review configuration
5. **Deploy**

Takes ~5 minutes!

---

## Multi-Container with Docker Compose

For local development or multi-service deployments:

```bash
docker-compose up
```

This starts:
- Backend on http://localhost:8000
- Frontend on http://localhost:3000
- Both connected and ready to test

Stop with:
```bash
docker-compose down
```

---

## 🏗️ Production Considerations

When deploying to production:

### Networking
```dockerfile
# In Dockerfile
ENV ALLOWED_ORIGINS=https://your-domain.com
```

### Environment Variables
```bash
docker run \
  -e PYTHONUNBUFFERED=1 \
  -e LOG_LEVEL=info \
  -e ALLOWED_ORIGINS=https://your-domain.com \
  -p 8000:8000 \
  breed-detection-ai:latest
```

### Logging
```bash
# View logs
docker logs CONTAINER_ID

# Follow logs
docker logs -f CONTAINER_ID
```

### Health Checks
Already included in Dockerfile! Docker will restart container if unhealthy.

---

## Scaling (Advanced)

### Horizontal Scaling
```bash
# Create multiple instances with load balancer
# Use Kubernetes, Docker Swarm, or cloud's auto-scaling
```

### Vertical Scaling  
```bash
# Give container more resources
docker run \
  --cpus="2" \
  --memory="2g" \
  breed-detection-ai:latest
```

---

## 🆘 Troubleshooting

### Container won't start
```bash
# Check logs
docker logs breed-detection-api

# Rebuild
docker build --no-cache -t breed-detection-ai:latest .
```

### Port conflicts
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill it (Windows)
taskkill /PID PROCESS_ID /F
```

### Model not found in container
```bash
# Verify model in Dockerfile copy commands
# Make sure model/ directory exists locally
ls -la model/breed_classifier.pth
```

---

## 📊 Recommended Path

1. **Start**: Local Docker testing (`Option 1`)
2. **Test**: Use Docker Compose (`Multi-Container`)
3. **Deploy**: Choose easiest cloud (Render/Railway first!)
4. **Scale**: Later if you need more control

---

**Happy containerizing! 🚀**
