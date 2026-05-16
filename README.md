# 🧠 GigFlow – Smart Leads Dashboard (Neuro-Dark Edition)

**GigFlow** is a high-performance, enterprise-grade Recruitment CRM and Lead Management command center. Built with a sophisticated "Neuro-Dark" aesthetic, it enables hiring teams to manage their talent pipeline with intelligence, speed, and fluid interactivity.

---

## ✨ Key Features

### 🔐 Security & Access
- **JWT-Powered Auth**: Secure registration and login protocols with bcrypt password hashing.
- **State Persistence**: User sessions and platform preferences (Dark/Light mode) persisted via **Zustand**.

### 📊 Intelligent Command Center (Dashboard)
- **Real-Time Analytics**: Visual tracking of candidate volume and pipeline health.
- **Interactive Stats**: Dynamic cards that reflect the current state of the database.
- **Recent Activity**: Live feed of the latest candidate interactions.

### 🛣️ Advanced Pipeline Management
- **Visual Kanban Board**: Side-scrolling pipeline view to manage candidates across stages (New, Contacted, Qualified, Interview, Hired, Rejected).
- **Deep-Dive Details**: Comprehensive candidate profiles with full interaction history.
- **Status Automation**: One-click stage updates with automatic activity logging.

### 🎨 Premium UI/UX (Neuro-Dark System)
- **Dynamic Theming**: Seamless global toggle between **Neuro-Dark** and **Soft-Slate Light** modes.
- **Cyber-Grid Background**: High-tech interactive grid system for depth and modern feel.
- **Fluid Micro-interactions**: Smooth transitions (`700ms`) and frosted-glass components.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Lucide Icons |
| **State Management** | Zustand |
| **Charts** | Chart.js & React-Chartjs-2 |
| **Backend** | Node.js, Express.js |
| **Database/ORM** | MySQL, Prisma ORM |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt |

---

## ⚙️ Installation & Development Setup

### 1. Prerequisites
- **Node.js**: Version 18 or higher.
- **Database**: A running MySQL instance.

### 2. Backend (Server)
1.  **Install dependencies**:
    ```bash
    cd server && npm install
    ```
2.  **Environment Setup**:
    ```bash
    cp .env.example .env
    ```
    *Update `DATABASE_URL` (MySQL) and `JWT_SECRET` in `.env`.*
3.  **Database Migration**:
    ```bash
    npx prisma migrate dev --name init
    npx prisma db seed
    ```
4.  **Launch**:
    ```bash
    npm run dev
    ```

### 3. Frontend (Client)
1.  **Install dependencies**:
    ```bash
    cd client && npm install
    ```
2.  **Launch**:
    ```bash
    npm run dev
    ```

---

## 📡 API Endpoints (Quick Reference)

- `POST /api/auth/login` - User authentication.
- `GET /api/leads` - Retrieve all candidates.
- `POST /api/leads` - Create a new lead.
- `GET /api/dashboard/stats` - Fetch real-time dashboard analytics.

---

## 🧪 Submission Demo Credentials
- **Email**: `demo@gigflow.com`
- **Password**: `password123`

---

### **Created for the ServiceHive Internship Assignment**
*Submission Deadline: 18 May, 2026*
