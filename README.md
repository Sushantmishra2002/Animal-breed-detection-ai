# 🐄 Cattle & Buffalo Breed Identification System

A complete end-to-end deep learning application for identifying cattle and buffalo breeds using AI. Built with PyTorch, FastAPI, and React.

## 📋 Features

- ✅ **Deep Learning Model**: ResNet-50 CNN trained on 40+ cattle/buffalo breeds
- ✅ **Top 3 Predictions**: Get the 3 most likely breed predictions with confidence scores
- ✅ **Breed Information**: Comprehensive database with breed details (origin, type, characteristics, milk production)
- ✅ **REST API**: FastAPI backend with multiple endpoints
- ✅ **Modern UI**: Beautiful React frontend for non-technical users
- ✅ **Real-time Prediction**: Instant breed identification from uploaded images
- ✅ **Error Handling**: Robust error handling and validation
- ✅ **CORS Support**: Ready for production deployment

## 🎯 Supported Breeds (40 Classes)

Alambadi, Amritmahal, Ayrshire, Banni, Bargur, Bhadawari, Brown_Swiss, Dangi, Deoni, Gir, Guernsey, Hallikar, Hariana, Holstein_Friesian, Jaffrabadi, Jersey, Kangayam, Kankrej, Kasargod, Kenkatha, Kherigarh, Khillari, Krishna_Valley, Malnad_gidda, Mehsana, Murrah, Nagori, Nagpuri, Nili_Ravi, Nimari, Ongole, Pulikulam, Rathi, Red_Dane, Red_Sindhi, Sahiwal, Surti, Tharparkar, Toda, Umblachery, Vechur

## 📁 Project Structure

```
breed-detection-ai/
│
├── dataset/
│   ├── train/                    # Training images (40 breed folders)
│   └── val/                      # Validation images (40 breed folders)
│
├── training/
│   ├── train.py                  # Training script
│   └── requirements.txt           # Python dependencies for training
│
├── backend/
│   ├── main.py                   # FastAPI application
│   └── requirements.txt           # Python dependencies for backend
│
├── frontend/
│   ├── src/
│   │   ├── App.js               # Main React component
│   │   ├── App.css              # Styling
│   │   └── index.js             # React entry point
│   ├── public/
│   │   └── index.html           # HTML template
│   └── package.json             # Node.js dependencies
│
├── model/                        # Trained model directory (created after training)
│   ├── breed_classifier.pth     # Trained model weights
│   └── class_mapping.pkl        # Class mappings
│
├── breeds.json                  # Breed information database
└── README.md                    # This file
```

## 🚀 Quick Start (Complete Setup Guide)

### Prerequisites

- **Python 3.8+** (for training and backend)
- **Node.js 14+** (for frontend)
- **pip** (Python package manager)
- **npm** (Node package manager)
- **Git** (optional)
- **CUDA 11.8+** (optional, for GPU acceleration)

### Step 1: Install Python Dependencies

#### 1.1 Set Up Virtual Environment (Recommended)

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate
```

#### 1.2 Install Training Dependencies

```bash
cd training
pip install -r requirements.txt
cd ..
```

#### 1.3 Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
cd ..
```

### Step 2: Train the Model

**This step trains the ResNet-50 model on your dataset. It may take 30-60 minutes depending on your hardware.**

```bash
# Navigate to training directory
cd training

# Run the training script
python train.py
```

**What happens during training:**
1. Loads images from `dataset/train/` and `dataset/val/`
2. Performs data augmentation (rotation, color jitter, flips)
3. Trains ResNet-50 model for 40 epochs with early stopping
4. Validates after each epoch
5. Saves model to `model/breed_classifier.pth`
6. Saves class mappings to `model/class_mapping.pkl`

