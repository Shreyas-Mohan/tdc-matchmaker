# TDC Matchmaker MVP 🎯

A high-performance, internal matchmaker operational dashboard. This application enables matchmakers to manage client profiles, track pipeline stages, write persistent notes, and generate AI-driven candidate matches.

## 🚀 Live Demo
* **Live Link:** [Insert Live Link Here]

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite), Tailwind CSS v4, Clerk (Auth), Lucide React (Icons)
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **AI Integration:** Groq API (Llama 3.3)

---

## ✨ Features

- **Dual Matching Algorithms:** Toggleable between **Basic AI** (strict demographic filter + LLM ranking) and **Advanced Math** (weighted matrix scoring + LLM explanation).
- **Interactive Workspace:** Dynamic 3-column dashboard with collapsible sidebars (Zen Mode).
- **Persistent Notes:** Live notes section that automatically saves directly to the database.
- **Visual Pipeline Tracking:** Real-time state updates and status tag tracking.
- **In-Memory Caching:** Backend memory cache (1-hour TTL) to prevent redundant database/LLM API calls.
- **Responsive & Premium Design:** Staggered slide-up animations, custom native toasts, and dark-mode aesthetics.

---

## 💻 Local Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/Shreyas-Mohan/tdc-matchmaker.git
cd tdc-matchmaker
```

### 2. Setup Backend
1. Navigate to backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file in `/backend`:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   GROQ_API_KEY=your_groq_api_key
   ```
3. Start the server:
   ```bash
   npm start
   ```

### 3. Setup Frontend
1. Navigate to frontend directory and install dependencies:
   ```bash
   cd ../frontend
   npm install
   ```
2. Create a `.env` file in `/frontend`:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
   VITE_API_BASE_URL=http://localhost:5000/api/customers
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
