# ⚡ Quick Start Guide - 5 Minutes to Running

**Before you start:** Make sure you have Python 3.8+ and Node.js 14+ installed.

## Step 1: Open 4 Command Prompts/Terminals

You'll need 4 separate terminal windows:
- **Terminal 1**: For training
- **Terminal 2**: For backend
- **Terminal 3**: For frontend
- **Terminal 4**: Optional, for monitoring

---

## Step 2: Train the Model (Terminal 1)

```bash
# Navigate to training directory
cd training

# Run training script
python train.py
```

**What to expect:**
- Takes 30-60 minutes depending on your computer
- Shows progress for each epoch
- Final message: "Training Complete!"
- Creates `model/breed_classifier.pth` file

⏳ **While training is happening (go to Step 3 in another terminal):**

---

## Step 3: Install Dependencies (Terminal 3)

While the model is training, install frontend dependencies:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

**Wait for `added X packages` message.**

---

## Step 4: Start Backend (Terminal 2)

Once training is complete, start the backend:

```bash
# Navigate to backend directory
cd backend

# Run backend server
python main.py
```

**Expected output:**
```
Server starting at http://localhost:8000
API Docs: http://localhost:8000/docs
```

✅ **Backend is ready!**

---

## Step 5: Start Frontend (Terminal 3)

In terminal 3 (after npm install completed):

```bash
# From frontend directory (if not already there)
cd frontend

# Start React development server
npm start
```

**Expected output:**
```
Compiled successfully!
Local:  http://localhost:3000
```

✅ **Frontend is ready!**

---

## Step 6: Open in Browser and Test

1. **Open browser**: http://localhost:3000
2. **Upload an image** of cattle or buffalo
3. **Click "Identify Breed"**
4. **See predictions with confidence scores!**

---

## 🎯 Common Issues & Quick Fixes

### "python: command not found"
```
Use: python3 train.py
Or add Python to PATH
```

### "npm: command not found"
```
Download from: https://nodejs.org/
```

### Backend shows "Model not loaded"
```
Training must complete first (check Terminal 1)
```

### Frontend shows "Cannot connect to backend"
```
Make sure:
1. Backend is running (Terminal 2)
2. No other app using port 8000
```

### Port already in use
```bash
# Change port in backend/main.py last line:
# Change from: uvicorn.run(app, host="0.0.0.0", port=8000)
# To: uvicorn.run(app, host="0.0.0.0", port=8001)
```

---

## 📊 What Each Part Does

```
Docker-like architecture:

┌─────────────────────────────────┐
│     React Frontend (Port 3000)  │
│  - Upload image                 │
│  - Display predictions          │
│  - Show breed info              │
└──────────────┬──────────────────┘
               │ HTTP requests
               ↓
┌─────────────────────────────────┐
│   FastAPI Backend (Port 8000)   │
│  - Receives image               │
│  - Runs ML model                │
│  - Returns predictions          │
└──────────────┬──────────────────┘
               │ Uses
               ↓
┌─────────────────────────────────┐
│   Trained ML Model (ResNet-50)  │
│  - 40 breed classes             │
│  - Top 3 predictions            │
│  - Confidence scores            │
└─────────────────────────────────┘
```

---

## 🧪 Test the API (Optional)

```bash
# Install test requirements
pip install -r test_requirements.txt

# Test API (needs backend running)
python test_api.py

# Test with an image
python test_api.py path/to/image.jpg
```

---

## 📁 Important Files Created

```
✓ breeds.json                    - 40 breed info database
✓ training/train.py             - ML training script
✓ backend/main.py               - FastAPI backend
✓ frontend/src/App.js           - React frontend
✓ README.md                      - Complete documentation
✓ test_api.py                    - API testing script
✓ setup.bat / setup.sh           - Automated setup
```

---

## 🚀 Next Steps

### After Getting It Working:

1. **Deploy Backend** (for field workers):
   - Heroku (free tier available)
   - AWS EC2 (free 1 year)
   - Google Cloud

2. **Deploy Frontend**:
   - Vercel (free)
   - Netlify (free)
   - GitHub Pages (free)

3. **Upload to Mobile**:
   - PWA (Progressive Web App)
   - React Native app

---

## 💡 Pro Tips

1. **For faster training:**
   - Use NVIDIA GPU if available
   - Reduce `batch_size` in train.py if out of memory

2. **For better predictions:**
   - Ensure image is clear and well-lit
   - Image should show the animal clearly

3. **For field deployment:**
   - Deploy to cloud, not localhost
   - Create mobile-friendly version
   - Add offline caching

---

## 📞 Need Help?

- Check the full **README.md** for detailed documentation
- Check terminal output for specific error messages
- Review API docs at **http://localhost:8000/docs**

---

**That's it! You now have a fully functional AI breed identification system! 🎉**

