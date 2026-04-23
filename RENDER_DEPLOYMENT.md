# 🚀 Render Deployment Guide - Step by Step

Complete guide for deploying your Cattle Breed Identification system on Render.com

## Prerequisites

✅ GitHub account (free at https://github.com)  
✅ Render account (free at https://render.com)  
✅ Your project pushed to GitHub  

---

## Step 1: Push Your Project to GitHub

### 1.1 Create a GitHub Repository

1. Go to https://github.com/new
2. Name your repo: `breed-detection-ai`
3. Click **Create repository**

### 1.2 Push Your Code

```bash
cd c:\Users\Dell\Documents\breed-detection-ai

# Initialize git
git init
git add .
git config user.name "Your Name"
git config user.email "your.email@example.com"
git commit -m "Initial commit: Ready for production deployment"
git branch -M main

# Add GitHub repo
git remote add origin https://github.com/YOUR_USERNAME/breed-detection-ai.git

# Push
git push -u origin main
```

> ⚠️ Replace `YOUR_USERNAME` with your actual GitHub username

---

## Step 2: Create Backend Service on Render

### 2.1 Go to Render Dashboard

1. Log in at https://render.com/dashboard
2. Click **"New +"** button (top right)
3. Select **"Web Service"**

### 2.2 Connect Your GitHub Repository

1. Click **"GitHub"** in the provider list
2. Authorize Render to access your GitHub
3. Select `breed-detection-ai` repository
4. Select **main** branch
5. Click **"Connect"**

### 2.3 Configure Backend Service

Fill in these fields:

| Field | Value |
|-------|-------|
| **Name** | `breed-detection-api` |
| **Environment** | `Python 3` |
| **Region** | `Oregon` (free tier) |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `cd backend && uvicorn main:app --host 0.0.0.0 --port 8000` |

### 2.4 Add Environment Variables

Scroll down to **Environment** section:

Click **"Add Environment Variable"** and add:

```
PYTHONUNBUFFERED = 1
```

For CORS (add later after frontend is deployed):
```
ALLOWED_ORIGINS = http://localhost:3000,https://YOUR_FRONTEND_URL
```

### 2.5 Set Plan

Select **Free** plan (good enough to start!)

### 2.6 Deploy

Click **"Create Web Service"**

⏳ Wait 3-5 minutes for deployment

You'll see a **green check mark** when ready ✅

**Copy your backend URL**: `https://breed-detection-api-xxxx.onrender.com`

---

## Step 3: Create Frontend Service on Render

### 3.1 Back to Render Dashboard

Click **"New +"** → select **"Static Site"**

### 3.2 Connect Same Repository

1. Select `breed-detection-ai` repository
2. Select **main** branch
3. Click **"Connect"**

### 3.3 Configure Frontend Service

| Field | Value |
|-------|-------|
| **Name** | `breed-detection-app` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `build` |

### 3.4 Set Plan

Select **Free** plan

### 3.5 Deploy

Click **"Create Static Site"**

⏳ Wait 2-3 minutes

**Copy your frontend URL**: `https://breed-detection-app-xxxx.onrender.com`

---

## Step 4: Connect Frontend to Backend

### 4.1 Update Environment Variables

Now that both are deployed, update the frontend to know about the backend:

**In your local code:**

Create file: `frontend/.env.production`

```
REACT_APP_API_URL=https://breed-detection-api-xxxx.onrender.com
```

> Replace `xxxx` with your actual backend URL suffix

### 4.2 Update Backend CORS Settings

Edit: `backend/.env.example`

Add:
```
ALLOWED_ORIGINS=http://localhost:3000,https://breed-detection-app-xxxx.onrender.com
```

> Replace with your actual frontend URL

### 4.3 Push Changes to GitHub

```bash
git add -A
git commit -m "Configure for Render production deployment"
git push
```

### 4.4 Trigger Redeploy

1. Go to Render dashboard
2. Select **breed-detection-api** service
3. Click **"Manual Deploy"** or **"Redeploy"**
4. Wait for redeployment
5. Repeat for **breed-detection-app**

---

## Step 5: Verify Deployment

### 5.1 Test Backend

Open in browser:
```
https://breed-detection-api-xxxx.onrender.com/health
```

You should see:
```json
{
  "model_loaded": true,
  "num_classes": 40,
  "device": "cpu"
}
```

### 5.2 Check API Documentation

Open:
```
https://breed-detection-api-xxxx.onrender.com/docs
```

You should see the SwaggerUI interface

### 5.3 Test Frontend

Open:
```
https://breed-detection-app-xxxx.onrender.com
```

You should see your application loaded!

### 5.4 Full End-to-End Test

1. Try uploading an image
2. Click **"Predict"**
3. You should get results
4. Check browser console (F12) for any errors

---

## 🎉 You're Live!

Your application is now public at:

- **Frontend**: `https://breed-detection-app-xxxx.onrender.com`
- **Backend**: `https://breed-detection-api-xxxx.onrender.com`
- **API Docs**: `https://breed-detection-api-xxxx.onrender.com/docs`

---

## ⚙️ Next Steps

### Option 1: Custom Domain

1. Go to static site settings on Render
2. Scroll to **"Custom Domains"**
3. Add your domain (requires domain registrar access)
4. Follow DNS setup instructions

### Option 2: Add to GitHub with Badges

Create nice badges showing your deployment:

```markdown
[![API Status](https://img.shields.io/badge/API-Live-green)](https://breed-detection-api-xxxx.onrender.com)
[![Frontend Status](https://img.shields.io/badge/Frontend-Live-blue)](https://breed-detection-app-xxxx.onrender.com)
```

### Option 3: Monitor Your App

On Render:
1. Select your service
2. Go to **"Logs"** tab
3. Watch real-time API requests
4. Check for errors

---

## 🆘 Troubleshooting

### **Frontend loads but says "Cannot connect to backend"**

**Cause**: CORS issue

**Fix**:
```bash
# Update ALLOWED_ORIGINS in backend/.env
# For Render, use your actual frontend URL
ALLOWED_ORIGINS=https://breed-detection-app-xxxx.onrender.com

# Push and redeploy backend
git push
```

### **Model Not Loading**

**Error**: `Model not loaded` on health check

**Causes**:
- Model file missing from repo
- Path incorrect

**Fix**:
```bash
# Verify model exists
ls -la model/breed_classifier.pth

# If missing, add and push:
git add model/
git commit -m "Add trained model"
git push
```

### **Timeout Errors**

**Error**: `502 Bad Gateway`

**Cause**: Backend taking too long to start

**Fix**:
- Render's free tier has limited resources
- Model loading might timeout on first request
- Just reload after 1-2 minutes

### **API Returns 503**

**Cause**: Model still loading or startup failed

**Check logs**:
1. Render dashboard → service → Logs
2. Look for model loading errors
3. Restart the service if needed

---

## 💰 Pricing Notes

**Render FREE tier includes**:
- ✅ Limited backend hours (~0.5 hours/month)
- ✅ Unlimited frontend
- ✅ Auto SSL/HTTPS
- ✅ GitHub integration

**If you need more**:
- Upgrade to starter instance (~$7/month)
- Provides consistent uptime
- Better for production use

---

## 📱 Share Your App!

Post on social media:

```
🎉 Just deployed my Cattle Breed Identification AI!
Check it out: [YOUR_FRONTEND_URL]

Identify 40+ cattle breeds with AI powered by PyTorch, FastAPI & React

#AI #DeepLearning #ML #Cattle
```

---

**Congratulations! Your project is now public and live! 🚀**
