# 🏗️ System Architecture Overview

Complete system architecture, data flow, and component interactions.

---

## 📊 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         END USER (Field Worker)                 │
│                                                                   │
│  Uses browser, tablet, or mobile device to upload images        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND LAYER (React)                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ React Application (Port 3000)                            │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ • Image upload component                                 │   │
│  │ • Axios HTTP client                                      │   │
│  │ • Results display                                        │   │
│  │ • Confidence visualization                               │   │
│  │ • Breed information display                              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                  ↓                                          ↑     │
│                  └──────── API Calls ────────────────────┘      │
│  npm start → React Development Server → http://localhost:3000   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    HTTP POST /predict
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    API LAYER (FastAPI)                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ FastAPI Server (Port 8000)                               │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ Endpoints:                                               │   │
│  │ • GET  / - Status                                        │   │
│  │ • GET  /health - Health check                           │   │
│  │ • GET  /breeds - All breed info                         │   │
│  │ • GET  /breeds/{name} - Specific breed                  │   │
│  │ • POST /predict - Main prediction endpoint              │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ Processing:                                              │   │
│  │ 1. Receive image file                                   │   │
│  │ 2. Validate file type and size                          │   │
│  │ 3. Load image with PIL                                  │   │
│  │ 4. Preprocess (resize, normalize)                       │   │
│  │ 5. Pass to ML model                                     │   │
│  │ 6. Get predictions & confidence scores                  │   │
│  │ 7. Fetch breed information                              │   │
│  │ 8. Return JSON response                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                  ↓                                          ↑     │
│                  └────── Model Inference ─────────────────┘      │
│  python main.py → Uvicorn → http://localhost:8000              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    Load Model Weights
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                  ML MODEL LAYER (PyTorch)                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Model: ResNet-50 (Convolutional Neural Network)          │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ Input:  224×224×3 RGB image                             │   │
│  │ Output: 40-dimensional vector (40 breed classes)        │   │
│  │                                                          │   │
│  │ Architecture:                                            │   │
│  │ • Conv2d layers (feature extraction)                    │   │
│  │ • BatchNorm layers (normalization)                      │   │
│  │ • ReLU activation (non-linearity)                       │   │
│  │ • Residual blocks (skip connections)                    │   │
│  │ • Average pooling (dimensionality reduction)            │   │
│  │ • Fully connected layer (classification)                │   │
│  │ • Softmax (probability distribution)                    │   │
│  │                                                          │   │
│  │ Weights: breed_classifier.pth (~100MB)                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                  ↓                                          ↑     │
│                  └────── Feature Extraction ────────────────┘    │
│  Trained on: 8,000 images of 40 cattle/buffalo breeds          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    Load from Disk
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                   DATA LAYER (Storage)                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ File System Storage                                      │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │                                                          │   │
│  │ model/                                                   │   │
│  │ ├── breed_classifier.pth     (Trained model weights)   │   │
│  │ └── class_mapping.pkl        (Class name mappings)     │   │
│  │                                                          │   │
│  │ breeds.json                  (40 breed information)     │   │
│  │                                                          │   │
│  │ dataset/                                                │   │
│  │ ├── train/                   (8,000 training images)   │   │
│  │ │   ├── Gir/                                            │   │
│  │ │   ├── Sahiwal/                                        │   │
│  │ │   └── ... (40 breed folders)                         │   │
│  │ └── val/                     (2,000 validation images) │   │
│  │     └── ... (same 40 breed folders)                    │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow: From Image to Prediction

### Complete Request-Response Cycle