**Expected output:**
```
============================================================
CATTLE & BUFFALO BREED IDENTIFICATION - MODEL TRAINING
============================================================

[1/4] Loading datasets...
Loaded 8000 images from 40 classes
...

[4/4] Saving model...
✓ Model saved to: ./model/breed_classifier.pth
✓ Best validation accuracy: 92.5%

============================================================
Training Complete!
============================================================
```

**Troubleshooting:**
- If out of memory: Reduce `batch_size` in `train.py` (try 16 or 8)
- For GPU usage: Ensure NVIDIA drivers and CUDA toolkit are installed
- If stuck loading data: Ensure image files are valid (JPG/PNG/BMP)

### Step 3: Start the Backend API

**Open a new terminal/command prompt** and run:

```bash
cd backend

# Run the FastAPI server
python main.py
```

**Expected output:**
```
============================================================
CATTLE & BUFFALO BREED IDENTIFICATION API
============================================================
Server starting at http://localhost:8000
API Docs: http://localhost:8000/docs
============================================================
```

**API is now running at:** `http://localhost:8000`

### Step 4: Install and Start Frontend

**Open another new terminal** and run:

```bash
cd frontend

# Install Node dependencies (first time only)
npm install

# Start the React development server
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view breed-detection-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

**Frontend is now running at:** `http://localhost:3000`

### Step 5: Use the Application

1. **Open** `http://localhost:3000` in your browser
2. **Upload** an image of cattle or buffalo
3. **Click** "Identify Breed"
4. **View** top 3 predictions with confidence scores
5. **See** detailed breed information

---

## 📚 API Documentation

### Base URL
```
http://localhost:8000
```

### Available Endpoints

#### 1. Root Endpoint
```
GET /
```
Returns API status and information.

**Response:**
```json
{
  "name": "Cattle & Buffalo Breed Identification API",
  "version": "1.0.0",
  "status": "running",
  "model_status": "loaded"
}
```

#### 2. Health Check
```
GET /health
```
Check if API and model are loaded.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "num_classes": 40
}
```

#### 3. Get All Breeds Information
```
GET /breeds
```
Retrieve information about all 40 breeds.

**Response:**
```json
{
  "total_breeds": 40,
  "breeds": {
    "Gir": {
      "name": "Gir",
      "type": "Cattle",
      "origin": "Gujarat, India",
      "characteristics": "Large, reddish-brown, high milk production",
      "milk_production": "2,500-3,000 liters per lactation",
      "description": "One of the best Indian dairy breeds"
    },
    ...
  }
}
```

#### 4. Get Specific Breed Information
```
GET /breeds/{breed_name}
```
Retrieve information about a specific breed.

**Example:** `GET /breeds/Gir`

**Response:**
```json
{
  "name": "Gir",
  "type": "Cattle",
  "origin": "Gujarat, India",
  "characteristics": "Large, reddish-brown, high milk production",
  "milk_production": "2,500-3,000 liters per lactation",
  "description": "One of the best Indian dairy breeds"
}
```

#### 5. Predict Breed from Image
```
POST /predict
```
Upload an image to identify breed.

**Request:**
- Content-Type: `multipart/form-data`
- Parameter: `file` (image file: JPG, PNG, BMP)

**Example using cURL:**
```bash
curl -X POST "http://localhost:8000/predict" \
  -F "file=@cattle_image.jpg"
```

**Response:**
```json
{
  "success": true,
  "filename": "cattle_image.jpg",
  "predictions": [
    {
      "breed": "Gir",
      "confidence": 94.2,
      "type": "Cattle",
      "origin": "Gujarat, India"
    },
    {
      "breed": "Sahiwal",
      "confidence": 3.8,
      "type": "Cattle",
      "origin": "Punjab"
    },
    {
      "breed": "Red_Sindhi",
      "confidence": 1.5,
      "type": "Cattle",
      "origin": "Pakistan"
    }
  ],
  "top_match": "Gir",
  "confidence": 94.2
}
```

#### 6. Interactive API Documentation
```
GET /docs
```
Access the interactive Swagger UI for API testing.

**URL:** `http://localhost:8000/docs`

