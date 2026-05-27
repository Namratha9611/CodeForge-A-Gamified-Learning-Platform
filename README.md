# CodeForge: A Gamified Learning Platform 🚀

CodeForge is a next-generation, AI-driven gamified learning platform designed to revolutionize coding education. By combining advanced artificial intelligence with engaging game mechanics, CodeForge delivers highly personalized, adaptive learning paths for students.

## ✨ Core Features

* **Adaptive Learning Engine:** Automatically adjusts problem difficulty in real-time based on student performance using a Python-powered AI engine.
* **Smart AI Tutor:** Provides progressive, contextual hints without simply giving away the answer.
* **Automated Code Analysis:** Evaluates student code submissions instantly and provides deep feedback on optimization and logic.
* **Gamification:** Students earn XP, level up, and unlock new "Personas" (ranks) as they master different computer science domains.
* **Dynamic Challenge Generation:** AI creates highly specific, unseen problems focusing specifically on a student's weak areas.

## 🛠️ Technology Stack

* **Frontend:** React, Tailwind CSS, Redux Toolkit, Vite
* **Backend:** Node.js, Express.js, MongoDB, Mongoose
* **AI Services:** Python, FastAPI, Scikit-Learn (Adaptive Algorithms)

## 🚦 How to Run the Project locally

You will need **three separate terminals** to start the full stack application.

### 1. Start the AI Backend (Port 8000)
```bash
cd ai-services
python -m uvicorn main:app --reload --port 8000
```

### 2. Start the Node API (Port 5000)
Make sure MongoDB is running on your machine.
```bash
cd backend
npm run dev
```

### 3. Start the React Frontend (Port 3000/5173)
```bash
cd frontend
npm run dev
```

## 📚 Project Architecture

The architecture consists of three highly decoupled microservices communicating via REST APIs. The frontend serves the beautiful gamified UI, the Node API handles authentication and persistence, and the Python FastAPI handles heavy computational logic (code evaluation, difficulty calculation, and challenge generation).
