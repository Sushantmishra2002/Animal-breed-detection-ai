#!/bin/bash

# Cattle & Buffalo Breed Identification - Setup Script
# This script sets up the entire project on Linux/macOS

set -e  # Exit on error

echo "============================================================"
echo "CATTLE & BUFFALO BREED IDENTIFICATION - SETUP SCRIPT"
echo "============================================================"
echo ""

# Check Python
echo "[1/5] Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.8+"
    exit 1
fi
echo "✓ Python found: $(python3 --version)"
echo ""

# Check Node.js
echo "[2/5] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 14+"
    exit 1
fi
echo "✓ Node.js found: $(node --version)"
echo ""

# Create virtual environment
echo "[3/5] Setting up Python virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment already exists"
fi

source venv/bin/activate
echo "✓ Virtual environment activated"
echo ""

# Install dependencies
echo "[4/5] Installing Python dependencies..."
pip install --upgrade pip
pip install -r training/requirements.txt
pip install -r backend/requirements.txt
echo "✓ Python dependencies installed"
echo ""

# Install frontend dependencies
echo "[5/5] Installing frontend dependencies..."
cd frontend
npm install
cd ..
cd frontend
npm ci
cd ..
echo "✓ Frontend dependencies installed"
echo ""

echo "============================================================"
echo "✓ SETUP COMPLETE!"
echo "============================================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Train the model (in main directory):"
echo "   cd training && python train.py"
echo ""
echo "2. Start the backend (in main directory):"
echo "   cd backend && python main.py"
echo ""
echo "3. Start the frontend (in another terminal):"
echo "   cd frontend && npm start"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