### Error Responses

**Model Not Loaded (503):**
```json
{
  "detail": "Model not loaded. Please train the model first."
}
```

**Invalid Image (400):**
```json
{
  "detail": "File must be an image"
}
```

**Image Too Large (413):**
```json
{
  "detail": "File too large (max 50MB)"
}
```

---

## 🧪 Testing the System

### Test 1: Check Backend Status
```bash
curl http://localhost:8000/health
```

### Test 2: Get All Breeds
```bash
curl http://localhost:8000/breeds | python -m json.tool
```

### Test 3: Test Prediction with Image
```bash
# Make sure you have test_image.jpg in current directory
curl -X POST "http://localhost:8000/predict" \
  -F "file=@test_image.jpg" | python -m json.tool
```

### Test 4: Test Frontend
1. Open `http://localhost:3000`
2. Upload a cattle/buffalo image
3. Check if predictions appear correctly

---

## 🔧 Configuration

### Training Configuration (training/train.py)
```python
CONFIG = {
    'dataset_path': './dataset',        # Dataset location
    'model_save_path': './model/breed_classifier.pth',
    'batch_size': 32,                   # Adjust for memory
    'num_epochs': 40,                   # Training epochs
    'learning_rate': 0.001,             # Learning rate
    'image_size': 224,                  # Input image size
    'num_workers': 4,                   # Data loading workers
    'device': 'cuda' if torch.cuda.is_available() else 'cpu'
}
```

### Backend Configuration (backend/main.py)
```python
# Change port from 8000 to another port:
# uvicorn.run(app, host="0.0.0.0", port=8001)

# Change CORS settings:
# allow_origins=["http://localhost:3000"]  # Specific origin
```

### Frontend Configuration (frontend/src/App.js)
```javascript
const [apiUrl] = useState('http://localhost:8000');  // Change backend URL
```

---

## 📊 Model Details

### Architecture
- **Base Model**: ResNet-50 (pretrained on ImageNet)
- **Input Size**: 224 × 224 pixels
- **Output Classes**: 40 (cattle/buffalo breeds)
- **Framework**: PyTorch

### Training Details
- **Optimizer**: Adam
- **Loss Function**: Cross-Entropy Loss
- **Data Augmentation**:
  - Random rotation (±20°)
  - Color jitter (brightness, contrast, saturation)
  - Random flips (horizontal and vertical)
- **Learning Rate Scheduler**: ReduceLROnPlateau
- **Early Stopping**: Patience of 15 epochs

### Performance
- Expected validation accuracy: 85-95%
- Inference time: ~500-1000ms per image (CPU)
- Inference time: ~50-100ms per image (GPU)

---

## 📱 Using on Field Devices

For deployment to field worker devices:

### Mobile/Tablet (Web-based)
1. Deploy frontend to cloud (Vercel, Netlify, AWS)
2. Deploy backend to cloud (AWS, Google Cloud, Azure)
3. Share web URL with field workers
4. Accessible on any device with browser

### Desktop (Windows/Mac/Linux)
1. Create installer using Electron or PyInstaller
2. Bundle all components
3. Distribute to field workers

### iOS/Android App
1. Build React Native version from this codebase
2. Deploy to App Store / Google Play
3. Offline support with model quantization

---

## 🐛 Troubleshooting

### Training Issues

**Issue: "CUDA out of memory"**
```python
# Solution: Reduce batch size in train.py
CONFIG['batch_size'] = 16  # or 8
```

**Issue: "No images found"**
```
# Check dataset structure:
dataset/
  ├── train/
  │   ├── Gir/
  │   │   ├── image1.jpg
  │   │   └── image2.jpg
  │   ...
```

**Issue: "Training is very slow"**
```
# Check device usage:
# Expected: Using device: cuda
# If CPU, install CUDA: https://pytorch.org/get-started/locally/
```

### Backend Issues

