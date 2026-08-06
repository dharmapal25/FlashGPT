# FlashGPT

A modern AI chat app where users can talk to multiple AI models, save their conversations, and manage their profile — all in one clean interface.

## Live Link

**Project URL :**  https://flashpilot.vercel.app

## Features

- Chat with multiple AI models — GPT, Llama, DeepSeek, and Qwen
- View and continue previous conversations from a sidebar history
- Login with Google (OAuth) and secure session handling with JWT
- Profile page showing account details, chat stats, and logout option
- API protected with rate limiting
- Chats auto-delete after 30 days — keeps things fast and saves storage
- Fully responsive UI, works well on mobile too

## Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | React, React Router, React Markdown, CSS |
| **Backend** | Node.js, Express.js, Mongo atlas |
| **Authentication** | Passport.js, JWT, Google OAuth 2.0 |
| **AI** | Groq SDK, OpenAi |

## How to Run Locally

1. Clone the repo
```bash
git clone https://github.com/dharmapal25/FlashGPT.git
cd FlashGPT
```

2. Install dependencies for both frontend and backend
```bash
cd server
npm install

cd ../client
npm install
```

Create a `.env` file inside the `server` folder with:
```env
PORT=5000

# Frontend
FRONTEND_URL=http://localhost:5173

# JWT
JWT_SECRET=your_jwt_secret

# Groq API
GROQ_API_KEY=your_groq_api_key

# AI Models
OPENAI_MODEL=openai_model
LLAMA_MODEL=llama_model
DEEPSEEK_MODEL=deepseek_model
QWEN_MODEL=qwen_model

# AI Configuration
GROQ_AI_CONTEXT_WINDOW=1000

# Database
MONGO_URI=your_mongodb_connection_string

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your_domain/api/auth/google/callback
```

4. Run backend and frontend
```bash
# backend
cd server
npm run dev

# frontend
cd client
npm run dev
```

5. Open `http://localhost:5173` (or whatever port your frontend runs on) in your browser, sign in with Google, and start chatting.