```
1. USER ACTION
   ├─ Opens http://localhost:3000
   ├─ Selects or drags image
   ├─ Clicks "Identify Breed" button
   └─ Frontend creates FormData with image

2. FRONTEND (React)
   ├─ Validates file (type, size)
   ├─ Shows preview image
   ├─ Creates HTTP POST request
   ├─ Sends to: POST http://localhost:8000/predict
   └─ Sets loading state

3. NETWORK TRANSMISSION
   ├─ Browser serializes image to multipart/form-data
   ├─ Axios sends HTTP request
   ├─ Request travels to backend
   └─ Optional: CORS headers validated

4. BACKEND (FastAPI)
   ├─ Receives request at /predict endpoint
   ├─ Extracts file from request
   ├─ Validates:
   │  ├─ File is image type
   │  ├─ File is not empty
   │  └─ File size < 50MB
   ├─ Reads image bytes
   └─ Passes to preprocessing

5. IMAGE PREPROCESSING
   ├─ PIL opens image file
   ├─ Converts to RGB (if needed)
   ├─ Resizes to 224×224 pixels
   ├─ Converts to PyTorch tensor
   ├─ Normalizes pixel values
   │  ├─ Subtract mean [0.485, 0.456, 0.406]
   │  └─ Divide by std [0.229, 0.224, 0.225]
   └─ Returns normalized tensor

6. MODEL INFERENCE
   ├─ Loads model weights (breed_classifier.pth)
   ├─ Sets model to eval mode
   ├─ Adds batch dimension: [1, 3, 224, 224]
   ├─ Forward pass through ResNet-50:
   │  ├─ Input: RGB image tensor
   │  ├─ Conv layers: Extract features
   │  ├─ ResNet blocks: Deep feature learning
   │  ├─ Pooling: Reduce dimensions
   │  ├─ FC layer: Classification
   │  └─ Output: [1, 40] logits
   ├─ Apply softmax: Convert to probabilities
   ├─ Get top 3 predictions
   │  ├─ Top 1: Highest probability
   │  ├─ Top 2: Second highest
   │  └─ Top 3: Third highest
   └─ Extract confidence scores

7. BREED INFORMATION LOOKUP
   ├─ Load breeds.json
   ├─ For each top prediction:
   │  ├─ Get breed name from class mapping
   │  ├─ Look up in breeds.json
   │  ├─ Extract: type, origin, characteristics
   │  └─ Calculate confidence percentage
   └─ Format response data

8. RESPONSE CREATION
   ├─ Create JSON response:
   │  {
   │    "success": true,
   │    "filename": "image.jpg",
   │    "predictions": [
   │      {
   │        "breed": "Gir",
   │        "confidence": 94.2,
   │        "type": "Cattle",
   │        "origin": "Gujarat, India"
   │      },
   │      ...
   │    ],
   │    "top_match": "Gir",
   │    "confidence": 94.2
   │  }
   ├─ Set HTTP status: 200 OK
   └─ Send response

9. NETWORK TRANSMISSION (Response)
   ├─ Backend serializes JSON
   ├─ Sends HTTP response
   └─ Frontend receives response

10. FRONTEND PROCESSING
    ├─ Axios receives response
    ├─ Parses JSON
    ├─ Updates React state
    ├─ Sets predictions data
    ├─ Clears loading state
    └─ Component re-renders

11. DISPLAY TO USER
    ├─ Shows top match card
    │  ├─ Breed name (large)
    │  ├─ Confidence bar (visual)
    │  ├─ Type and origin
    │  └─ Percentage
    ├─ Shows top 3 predictions
    │  ├─ Rank badge
    │  ├─ Breed name
    │  ├─ Confidence bar
    │  └─ Origin
    └─ Provides "Try Another Image" button

12. USER SEES RESULTS
    ├─ Beautiful UI with predictions
    ├─ Can see breed information
    ├─ Can upload another image
    └─ Happy field worker! ✓
```

---

## 📦 Component Interactions

### Browser — FastAPI Communication

```
                    Browser (Port 3000)
                      React App
                          │
                          │ axios.post("/predict")
                          │ Content-Type: multipart/form-data
                          │
                          ↓
                    FastAPI Server (Port 8000)
                @app.post("/predict")
                          │
              ┌───────────┼───────────┐
              │           │           │
              ↓           ↓           ↓
          Validate    Process      Model
          File        Image       Inference
              │           │           │
              └───────────┼───────────┘
                          │
                    JSON Response
                          │
                ┌─────────┴─────────┐
                │                   │
            Success            Error
            {predictions}   {error message}
                │                   │
                └───────────┬───────┘
                            │
                    Browser displays
```

---

## 🗂️ File Organization

### Project Tree with Dependencies

```
breed-detection-ai/
│
├── dataset/  ← RAW DATA
│   ├── train/        (8,000 images)
│   │   ├── Gir/      (200 images)
│   │   ├── Sahiwal/  (200 images)
│   │   └── ... (40 breed folders)
│   └── val/          (2,000 images)
│       └── ... (same structure)
│
├── training/  ← MACHINE LEARNING
│   ├── train.py       → Loads data from dataset/
│   │                 → Trains ResNet-50
│   │                 → Saves to model/
│   └── requirements.txt
│
├── model/  ← TRAINED MODEL (created after training)
│   ├── breed_classifier.pth  (100MB weights)
│   └── class_mapping.pkl     (class names)
│
├── backend/  ← API SERVER
│   ├── main.py        → Loads model/
│   │                 → Loads breeds.json
│   │                 → Serves predictions
│   │                 → Runs on port 8000
│   └── requirements.txt
│
├── frontend/  ← WEB UI
│   ├── src/
│   │   ├── App.js      → Calls http://localhost:8000/predict
│   │   ├── App.css     → Styling
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── node_modules/   (created after: npm install)
│
├── breeds.json  ← BREED DATABASE (used by backend)
│
├── README.md  ← Complete documentation
├── QUICKSTART.md  ← 5-minute setup
├── INSTALLATION.md  ← Installation guide
├── PROJECT_SUMMARY.md  ← This project summary
│
└── test_api.py  ← Testing script
```

---

## 🔗 Dependencies Flow

```
Code Dependencies:

training/train.py
├─ Imports: torch, torchvision, PIL, numpy
├─ Uses: dataset/ (train and val folders)
└─ Creates: model/ (breed_classifier.pth, class_mapping.pkl)

backend/main.py
├─ Imports: fastapi, torch, torchvision, PIL
├─ Loads: model/breed_classifier.pth
├─ Loads: model/class_mapping.pkl
├─ Loads: breeds.json
└─ Serves: API endpoints

frontend/App.js
├─ Imports: react, axios
├─ Calls: POST http://localhost:8000/predict
└─ Uses: API response to display results
```

