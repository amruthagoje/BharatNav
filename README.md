# BharatNav 🚗⚡
**Autonomous Vehicle Decision Support & Path Planning Engine**  
*SIH Problem Statement 26037 — Adaptive Path Planning & Collision Avoidance for Unstructured Indian Roads*

---

## 📌 Overview
BharatNav is an end-to-end simulation and path planning platform designed for autonomous navigation in unstructured Indian driving conditions. It combines real-time risk assessment, trajectory prediction, and adaptive motion planning with an interactive web dashboard.

---

## 🚀 System Architecture

- **Backend (`/backend`)**: Built with FastAPI, Uvicorn, Python, NumPy, SciPy, and WebSockets.
  - **Risk Grid Engine**: Calculates dynamic risk intensity maps for dynamic road obstacles.
  - **Path Planner**: Hybrid path planner (A* grid search, Frenet Frame optimization, Dynamic Window Approach).
  - **Decision Engine**: Finite State Machine handling overtaking, nudging, speed adaptation, and emergency braking.
  - **Real-Time WebSocket**: Broadcasts 20 Hz telemetry state updates to connected clients.
- **Frontend (`/frontend`)**: Built with React, TypeScript, Vite, Tailwind CSS, and Framer Motion.
  - Interactive simulation dashboard, scenario playback, risk grid visualization, perception view, and analytics.

---

## 🛠️ Quickstart Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ and `npm`

### 1. Backend Setup
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Run Backend Server:
```bash
PYTHONPATH=. python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be available at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running Tests
```bash
cd backend
PYTHONPATH=. .venv/bin/pytest
```

---

## 📄 License
MIT License
