# HindConnect 🌐
> **Intelligent IT Helpdesk & Support Portal — Hindalco Industries Limited**

HindConnect is a premium, next-generation enterprise IT helpdesk portal engineered for Hindalco's manufacturing refineries, smelters, and administrative hubs. It streamlines support ticketing, SLA monitoring, and IT asset allocation using smart AI-assisted ticket triage, automated categorization, and modern responsive design.

---

## 🚀 Key Features

* **AI-Assisted Incident Triage**: Leverages the Google Gemini API to analyze ticket titles and descriptions, auto-suggest categories, estimate ticket priorities, and detect keywords.
* **Support Ticket Lifecycle Management**: Full workflow support for raising incidents, assigning technicians, writing internal notes, and resolving/closing tickets.
* **Interactive Live Dashboards**: Dedicated command consoles for three user tiers:
  * **Employees**: Raise new issues, reply to IT technicians, and track active claims.
  * **IT Support Staff**: Pick up pending issues, update incident statuses, and record internal troubleshooting logs.
  * **IT Administrators**: Executive Analytics charts, technician load distribution, and self-service account registration approvals.
* **Employee Digital Identity Dossier**: High-fidelity user verification panels containing role identification, emergency contact logs, and active directory status badges.
* **Secure Registration with OTP Verification**: Seamless signup flow utilizing automated one-time-password (OTP) email challenges to verify corporate email authenticity.

---

## 🎨 Design & Aesthetic Excellence

HindConnect is built using rich visual components, modern glassmorphism, and immersive micro-interactions:
* **Background Grid**: Crisp corporate-themed dot matrix background overlay (`.corporate-grid-bg`).
* **Interactive Mesh Backdrop**: A moving gradient backdrop mapping deep navy to active corporate colors (`.bg-gradient-mesh` with `animate-gradient-shift`).
* **Visual Glow Effects**: Pulsing atmospheric shadows highlighting card boundaries and inputs (`animate-pulse-glow`).
* **Shifting Glowing Borders (`.sexy-card`)**: Multi-color border gradient masks that reveal themselves dynamically on card hover alongside smooth image expansions (`scale-115`).
* **Live Status Bulbs**: Bouncing/pulsing state markers (`live-pulse-green` / `live-pulse-orange`) highlighting live queues.

---

## 🛠️ Technology Stack

* **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, Recharts (analytics graphs).
* **Backend**: Node.js, Express.js, JWT Authentication, Bcrypt Password Encryption.
* **Database**: MongoDB (Mongoose Schema mapping) with a fully functional local JSON fallback database (`database.json`).
* **Integration**: Gemini API (AI categorization and keyword analytics).

---

## 📁 Repository Structure

```text
HindConnect-Monorepo/
├── client/                     # Frontend client codebase (Vite + React)
│   ├── src/
│   │   ├── components/         # Reusable widgets (Navbar, Sidebar, OtpModal)
│   │   ├── context/            # Auth and Global State providers
│   │   ├── pages/              # View screens (Dashboard, LoginPage, LandingPage)
│   │   ├── App.jsx             # Root layout and client-side routing
│   │   └── index.css           # Premium styling directives
│   └── package.json
│
├── server/                     # Backend server codebase (Express.js)
│   ├── controllers/            # Controller layers (Auth, Tickets, AI)
│   ├── middleware/             # Route security and role verification
│   ├── db.js                   # Unified database schema (Mongoose / JSON DB)
│   ├── database.json           # Offline fallback database file
│   ├── seed.js                 # Database seeding configuration
│   ├── server.js               # Entry node listener
│   └── package.json
│
└── package.json                # Monorepo scripts package
```

---

## 💻 Installation & Quickstart

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **npm** or **yarn**

### 1. Environment Configurations
Create a `.env` configuration file inside the `/server` directory and declare:
```ini
PORT=5000
MONGO_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_signing_key
GEMINI_API_KEY=your_google_gemini_api_key
EMAIL_USER=your_smtp_email_address
EMAIL_PASS=your_smtp_app_password
EMAIL_FROM="HindConnect Portal <your_smtp_email_address>"
```

### 2. Dependency Setup
Run the monorepo installer from the repository root to automatically pull modules for both environments:
```bash
npm run install-all
```

### 3. Database Seeding
To initialize the database with standard roles, articles, and incident logs, run:
```bash
npm run seed
```
This registers default evaluator accounts:
* **Employee**: `rajesh.sharma@hindconnect.com` / `password123`
* **IT Support**: `amit.verma@hindconnect.com` / `password123`
* **Admin**: `vishesh4757@gmail.com` / `123456789` (Vishesh Kumar Singh)

### 4. Running Locally
Run these two commands in separate terminal split sheets to launch the servers:
```bash

npm run start-server


npm run start-client
```

---

## 🔒 Security Compliance

* All passwords stored in database models are protected using **Blowfish block-cipher hashing (BcryptJS)**.
* API endpoints are secured via **JWT Bearer Headers** in cookies or headers.
* Registrations are isolated with an Admin approval queue; pending accounts cannot authenticate until approved in the Administration Panel.