---

## 🎯 Processing Pipeline

### Training Pipeline (One-Time)

```
Raw Dataset
    ↓
[training/train.py]
    ├─ Load images from dataset/train/
    ├─ Data augmentation (rotation, flips)
    ├─ Create ResNet-50 model
    ├─ Training loop:
    │   ├─ Forward pass
    │   ├─ Calculate loss
    │   ├─ Backward pass
    │   └─ Update weights
    ├─ Validation after each epoch
    └─ Save best model
    ↓
model/breed_classifier.pth (100 MB)
model/class_mapping.pkl (1 KB)
```

### Inference Pipeline (Per Image)

```
User Image
    ↓
[frontend: Image Upload]
    ↓
[Browser: Validation]
    ├─ Check file type
    ├─ Check file size
    └─ Create preview
    ↓
HTTP POST /predict
    ↓
[backend: File Handling]
    ├─ Receive image
    ├─ Validate
    └─ Read bytes
    ↓
[Preprocessing]
    ├─ Load with PIL
    ├─ Resize to 224×224
    ├─ Convert to tensor
    └─ Normalize
    ↓
[Model Inference]
    ├─ Load breed_classifier.pth
    ├─ Forward pass
    ├─ Get softmax probabilities
    └─ Top 3 predictions
    ↓
[PostProcessing]
    ├─ Load breeds.json
    ├─ Get breed info
    └─ Format response
    ↓
JSON Response
    ↓
[Frontend: Display]
    ├─ Update state
    ├─ Render results
    └─ Show breed info
    ↓
User sees Predictions ✓
```

---

## 💾 Storage Architecture

```
Memory During Operation:

Training Phase (45-60 min):
├─ Dataset in RAM: ~4 GB (8000 images)
├─ Model in VRAM: ~2 GB (ResNet-50)
├─ Optimizer states: ~1 GB
└─ Total: ~7 GB

Inference Phase (per request):
├─ Image in RAM: ~1 MB
├─ Model in VRAM: ~100 MB
├─ Batch processing: ~50 MB
└─ Total: ~150 MB per inference

Disk Storage:
├─ Dataset: ~20 GB
├─ Model file: ~100 MB
├─ Virtual env: ~3 GB
├─ Node modules: ~500 MB
└─ Total: ~24 GB minimum
```

---

## 🔐 Security Flow

```
Image Upload Security:
    ↓
Frontend Validation
    ├─ Check MIME type
    ├─ Check file size
    └─ Preview before send
    ↓
Backend Validation
    ├─ Verify Content-Type header
    ├─ Check file size (< 50 MB)
    ├─ Scan file magic bytes
    └─ Isolate processing
    ↓
Preprocessing
    ├─ Open with PIL (safe library)
    ├─ Validate image format
    ├─ Reject corrupted images
    └─ No direct file execution
    ↓
Model Processing
    ├─ Fixed input size (224×224)
    ├─ Normalized values
    └─ No arbitrary code
    ↓
Response
    ├─ JSON only
    ├─ No file paths exposed
    └─ Error handling
```

---

## 🚀 Deployment Architecture

### Local Development
```
Developer Machine
├── Training: python training/train.py
├── Backend: python backend/main.py (port 8000)
└── Frontend: npm start (port 3000)
```

### Cloud Deployment
```
Cloud Infrastructure
├── Backend Server (AWS EC2/Lambda)
│   ├── FastAPI app
│   ├── Model weights
│   └── Breed database
│
├── Frontend CDN (Vercel/Netlify)
│   ├── React static files
│   ├── API calls to Backend
│   └── Cache busting
│
└── Database (Optional)
    ├── Breed information
    ├── User submissions
    └── Analytics
```

---

## 📈 Scalability Considerations

### Horizontal Scaling
```
Load Balancer
    ↓
┌─────────────┬─────────────┬─────────────┐
│ Backend 1   │ Backend 2   │ Backend 3   │
│ (port 8000) │ (port 8001) │ (port 8002) │
└─────────────┴─────────────┴─────────────┘
     ↑              ↑              ↑
     └──────────────┴──────────────┘
          Shared Model Files
          (Model caching)
```

### Caching Strategy
```
Request 1 → Backend → Model Inference → Response
Request 2 → Cache → (Same image?) → Return cached

Benefits:
- Faster responses
- Reduced GPU load
- Lower latency
```

---

## 🎓 Learning Architecture

The system demonstrates:

1. **Deep Learning**: ResNet-50 architecture
2. **Web Development**: React frontend
3. **API Development**: FastAPI backend
4. **DevOps**: Docker, deployment
5. **Data Engineering**: Image processing
6. **Software Architecture**: Modular design

Each component is independent and can be learned separately.

---

## Summary

This architecture provides:
✅ Clean separation of concerns
✅ Scalable design
✅ Easy maintenance
✅ Extensible components
✅ Production-ready structure
✅ Educational value

