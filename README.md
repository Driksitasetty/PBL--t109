# 🛕 Darshan Setu: Smart Pilgrim Safety System
> **BCA Artificial Intelligence & Data Science Final Project**  
> **Team:** Darshan Sathi | **Lead:** Setty Driksita | **Members:** Anjali Verma, Vijeta Saini

---

## 🌟 Executive Summary & Architecture Overview

**Darshan Setu** is an intelligent web application engineered to protect devotees and family members in crowded temple complexes and high-altitude pilgrimage corridors (Kedarnath, Tirumala Tirupati, Vaishno Devi).

The platform integrates:
1. **Frontend:** React with Tailwind CSS, Lucide icons, and sacred particle animations.
2. **Backend:** Python Flask REST API gateway with modular blueprints.
3. **Algorithms & DSA:** Dijkstra's Shortest Path Algorithm implemented with a Min-Priority Queue (`heapq`) and adjacency graph hashing.
4. **Machine Learning:** Scikit-Learn `DecisionTreeClassifier` for multi-factor altitude health risk assessment and transparent clinical prediction.
5. **Computer Vision / AI:** Dual-stream perceptual difference hashing (dHash) and 3D RGB chromatic intensity distribution analysis for missing person photo matching.
6. **Data & Cloud Persistence:** File-backed local state management with zero-config startup + complete Google Firebase (Auth, Firestore, Storage) integration.

---

## 📋 The 5 Core Modules

| # | Module | Implementation | Key Tech / Algorithm |
|---|---|---|---|
| **1** | **Lost Person Finder** | Real image comparison, candidate matching, and CCTV feed simulation | Perceptual Gradient Hash, Color Histogram Correlation, Flask API |
| **2** | **Shortest Route Finder** | Dynamic path calculation across temple checkpoints and queue complexes | Dijkstra's Algorithm, Min-Priority Queue (`heapq`), Adjacency Graph |
| **3** | **Pre-Medical Adviser** | Health risk awareness predicting high-altitude stress and precautions | Decision Tree ML Model (`scikit-learn`), Pandas, NumPy |
| **4** | **Group Separation Radar** | Geo-fenced proximity radar detecting separated pilgrims with audio alerts | Haversine distance, Proximity thresholding, Live JSON sync |
| **5** | **Guide Verification** | Anti-fraud directory and scam reporting shield for pilgrims | Verified badge registry, status audits, confidential reporting |

---

## 🚀 Quick Setup & Execution Guide (VS Code / Windows)

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.10 to v3.14)
- **PowerShell** or VS Code Terminal

---

### 2. Setting Up the Python Backend

Open a terminal in the project directory (`c:\Users\DELL\Desktop\darshansetu`):

```powershell
# 1. Create and activate Python virtual environment (recommended)
python -m venv venv
.\venv\Scripts\Activate.ps1

# 2. Install backend dependencies
pip install -r backend/requirements.txt

# 3. Train the Health Risk Machine Learning Model
python backend/ml/train_model.py

# 4. Start the Flask Backend Server
python backend/app.py
```
*The Flask server starts at: `http://localhost:5000`*  
*Health check URL: `http://localhost:5000/health`*

---

### 3. Setting Up the React Frontend

Open a second terminal in the project root:

```powershell
# 1. Install frontend dependencies (if not already installed)
npm install

# 2. Start the Vite React development server
npm run dev
```
*The React frontend opens at: `http://localhost:5173`*

---

## 🧪 Running Automated Backend Tests

We have included a full automated unit and integration test suite:

```powershell
python backend/test_backend_end_to_end.py
```
*All 11 automated test cases cover image similarity, Dijkstra routes, health classification, group tracking, and guide reports.*

---

## 🛡️ Firebase Cloud Setup (Optional)

The application includes complete Firebase integration code:
- **Authentication:** `src/firebase/authService.js` (Email & Password)
- **Firestore Database:** `src/firebase/firestoreService.js` (Lost persons, SOS alerts, health records)
- **Security Rules:** `firestore.rules` and `storage.rules`

### To connect your own Firebase project:
1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project named `darshansetu`.
2. Enable **Authentication** (Email/Password), **Firestore Database**, and **Storage**.
3. Copy your Web App config credentials into `src/firebase/config.js`.
4. (Optional for backend): Download your service account JSON to `backend/firebase_key.json`.
*(If no Firebase keys are added, the system automatically uses persistent local storage with zero errors!)*

---


# PBL--t109
piligrim safety management system that includes features like group tracking, lost person finding, pre health risk advisor,prevention from fraude tourist guide in which fronted will prepare using REACT, backend includes flask,dsa in c, machine learning, for data storage or updation it includes cloud based firebase 
