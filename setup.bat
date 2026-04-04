@echo off
REM Cattle & Buffalo Breed Identification - Setup Script for Windows

setlocal enabledelayedexpansion

cls
echo ============================================================
echo CATTLE BUFFALO BREED IDENTIFICATION - SETUP SCRIPT (Windows)
echo ============================================================
echo.

REM Check Python
echo [1/5] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo Err Python 3 not found. Please install Python 3.8+
    echo Visit: https://www.python.org/downloads/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo OK Python found: %PYTHON_VERSION%
echo.

REM Check Node.js
echo [2/5] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo Err Node.js not found. Please install Node.js 14+
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo OK Node.js found: %NODE_VERSION%
echo.

REM Create virtual environment
echo [3/5] Setting up Python virtual environment...
if not exist "venv" (
    python -m venv venv
    echo OK Virtual environment created
) else (
    echo OK Virtual environment already exists
)
call venv\Scripts\activate.bat
echo OK Virtual environment activated
echo.

REM Install Python dependencies
echo [4/5] Installing Python dependencies...
python -m pip install --upgrade pip
pip install -r training\requirements.txt
pip install -r backend\requirements.txt
echo OK Python dependencies installed
echo.

REM Install frontend dependencies
echo [5/5] Installing frontend dependencies...
cd frontend
call npm install
cd ..
echo OK Frontend dependencies installed
echo.

echo ============================================================
echo OK SETUP COMPLETE!
echo ============================================================
echo.
echo Next steps:
echo.
echo 1. Train the model (open Command Prompt in project root):
echo    cd training
echo    python train.py
echo.
echo 2. Start the backend (open another Command Prompt):
echo    cd backend
echo    python main.py
echo.
echo 3. Start the frontend (open another Command Prompt):
echo    cd frontend
echo    npm start
echo.
echo 4. Open http://localhost:3000 in your browser
echo.
pause
