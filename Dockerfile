# Multi-stage build for production deployment

# Stage 1: Build frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy frontend files
COPY frontend/package*.json ./
RUN npm ci

# Copy source
COPY frontend/src ./src
COPY frontend/public ./public

# Build
ENV REACT_APP_API_URL=/api
RUN npm run build

# Stage 2: Setup backend with built frontend
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy backend
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy model and data
COPY model/ ./model/
COPY breeds.json ./

# Copy backend code
COPY backend/ ./

# Copy built frontend
COPY --from=frontend-builder /app/frontend/build ./static

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health').read()"

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
