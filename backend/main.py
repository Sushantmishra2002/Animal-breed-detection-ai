"""
Cattle & Buffalo Breed Identification - FastAPI Backend
Fully fixed, stable, production-ready version
"""

# ================= IMPORTS =================
import torch
import torch.nn as nn
from torchvision import models, transforms
from torchvision.models import ResNet50_Weights
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import pickle
import json
from pathlib import Path
import logging
from contextlib import asynccontextmanager
import os
import urllib.request

# ================= LOGGING =================
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ================= GLOBAL =================
MODEL = None
CLASSES = None
BREED_INFO = None
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
IMAGE_SIZE = 224

# ================= PATHS =================
BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH  = BASE_DIR / "model" / "breed_classifier.pth"
CLASS_PATH  = BASE_DIR / "model" / "class_mapping.pkl"
BREEDS_PATH = BASE_DIR / "breeds.json"

MODEL_URL = "https://raw.githubusercontent.com/Sushantmishra2002/Animal-breed-detection-ai/main/model/breed_classifier.pth"
CLASS_URL = "https://raw.githubusercontent.com/Sushantmishra2002/Animal-breed-detection-ai/main/model/class_mapping.pkl"


def ensure_model_artifacts():
    """Download model artifacts from GitHub when not present in runtime filesystem."""
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)

    if not MODEL_PATH.exists():
        logger.warning("Model file missing, downloading from GitHub...")
        urllib.request.urlretrieve(MODEL_URL, str(MODEL_PATH))

    if not CLASS_PATH.exists():
        logger.warning("Class mapping missing, downloading from GitHub...")
        urllib.request.urlretrieve(CLASS_URL, str(CLASS_PATH))

print("\n========== PATH DEBUG ==========")
print("MODEL PATH   :", MODEL_PATH)
print("MODEL EXISTS :", MODEL_PATH.exists())
print("CLASS PATH   :", CLASS_PATH)
print("BREEDS PATH  :", BREEDS_PATH)
print("================================\n")

# ================= TRANSFORMS =================
TRANSFORM = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std= [0.229, 0.224, 0.225])
])

# ================= LOAD MODEL =================
def load_model():
    global MODEL, CLASSES, BREED_INFO

    try:
        ensure_model_artifacts()

        # -------- Load classes --------
        with open(CLASS_PATH, "rb") as f:
            CLASSES = pickle.load(f)
        logger.info(f"Loaded {len(CLASSES)} classes")

        # -------- Load breed info --------
        with open(BREEDS_PATH, "r") as f:
            BREED_INFO = json.load(f)
        logger.info("Loaded breed info")

        # -------- Create model --------
        model = models.resnet50(weights=None)

        # ✅ FIXED: Exact match with train.py fc architecture
        # fc.0 → Dropout(0.4)
        # fc.1 → Linear(2048, 512)
        # fc.2 → ReLU()
        # fc.3 → Dropout(0.3)
        # fc.4 → Linear(512, num_classes)
        model.fc = nn.Sequential(
            nn.Dropout(0.4),
            nn.Linear(2048, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, len(CLASSES))
        )

        # -------- Load saved weights --------
        state_dict = torch.load(MODEL_PATH, map_location=DEVICE)
        model.load_state_dict(state_dict)

        model.to(DEVICE)
        model.eval()

        MODEL = model
        logger.info("✅ MODEL LOADED SUCCESSFULLY")
        return True

    except Exception as e:
        logger.error(f"❌ MODEL LOAD FAILED: {e}")
        return False

# ================= LIFESPAN (replaces deprecated on_event) =================
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting server...")
    load_model()
    yield

# ================= APP =================
app = FastAPI(
    title="Cattle & Buffalo Breed Identification API",
    version="1.0.0",
    lifespan=lifespan
)

# ================= CORS =================
# Get allowed origins from environment or use defaults
def get_allowed_origins():
    """Get CORS allowed origins from environment variable or use defaults."""
    allowed = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:3000,http://localhost:8000"
    )
    return [origin.strip() for origin in allowed.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= ROOT =================
@app.get("/")
def root():
    return {
        "status": "running",
        "model_loaded": MODEL is not None
    }

# ================= HEALTH =================
@app.get("/health")
def health():
    return {
        "model_loaded": MODEL is not None,
        "num_classes": len(CLASSES) if CLASSES else 0,
        "device": str(DEVICE)
    }

# ================= PREDICT =================
@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    if MODEL is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Upload an image file")

    try:
        image_bytes = await file.read()

        if len(image_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty file")

        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image = TRANSFORM(image).unsqueeze(0).to(DEVICE)

        with torch.no_grad():
            outputs = MODEL(image)
            probs   = torch.softmax(outputs, dim=1)
            top_probs, top_idx = torch.topk(probs, 3)

        results = []
        for p, i in zip(top_probs[0], top_idx[0]):
            breed = CLASSES[i.item()]
            results.append({
                "breed":      breed,
                "confidence": round(float(p.item()) * 100, 2),
                "details":    BREED_INFO.get(breed, {})
            })

        return {
            "success":     True,
            "top_match":   results[0]["breed"],
            "confidence":  results[0]["confidence"],
            "predictions": results
        }

    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ================= RUN =================
if __name__ == "__main__":
    import uvicorn

    print("\n========================================")
    print("🚀 SERVER STARTING...")
    print("👉 http://localhost:8000")
    print("👉 Docs: http://localhost:8000/docs")
    print("========================================\n")

    uvicorn.run(app, host="127.0.0.1", port=8000)