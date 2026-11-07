# 🛕 DarshanSetu: Smart Pilgrim Safety System
### Project-Based Learning (PBL) Submission | BCA (AI & Data Science)
**Team ID**: `IDS-III-2026-T109` | **Team Name**: `Darshan Sathi`

---

## 👥 Student Team Information
* **Team Lead**: **Setty Driksita** (Student ID: `2510520075`) — *driksitasetty@gmail.com*
* **Team Member 2**: **Verma Anjali** (Student ID: `2510329219`) — *ianjali2812@gmail.com*
* **Team Member 3**: **Saini Vijeta** (Student ID: `2510610239`) — *vijetasaini2109@gmail.com*

---

## 🌟 How to Open and Run in VS Code (For Your Teacher)

Follow these exact steps when demonstrating the project to your teacher:

### Step 1: Open the Project in VS Code
1. Open **Visual Studio Code**.
2. Click **File** ➔ **Open Folder...**
3. Select the folder:
   ```
   C:\Users\DELL\.gemini\antigravity\scratch\darshansetu
   ```

### Step 2: Open Integrated Terminal
* Press `Ctrl + \`` (backtick) or go to menu **Terminal** ➔ **New Terminal**.

### Step 3: Install Dependencies
Run the following command:
```bash
npm install
```
*(This installs React, Vite, Tailwind CSS, Lucide icons, and Canvas Confetti)*

### Step 4: Start the Development Server
Run:
```bash
npm run dev
```

### Step 5: Open in Browser
Open your browser and navigate to:
```
http://localhost:3000
```
*(Or the local port shown in your terminal)*

---

## 🎯 What to Speak & Demonstrate to Your Teacher (Module-by-Module Script)

### 🎙️ Opening Statement:
> *"Respected Ma'am/Sir, our PBL project is **DarshanSetu: Smart Pilgrim Safety System** (Team Darshan Sathi, IDS-III-2026-T109). In holy high-density pilgrimage sites like Kedarnath, Badrinath, Tirupati, and Vaishno Devi, millions of devotees gather with pure faith. But due to crowd chaos, families get separated, devotees suffer from high-altitude hypoxia, and local touts scam pilgrims with fake tickets. Standard Google Maps stops working at temple entrances.*
>
> *To solve these 5 real-world problems, we have built DarshanSetu combining **Indian Vedic heritage aesthetics** with **Computer Science fundamentals: AI Face Recognition, Dijkstra's Algorithm, Machine Learning Decision Trees, and Geo-fence alerts**."*

---

### 1️⃣ Module 1: AI Lost Person Finder (दृष्टि अन्वेषण)
* **What to Show**:
  1. Click on **"1. Lost Person Finder"** in the top navigation bar.
  2. Point to the **Instant Demo for Teacher Presentation** buttons (e.g., click *Raghav Sharma, 68y*).
  3. Show the **AI Laser Scanline HUD animation** with facial landmark points.
  4. Watch it match against the 24 simulated CCTV feeds with **96.4% confidence** at *Medical Post 2 - Maha Mandapam Corridor*.
  5. Click **"Broadcast Alert to Temple Patrol"** to show instant security dispatch.
* **What to Explain**:
  > *"Here, when an elder or child is lost in a crowd, the family uploads their photo. Our system extracts 128-dimensional facial landmark embeddings (ResNet/OpenCV) and compares them against CCTV footage timestamps to pinpoint their exact location."*

---

### 2️⃣ Module 2: Dijkstra Shortest Route Finder (लघुतम मार्ग सेतु)
* **What to Show**:
  1. Click on **"2. Dijkstra Navigator"**.
  2. Show the **Temple Graph Topography** visualizer (South Gopuram, Queue Halls, Sanctum, Oxygen Tent, Emergency Corridors).
  3. Select **Source: South Gopuram** and **Destination: Garbhagriha (Sanctum)**, then click **"Execute Dijkstra Search"**.
  4. Point to the glowing **golden pathway**, the exact distance (e.g., *490 meters*), and traversal time.
  5. Click **"View Dijkstra C++/Python DSA Code"** to show the **Min-Heap Priority Queue `O((V+E) log V)`** algorithm implementation!
* **What to Explain**:
  > *"In temple sanctums, standard maps fail because of serpentine queue barricades. We modeled the temple as a weighted directed graph and implemented Dijkstra's Algorithm using a Min-Heap Priority Queue to calculate the shortest and safest escape or darshan route."*

---

### 3️⃣ Module 3: ML Pre-Medical Adviser (आरोग्य पूर्वचेतावनी)
* **What to Show**:
  1. Click on **"3. Pre-Medical AI"**.
  2. Click **"High-Risk Preset"** (Age 68, SpO2 83%, BP 155, Nausea checked).
  3. Click **"Generate Pre-Medical Health Diagnosis"**.
  4. Show the **CRITICAL HYPOXIA / AMS ALERT** card, the Decision Tree feature split breakdown, and the nearest oxygen booth.
  5. Next, click **"Healthy Preset"** and show how the classification switches to **FIT FOR DARSHAN**.
