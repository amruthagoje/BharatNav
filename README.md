# BharatNav 🚗⚡

**Autonomous Vehicle Decision Support & Path Planning Engine**

*SIH Problem Statement 26037 — Adaptive Path Planning & Collision Avoidance for Unstructured Indian Roads*

<p align="center">
  <b>Predict the chaos. Map the risk. Adapt the path.</b>
</p>

---

## 🎥 Project Demo

### YouTube Demo

▶️ **[Watch BharatNav Demo on YouTube](YOUR_YOUTUBE_LINK)**

---

## 📸 Screenshots

### Dashboard

<p align="center">
  <img src="docs/screenshots/dashboard.png" alt="BharatNav Dashboard" width="900"/>
</p>

### Live Simulation

<p align="center">
  <img src="docs/screenshots/live-simulation.png" alt="Live Simulation" width="900"/>
</p>

### Dynamic Risk Grid

<p align="center">
  <img src="docs/screenshots/risk-grid.png" alt="Dynamic Risk Grid" width="900"/>
</p>

### Path Planning

<p align="center">
  <img src="docs/screenshots/path-planning.png" alt="Path Planning" width="900"/>
</p>

---

## 📌 Overview

BharatNav is an end-to-end simulation and path planning platform designed for autonomous navigation in unstructured Indian driving conditions.

It combines:

- Real-time risk assessment
- Trajectory prediction
- Adaptive motion planning
- Collision avoidance
- Decision-making
- Interactive simulation
- Scenario playback
- Risk grid visualization
- Perception monitoring
- Analytics

The system is designed to handle challenging Indian-road conditions involving mixed traffic, unpredictable road-user behavior, unclear road boundaries, and sudden obstacles.

---

# 🚀 System Architecture

```text
                     ┌─────────────────────────┐
                     │   Environment / Sensors │
                     │ Camera • LiDAR • Radar  │
                     └────────────┬────────────┘
                                  ↓
                     ┌─────────────────────────┐
                     │ Perception & Tracking   │
                     └────────────┬────────────┘
                                  ↓
                     ┌─────────────────────────┐
                     │  Trajectory Prediction  │
                     └────────────┬────────────┘
                                  ↓
                     ┌─────────────────────────┐
                     │    Dynamic Risk Grid    │
                     │       + TTC Analysis    │
                     └────────────┬────────────┘
                                  ↓
                     ┌─────────────────────────┐
                     │    Decision Engine      │
                     │ Cruise / Slow / Replan  │
                     │ Emergency Braking       │
                     └────────────┬────────────┘
                                  ↓
                     ┌─────────────────────────┐
                     │    Path Planner         │
                     │ A* • Frenet • DWA       │
                     └────────────┬────────────┘
                                  ↓
                     ┌─────────────────────────┐
                     │   Vehicle Controller    │
                     └────────────┬────────────┘
                                  ↓
                     ┌─────────────────────────┐
                     │  Simulation & Analytics │
                     └────────────┬────────────┘
                                  │
                                  └──────► REPLAN 🔄

```

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
````

### Run Backend Server

```bash
PYTHONPATH=. python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

API Documentation will be available at:

`http://127.0.0.1:8000/docs`

### 2. Frontend Setup

Open a new terminal and run:

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
