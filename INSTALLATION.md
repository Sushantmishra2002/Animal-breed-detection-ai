# 🔧 Installation Guide - Step by Step

Complete step-by-step installation instructions for all platforms.

## ✅ Pre-Installation Checklist

Before starting, ensure you have:
- [ ] Windows 10/11, macOS, or Linux
- [ ] At least 8 GB RAM (16 GB recommended)
- [ ] 50 GB free disk space
- [ ] Stable internet connection (for downloading dependencies)

## 📦 Required Software

### 1. Python 3.8+ (Required)

**Check if installed:**
```bash
python --version
```

**If not installed:**
- **Windows**: https://www.python.org/downloads/
- **macOS**: `brew install python3`
- **Linux**: `apt-get install python3`

**Verify installation:**
```bash
python --version    # Should show Python 3.8+
pip --version       # Should show pip version
```

### 2. Node.js 14+ (Required for frontend)

**Check if installed:**
```bash
node --version
npm --version
```

**If not installed:**
- https://nodejs.org/
- Download LTS version (recommended)

**Verify installation:**
```bash
node --version      # Should show v14+
npm --version       # Should show version
```

### 3. Git (Optional, for version control)

**Check if installed:**
```bash
git --version
```

**If not installed:**
- https://git-scm.com/download

---

## 🚀 Installation Steps

### Option A: Automated Setup (Recommended)

#### For Windows:
1. Download/extract the project
2. Open Command Prompt in project folder
3. Run:
   ```bash
   setup.bat
   ```
4. Wait for "SETUP COMPLETE!" message
5. Follow on-screen instructions

#### For Linux/macOS:
1. Download/extract the project
2. Open Terminal in project folder
3. Run:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```
4. Wait for "SETUP COMPLETE!" message
5. Follow on-screen instructions

---

### Option B: Manual Setup (Step by Step)

#### Step 1: Activate Python Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**You should see `(venv)` before your prompt**

#### Step 2: Upgrade pip

```bash
pip install --upgrade pip
```

#### Step 3: Install Training Dependencies

```bash
cd training
pip install -r requirements.txt
cd ..
```

**Expected:**
```
Successfully installed torch, torchvision, Pillow, tqdm, numpy
```

#### Step 4: Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
cd ..
```

**Expected:**
```
Successfully installed fastapi, uvicorn, python-multipart
```

#### Step 5: Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

**Expected:**
```
added XXX packages
```

#### Step 6: Install Testing Tools (Optional)

```bash
pip install -r test_requirements.txt
```

---

## ✅ Verification

After installation, verify everything is set up correctly:

### Check Python Environment
```bash
python -c "import torch; print(f'PyTorch: {torch.__version__}')"
python -c "import torchvision; print(f'TorchVision: {torchvision.__version__}')"
```

### Check Node Environment
```bash
node --version
npm --version
```

### Check Project Structure
```bash
# Verify dataset exists
ls dataset/train/    # Should show 40 breed folders
ls dataset/val/      # Should show 40 breed folders

# Verify breeds.json exists
cat breeds.json      # Should show breed information
```

### Output Example (if everything is correct):
```
PyTorch: 2.2.0
TorchVision: 0.17.0
v18.x.x (Node)
10.1.0 (npm)
```

---

## 🐛 Troubleshooting Installation

### Issue: "Python not found"
```
Solution:
1. Add Python to PATH
2. Or use "python3" instead of "python"
3. Or reinstall from https://www.python.org/
```

### Issue: "Permission denied" (Linux/macOS)
```bash
# Make scripts executable
chmod +x setup.sh
chmod +x training/train.py
chmod +x backend/main.py
```

### Issue: "npm: command not found"
```
Solution:
1. Reinstall Node.js from https://nodejs.org/
2. Restart terminal after installation
3. Verify with: node --version
```

### Issue: "pip: command not found"
```bash
# Try using pip3
pip3 install -r training/requirements.txt
```