**Issue: "Connection refused" from frontend**
```
# Ensure backend is running:
python backend/main.py

# Check if port 8000 is in use:
# Windows: netstat -ano | findstr :8000
# Linux: lsof -i :8000
```

**Issue: "Model not found" error**
```
# Ensure model directory exists:
mkdir model
# And training is complete
python training/train.py
```

### Frontend Issues

**Issue: Images not uploading**
```
# Check browser console for errors (F12)
# Ensure backend URL is correct in App.js
# Check CORS is enabled in backend
```

**Issue: "Cannot connect to backend"**
```
# Ensure both services are running:
# Terminal 1: python backend/main.py (port 8000)
# Terminal 2: npm start in frontend (port 3000)
```

---

## 🚢 Deployment Guide

### Deploy Backend (FastAPI)

#### Option 1: Heroku
```bash
# Create requirements.txt
pip freeze > requirements.txt

# Create Procfile
echo "web: uvicorn backend.main:app --host 0.0.0.0 --port $PORT"

# Deploy
heroku login
heroku create your-app-name
git push heroku main
```

#### Option 2: AWS EC2
```bash
ssh -i key.pem ubuntu@your-instance

# Install dependencies
sudo apt update && sudo apt install python3-pip
pip3 install -r requirements.txt

# Run with gunicorn
pip3 install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker backend.main:app
```

#### Option 3: Docker
```dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY backend requirements.txt ./
RUN pip install -r requirements.txt

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Deploy Frontend (React)

#### Option 1: Vercel
```bash
npm install -g vercel
vercel login
cd frontend
vercel
```

#### Option 2: Netlify
```bash
npm install -g netlify-cli
cd frontend
npm run build
netlify deploy --prod --dir=build
```

#### Option 3: GitHub Pages
```bash
cd frontend
npm install gh-pages --save-dev
# Add to package.json:
# "homepage": "https://yourusername.github.io/breed-detection-ai",
# "deploy": "npm run build && gh-pages -d build"
npm run deploy
```

---

## 📚 Additional Resources

- [PyTorch Documentation](https://pytorch.org/docs/stable/index.html)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [ResNet Paper](https://arxiv.org/abs/1512.03385)

---

## 📝 License

This project is open source and available under the MIT License.

---

## 👥 Contributors

- AI Model Development: Breed Classification System
- Frontend: React Web Application
- Backend: FastAPI REST API
- Dataset: 40 cattle and buffalo breeds

---

## 📞 Support

For issues, questions, or contributions:
1. Check the troubleshooting section above
2. Review API documentation at `http://localhost:8000/docs`
3. Check browser console (F12) for client-side errors
4. Review server logs in terminal for backend errors

---

## ✨ Key Features Explained

### Real-time Predictions
The frontend sends images to the backend, which runs them through the trained model and returns predictions in real-time.

### Top 3 Predictions
Instead of just the top match, the system returns the 3 most likely breeds with confidence scores, helping users decide which breed it is.

### Breed Information
Each prediction includes detailed information about the breed (origin, type, milk production) to help users identify characteristics.

### Data Augmentation
During training, images are randomly rotated, flipped, and color-adjusted to improve the model's robustness to different angles and lighting conditions.

### Early Stopping
Training stops automatically when validation accuracy stops improving, preventing overfitting and saving time.

---

## 🎓 Learning Path

1. **Understand the basics**: Review dataset structure and model architecture
2. **Train the model**: Run `train.py` and monitor training progress
3. **Test the API**: Use cURL or Postman to test endpoints
4. **Explore the frontend**: Upload images and see predictions
5. **Modify and extend**: Customize for your needs

---

## 📈 Next Steps

- Improve model accuracy by collecting more images
- Add more breeds to the database
- Deploy to cloud for wider access
- Create mobile app using React Native
- Add image preprocessing for better results
- Implement real-time webcam predictions

---

**Last Updated:** March 31, 2026

**Version:** 1.0.0

**Status:** Production Ready ✅

