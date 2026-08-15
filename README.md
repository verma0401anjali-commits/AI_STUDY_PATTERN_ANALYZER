# 🧠 AI Study Pattern Analyzer

> Discover which study habits actually work for you — powered by K-Means clustering on real student data.

A full-stack web application that takes your study habits as input and matches you to a behavioral study pattern using a machine learning model trained on self-collected survey data. No data sent to any cloud AI — all inference runs locally in Node.js.

---

## ✨ Features

- 📊 **Pattern Detection** — Matches your habits to one of 4 K-Means clusters trained on real student data
- 🏆 **Productivity Band** — Rates your pattern as High, Medium, or Low productivity
- 💡 **Personalized Tip** — Each pattern comes with a targeted, actionable study tip
- 🎨 **Beautiful UI** — Animated landing page, floating bubbles, mascot characters, and smooth transitions
- ⚡ **Zero ML at runtime** — The model is pre-trained offline; inference is plain JavaScript Euclidean distance

---

## 🖥️ Live Preview

| Landing Page | Analyze Page |
|---|---|
| Animated hero section with floating study motifs | Input form → instant pattern result with mascot |

---

## 🗂️ Project Structure

```
Ai-Study-Pattern/
│
├── README.md                        ← You are here
├── .gitignore
│
├── client/                          ← React + Vite frontend
│   ├── index.html
│   ├── vite.config.js               ← Proxies /api → localhost:5000
│   ├── package.json
│   └── src/
│       ├── main.jsx                 ← App entry point
│       ├── App.jsx                  ← Router (Landing / Analyze)
│       ├── App.css                  ← All styles (animations, layout, components)
│       ├── index.css                ← Global resets
│       ├── assets/
│       │   └── processed/           ← Optimized PNGs (mascots, motifs, illustrations)
│       ├── components/
│       │   ├── InputForm.jsx        ← Study habits input form
│       │   └── ResultCard.jsx       ← Pattern result display
│       ├── lib/
│       │   └── api.js               ← fetch wrapper for /api/analyze
│       └── pages/
│           ├── LandingPage.jsx      ← Hero + How it works
│           └── AnalyzePage.jsx      ← Main analysis page with reset
│
├── server/                          ← Node.js + Express backend
│   ├── server.js                    ← App entry, loads clusters.json at startup
│   ├── clusters.json                ← Pre-trained K-Means cluster data (exported from Python)
│   ├── package.json
│   ├── routes/
│   │   └── analyze.js               ← POST /api/analyze endpoint
│   └── lib/
│       ├── nearestCluster.js        ← Euclidean distance matching + StandardScaler logic
│       └── nearestCluster.test.js   ← Unit tests (Jest)
│
└── ml-training/                     ← Offline model training (Python)
    ├── train.ipynb                  ← Jupyter notebook: data prep, K-Means, export
    └── study_pattern_dataset.csv    ← Self-collected student survey data (120 rows)
```

---

## 🤖 How It Works

### Step 1 — Offline Model Training (Python, one-time)
- The `ml-training/train.ipynb` notebook loads `study_pattern_dataset.csv`
- Features: **study hours**, **sleep hours**, **number of breaks**, **time of day**
- A `StandardScaler` normalizes the data, then `KMeans(n_clusters=4)` is fit
- Cluster centers, scaler mean/scale, labels, bands, and tips are exported as `clusters.json`

### Step 2 — Backend Inference (Node.js, zero Python)
- On startup, `server.js` reads `clusters.json` into memory
- `POST /api/analyze` receives user input, encodes time-of-day (`Morning=0, Afternoon=1, Evening=2, Night=3`), standardizes the feature vector using the saved scaler, and finds the nearest cluster by Euclidean distance
- Returns `{ label, band, tip }` — no ML library needed

### Step 3 — Frontend (React)
- The user fills in the form on `/analyze`
- The result is shown as a **Result Card** with a mascot image, productivity band badge, pattern name, and tip
- A **Reset button** at the top-right clears everything back to the empty state

---

## 🔬 Study Patterns (Clusters)

| # | Pattern | Band | Description |
|---|---------|------|-------------|
| 0 | Morning long-session studier | 🟢 High | Long morning sessions with good sleep and regular breaks |
| 1 | Evening steady studier | 🟡 Medium | Consistent evening study, slightly low sleep |
| 2 | Morning light-load high performer | 🟢 High | Short efficient morning sessions with excellent sleep |
| 3 | Night sleep-deprived studier | 🔴 Low | Late-night study with poor sleep and few breaks |