* **What to Explain**:
  > *"At high altitudes like Kedarnath (3,583 meters), sudden hypoxia and crowd breathlessness cause severe casualties. We trained a Decision Tree Classifier using scikit-learn on vital parameters (SpO2, Blood Pressure, Heart Rate) to issue pre-trek medical triage advice."*

---

### 4️⃣ Module 4: Group Member Separation Radar (संघ रक्षक सचेतक)
* **What to Show**:
  1. Click on **"4. Group Radar & Alert"**.
  2. Show the **360° Rotating Radar Scope** plotting group members (You, Grandpa, Anjali, Vijeta).
  3. Click the button **"Simulate Member Strayed (175m)"**.
  4. Immediately point out the **flashing red alarm banner** and click **"Sound Loud Emergency Alarm On All Phones"**.
  5. Demonstrate the individual **"Send Loud Buzzer Ping"** button.
* **What to Explain**:
  > *"When families walk together, crowd surges push members apart. This module creates a Bluetooth RSSI / GPS geo-fence. If any member exceeds the 50-meter threshold, the system immediately vibrates and sounds a buzzer on all group phones."*

---

### 5️⃣ Module 5: Devotee Fraud Shield & Guide Verification (सत्य पथ रक्षक)
* **What to Show**:
  1. Click on **"5. Anti-Fraud & Guides"**.
  2. Click **"Test Verified Guide"** (Pandit Radhe Shyam Tiwari, authorized by Temple Committee, fee capped at ₹350).
  3. Click **"Test Blacklisted Fraud"** (Raju Verma, illegal ₹5,000 fee, fake VIP pass scam).
  4. Click **"Report a Fraud Guide"** and show the quick complaint submission to the Temple Vigilance Police.
* **What to Explain**:
  > *"Devotees are regularly cheated by unauthorized touts selling fake VIP passes. We created an authentication registry where pilgrims can verify guide badges, view official government rate caps, or report fraudsters."*

---

### 6️⃣ Role-Based Dashboards & Architecture Presentation
* **Role Switcher**: Click between **Devotee**, **Family Member**, **Temple Staff**, and **Shrine Board Admin** in the top bar to show how the system adapts to each stakeholder.
* **Architecture Specs**: Click the button **"Flask + Firebase Specs"** in the top right navbar to show the complete Python Flask API routes and Firebase database schema!

---

## 🏗️ Further Steps: How to Integrate with Backend (Flask & Firebase)

As outlined in your project proposal, here is how the frontend connects to the backend:

```
[ React Frontend (Vite) ]
        │
        │ HTTP / REST APIs (JSON)
        ▼
[ Python Flask Backend (app.py) ]
   ├── Module 1: OpenCV / Face_Recognition (128D Embeddings)
   ├── Module 2: Graph + Dijkstra Priority Queue (DSA)
   └── Module 3: Scikit-Learn DecisionTreeClassifier (ML)
        │
        ▼
[ Google Firebase Cloud ]
   ├── Authentication (Devotee & Staff Login)
   ├── Cloud Firestore (Lost Reports, Group GPS, Guide Registry)
   └── Cloud Storage (Face Photos, CCTV frames)
```

### Ready-to-Run Backend Files Included:
Your project already contains the complete companion backend scripts inside the `backend/` folder:
1. `backend/app.py`: Full Flask server with endpoints for:
   * `/api/navigation/dijkstra`
   * `/api/medical/triage`
   * `/api/surveillance/match-face`
   * `/api/group/check-separation`
   * `/api/guides/verify`
2. `backend/requirements.txt`: Python packages (`flask`, `flask-cors`, `scikit-learn`, `numpy`, `pandas`, `opencv-python`).

### How to Run the Backend:
```bash
cd backend
pip install -r requirements.txt
python app.py
```
*(Runs on `http://localhost:5000`)*

---

## 🎓 Viva / Teacher Q&A Cheat Sheet

| Question | Winning Answer for Teacher |
| :--- | :--- |
| **Why use Dijkstra instead of Breadth-First Search (BFS)?** | *"BFS only works for unweighted graphs where all paths have equal cost. In temple complexes, different pathways have different physical distances and varying crowd densities (weights). Dijkstra with a Min-Heap Priority Queue finds the true minimum-cost path in $O((V+E) \log V)$ time."* |
| **How does the ML Pre-Medical Adviser work?** | *"We use a Decision Tree Classifier trained with Scikit-learn. Decision Trees are ideal for emergency medical triage because they offer explainable, non-black-box decision paths (e.g., checking Altitude > 3000m, then SpO2 < 85%) allowing doctors to understand the exact root cause."* |
| **How does the facial recognition handle low-light or blurred photos?** | *"In our architecture, the uploaded photo is preprocessed with histogram equalization and alignment before extracting 128D facial embeddings. When matching against CCTV feeds, we use cosine similarity thresholds with false-positive filtering based on camera timestamps."* |
| **How does Firebase support offline temple scenarios?** | *"Firebase Firestore provides offline persistence caching. Even when cellular data fluctuates at high altitudes, local device caches store the group's last known coordinates and sync back when connected."* |

---

*Submission by Team Darshan Sathi | BCA (AI DS) | IDS-III-2026-T109*