### Issue: Virtual Environment Won't Activate
```bash
# Windows
python -m venv venv
venv\Scripts\activate    # Not Scripts.bat

# Linux/macOS
python3 -m venv venv
source venv/bin/activate  # Not source venv/bin/
```

### Issue: "ModuleNotFoundError"

**Make sure virtual environment is activated:**
```bash
# Windows - Look for (venv) at start of prompt
# If not there, run: venv\Scripts\activate

# Linux/macOS - Look for (venv) at start of prompt
# If not there, run: source venv/bin/activate
```

### Issue: Permission Denied on npm install
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### Issue: Disk Space
```
Training requires ~50 GB:
- Dataset: ~20 GB
- Model files: ~2 GB
- Virtual environment: ~5 GB
- Node modules: ~1 GB
Total: ~30 GB minimum
```

---

## 🎯 Next Steps After Installation

After successful installation:

### 1. Train the Model
```bash
cd training
python train.py
```
Takes 30-60 minutes. See Training Guide for details.

### 2. Start Backend
```bash
cd backend
python main.py
```
Should see: "Server starting at http://localhost:8000"

### 3. Start Frontend
```bash
cd frontend
npm start
```
Should open Browser at http://localhost:3000

### 4. Test the System
```bash
# In another terminal:
python test_api.py
```

---

## 💾 System Requirements

### Minimum
- OS: Windows 10, macOS 10.13, Ubuntu 18.04+
- CPU: Intel i5 or equivalent
- RAM: 8 GB
- Disk: 50 GB
- GPU: Optional (much faster if available)

### Recommended
- OS: Windows 11, macOS 12+, Ubuntu 20.04+
- CPU: Intel i7/i9 or AMD Ryzen 7/9
- RAM: 16+ GB
- Disk: 100 GB SSD
- GPU: NVIDIA 1650+ or RTX series

### For GPU Acceleration (Optional)
If you have NVIDIA GPU, follow this to enable GPU training:

1. **Install NVIDIA CUDA Toolkit** (v11.8+)
   - Download: https://developer.nvidia.com/cuda-downloads

2. **Install cuDNN** (v8.6+)
   - Download: https://developer.nvidia.com/cudnn

3. **Verify GPU Support**
   ```bash
   python -c "import torch; print(torch.cuda.is_available())"
   ```
   Should output: `True`

4. **Then training will use GPU automatically**

---

## 🔄 Updating Installation

### Update Python Packages
```bash
pip install --upgrade -r training/requirements.txt
pip install --upgrade -r backend/requirements.txt
```

### Update Frontend Dependencies
```bash
cd frontend
npm update
```

### Check Versions
```bash
pip show torch torchvision fastapi
npm list react react-scripts
```

---

## 🗑️ Clean Installation

If you want to start fresh:

### Remove Virtual Environment
```bash
# Windows
rmdir /s venv

# Linux/macOS
rm -rf venv
```

### Clear Node Modules
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Delete Model Files
```bash
rm -rf model/
```

Then follow installation steps again.

---

## ✨ Installation Complete!

After successful installation, you should have:

✅ **Python 3.8+ with PyTorch**
✅ **Node.js 14+ with React**
✅ **FastAPI backend ready**
✅ **React frontend ready**
✅ **Project structure validated**

### You're ready to:
1. Train the model
2. Run the backend API
3. Run the frontend application
4. Identify cattle & buffalo breeds!

---

## 📞 Still Having Issues?

### Check These Resources
1. **README.md** - Complete documentation
2. **QUICKSTART.md** - 5-minute quick start
3. **PyTorch Docs** - https://pytorch.org/docs
4. **FastAPI Docs** - https://fastapi.tiangolo.com/
5. **React Docs** - https://react.dev/

### Getting Help
1. Check the error message carefully
2. Search the troubleshooting section above
3. Review the full documentation
4. Check terminal output for clues

---

**Installation Complete? Let's train the model! 🚀**

See QUICKSTART.md for next steps.