---

## 🚀 Running Locally

### Prerequisites
- **Node.js** v20+
- **npm** v9+
- *(Only for retraining)* Python 3.12+ with `pandas`, `scikit-learn`, `jupyter`

---

### 1. Start the Backend

```bash
cd server
npm install
npm start
```

Runs on **http://localhost:5000**

---

### 2. Start the Frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Runs on **http://localhost:5173**
The Vite dev server proxies all `/api` requests to the backend automatically.

---

### 3. Open the App

Navigate to **http://localhost:5173** in your browser.

---

## 🧪 Running Tests

```bash
cd server
npm test
```

Tests cover the `nearestCluster` function (Euclidean distance, StandardScaler, edge cases).

---

## 🔄 Retraining the Model

If you want to retrain with new data:

1. Add rows to `ml-training/study_pattern_dataset.csv`
2. Open `ml-training/train.ipynb` in Jupyter
3. Run all cells — this exports a new `clusters.json`
4. Copy the new `clusters.json` into `server/clusters.json`
5. Restart the backend server

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router v7, Vite 8 |
| Styling | Vanilla CSS (animations, glassmorphism, gradients) |
| Backend | Node.js, Express 5 |
| ML (offline) | Python, pandas, scikit-learn (K-Means + StandardScaler) |
| ML (runtime) | Plain JavaScript — Euclidean distance in `nearestCluster.js` |
| Testing | Jest |
| No database | All state is request/response; model loaded from JSON |

---

## 📡 API Reference

### `POST /api/analyze`

**Request body:**
```json
{
  "studyHours": 5,
  "sleepHours": 7,
  "breaks": 2,
  "timeOfDay": "Morning"
}
```

| Field | Type | Range |
|-------|------|-------|
| `studyHours` | number | 0 – 16 |
| `sleepHours` | number | 0 – 12 |
| `breaks` | number (int) | 0 – 10 |
| `timeOfDay` | string | `"Morning"` \| `"Afternoon"` \| `"Evening"` \| `"Night"` |

**Response:**
```json
{
  "label": "Morning light-load high performer",
  "band": "High",
  "tip": "Your efficient morning routine of good sleep and regular breaks is working well — keep it up."
}
```

---

## 📁 Key Files Explained

| File | Purpose |
|------|---------|
| `server/clusters.json` | The entire trained ML model — cluster centers, scaler stats, labels, bands, tips |
| `server/lib/nearestCluster.js` | Core ML inference logic in pure JS — standardizes input and finds nearest cluster |
| `client/src/pages/AnalyzePage.jsx` | Main page — manages form state, API call, result, and reset |
| `client/src/App.css` | All visual design — animations, bubbles, form, result card, reset button |
| `ml-training/train.ipynb` | One-time offline training notebook — do not need to run to use the app |

---

## 🎨 Design Highlights

- **Floating bubble animations** — 10 colourful pastel bubbles drift across the analyze page
- **Floating motif images** — 12 study-themed illustrations animate on the landing page
- **Mascot system** — 3 mascot characters (High 🟢 / Medium 🟡 / Low 🔴) shown in the result
- **Reset button** — Cartoon "reset" image button pinned to the top-right, resets all fields including the dropdown
- **Responsive** — Mobile-friendly layout with adaptive sizing at 600px and 860px breakpoints

---

## 📊 Dataset

- **File:** `ml-training/study_pattern_dataset.csv`
- **Rows:** 120 student survey responses (self-collected)
- **Features:** study hours per day, sleep hours per night, number of breaks, preferred study time
- **Labels:** Assigned post-clustering based on behavioral interpretation

---

## 👩‍💻 Author

**Anjali Verma**

Built as a portfolio project combining frontend development, backend API design, and applied machine learning — all in a single, deployable full-stack application.

---

## 📄 License

MIT — free to use, modify, and distribute.

---

## 🙏 Credits

- Mascot and icon illustrations — [OpenMoji](https://openmoji.org/) (CC BY-SA 4.0)
- ML approach inspired by K-Means behavioural clustering research in educational data mining
