# TDC Matchmaker MVP 🎯

A high-performance, internal matchmaker operational dashboard. This application enables matchmakers to manage client profiles, track pipeline stages, write persistent notes, and generate AI-driven candidate matches.

## 🚀 Live Demo
* **Frontend Application:** [https://tdc-matchmaker-frontend-lake.vercel.app/](https://tdc-matchmaker-frontend-lake.vercel.app/)
* **Backend API Service:** [https://tdc-matchmaker-backend-rouz.onrender.com](https://tdc-matchmaker-backend-rouz.onrender.com)

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite), Tailwind CSS v4, Clerk (Auth), Lucide React (Icons)
- **Backend:** Node.js, Express (v5 with native async error handling), MongoDB (Mongoose)
- **AI Integration:** Groq API (Llama 3.3)

---

## ✨ Features

- **Dual Matching Algorithms:** Toggleable between **Basic AI** (strict demographic filter + LLM ranking) and **Advanced Math** (weighted matrix scoring + LLM explanation).
- **Interactive Workspace:** Dynamic 3-column dashboard with collapsible sidebars (Zen Mode).
- **Persistent Notes:** Live notes section that automatically saves directly to the database.
- **Visual Pipeline Tracking:** Real-time state updates and status tag tracking.
- **Responsive & Premium Design:** Staggered slide-up animations, custom native toasts, and dark-mode aesthetics.

---

## ⚡ Recent Optimization & Resilience Updates

The codebase was recently optimized for production deployment, high responsiveness, and API rate-limit resilience:

- **Session-Level Frontend Caching:** Added React `useRef`-based cache stores on the frontend. Toggling between previously loaded profiles or matching algorithms is now **instantaneous (0ms)** and bypasses backend API calls entirely.
- **Smart Partial Fetching:** The frontend hook only queries the server for *missing* assets (either profile details or matches list) rather than refetching the entire page payload.
- **Race Condition Prevention:** Integrated `AbortController` in the React fetching lifecycle. Obsolete pending requests are canceled immediately when the operator clicks between profiles, preventing UI stale data overwrites and eliminating CORS gateway timeouts.
- **Upstream API Resilience:** Configured a strict `10000ms` (10s) client timeout on the `OpenAI` client. In case of Groq API rate limits (TPM limits) or slow responses, the server gracefully handles the timeout and falls back to mathematical matching values instead of hanging the thread.
- **Database Query Modernization:** Replaced deprecated `{ new: true }` Mongoose update options with `{ returnDocument: 'after' }` to eliminate console deprecation warnings.

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
