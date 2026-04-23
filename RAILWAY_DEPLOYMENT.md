# 🚂 Railway Deployment Guide - Step by Step

Quick and easy deployment using Railway.app

## Why Railway?

✅ **Simplest setup** - Just connect GitHub  
✅ **Free $5/month** credit - Enough to get started  
✅ **Auto-deploys** on push  
✅ **Excellent docs**  

---

## Prerequisites

✅ GitHub account  
✅ Railway account (free at https://railway.app)  
✅ Project pushed to GitHub  

---

## Step 1: Push to GitHub (Same as Render)

```bash
cd c:\Users\Dell\Documents\breed-detection-ai
git init
git add .
git config user.name "Your Name"
git config user.email "your.email@example.com"
git commit -m "Ready for Railway deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/breed-detection-ai.git
git push -u origin main
```

---

## Step 2: Deploy on Railway

### 2.1 Go to Railway Dashboard

https://railway.app/dashboard

### 2.2 Create New Project

Click **"+ New Project"** → select **"Deploy from GitHub repo"**

### 2.3 Authorize and Connect

1. Click **"GitHub"**
2. Authorize Railway on GitHub
3. Select `breed-detection-ai` repository
4. Click **"Deploy Now"**

### 2.4 Railway Auto-Detection

Railway automatically:
- 🔍 Finds your Python requirements.txt
- 🔍 Finds your package.json
- ⚙️ Creates services for backend and frontend
- 📦 Starts building

---

## Step 3: Configure Services

### 3.1 Backend Service

Railway detects the Python project.

Click on **backend** service:

1. Go to **"Variables"** tab
2. Add:
   ```
   PYTHONUNBUFFERED = 1
   ALLOWED_ORIGINS = http://localhost:3000
   ```

3. Go to **"Deploy"** tab
4. Set:
   ```
   Build Command: pip install -r requirements.txt
   Start Command: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

### 3.2 Frontend Service

Same for frontend service:

1. Go to **"Variables"**
2. Add:
   ```
   REACT_APP_API_URL = http://localhost:3000
   ```
   (We'll update this after discovering the backend URL)

3. Go to **"Deploy"**
4. Set:
   ```
   Build Command: npm install && npm run build
   Start Command: npm start --prefix frontend
   ```

---

## Step 4: Get Deployed URLs

After deployment completes:

1. **Backend URL**: Under backend service → Preview URL
2. **Frontend URL**: Under frontend service → Preview URL

Copy both URLs!

---

## Step 5: Update Frontend with Backend URL

### 5.1 Update Code

Edit: `frontend/.env.production`

```
REACT_APP_API_URL=https://your-backend-url-from-railway.railway.app
```

### 5.2 Update Backend CORS

Edit: `backend/.env.example`

```
ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-url.railway.app
```

### 5.3 Push Changes

```bash
git add -A
git commit -m "Configure Railway URLs"
git push
```

Railway auto-redeploys! ✨

---

## Step 6: Test Your Deployment

1. Open frontend URL in browser
2. Try uploading an image
3. Should get predictions!

---

## 🌐 Custom Domain (Optional)

1. Go to frontend service settings
2. Click **"Custom Domain"**
3. Add your domain
4. Follow DNS instructions

---

## 🎉 You're Live!

Your app is now at:
- Frontend: `your-frontend.railway.app`
- Backend API: `your-backend.railway.app`

---

## 💡 Monitor Your App

In Railway dashboard:
- **Logs**: See real-time API requests
- **Deployments**: Track deployment history
- **Usage**: Monitor resource consumption
- **Settings**: Adjust auto-deploy options

---

## 💰 Pricing

- Free $5/month credit (usually enough!)
- Usage-based after credit expires
- Upgrade anytime for production

---

**Happy deploying! Your project is live! 🚀**
