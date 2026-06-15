# FlashGPT

FlashGPT is a production-ready AI chat app with Google OAuth login, session-based authentication, Gemini responses, MongoDB chat history, and Pinecone-powered long-term memory.

## Live URLs

- Frontend: `https://flashgpt-ai.vercel.app`
- Backend: `https://flashgptai.onrender.com`
- Google callback: `https://flashgptai.onrender.com/auth/google/callback`

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Lucide icons, PWA support
- Backend: Node.js, Express, Passport Google OAuth, Express Session
- Database: MongoDB Atlas
- AI: Google Gemini via `@google/genai`
- Memory/RAG: Pinecone vector database
- Deployment: Vercel frontend, Render backend

## Project Structure

```text
.
|-- backend/
|   |-- auth/passport.js
|   |-- src/controllers/
|   |-- src/models/
|   |-- src/Routers/
|   |-- src/services/
|   |-- src/utils/
|   `-- server.js
`-- frontend/
    |-- src/
    |-- vercel.json
    `-- vite.config.js
```

## Environment Variables

### Backend `.env`

Use these variables on Render and in `backend/.env` for local development.

```env
PORT=3000
NODE_ENV=production

FRONTEND_URL=https://flashgpt-ai.vercel.app
GOOGLE_CALLBACK_URL=https://flashgptai.onrender.com/auth/google/callback

SESSION_SECRET=replace-with-a-strong-random-secret
MONGO_URI=your-mongodb-atlas-uri

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_API_KEY=your-gemini-api-key
AI_MODEL=gemini-2.0-flash

PINECONE_API_KEY=your-pinecone-api-key
PINECONE_INDEX_NAME=your-pinecone-index-name

GROQ_API_KEY=optional-groq-api-key
```

For local development, change:

```env
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

### Frontend `.env`

Use this variable on Vercel and in `frontend/.env` for local development.

```env
VITE_BACKEND_URL=https://flashgptai.onrender.com
```

For local development:

```env
VITE_BACKEND_URL=http://localhost:3000
```

Important: Vite exposes only variables that start with `VITE_`. Do not use `BACKEND_URL` in frontend code or Vercel env.

## Google OAuth Setup

In Google Cloud Console, configure the OAuth client with these values.

### Production

Authorized JavaScript origins:

```text
https://flashgpt-ai.vercel.app
https://flashgptai.onrender.com
```

Authorized redirect URI:

```text
https://flashgptai.onrender.com/auth/google/callback
```

### Local Development

Authorized JavaScript origins:

```text
http://localhost:5173
http://localhost:3000
```

Authorized redirect URI:

```text
http://localhost:3000/auth/google/callback
```

## Local Development

Install dependencies:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Start backend:

```bash
cd backend
npm start
```

Start frontend:

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

## Production Deployment

### Backend on Render

1. Create a new Render Web Service.
2. Set root directory to `backend`.
3. Set build command:

```bash
npm install
```

4. Set start command:

```bash
npm start
```

5. Add all backend environment variables from the backend section.
6. Deploy.

After deployment, confirm this URL works:

```text
https://flashgptai.onrender.com
```

It should show:

```text
Backend Running
```

### Frontend on Vercel

1. Create a new Vercel project.
2. Set root directory to `frontend`.
3. Set build command:

```bash
npm run build
```

4. Set output directory:

```text
dist
```

5. Add this env variable:

```env
VITE_BACKEND_URL=https://flashgptai.onrender.com
```

6. Deploy.

The included `frontend/vercel.json` rewrites all routes to `index.html`, so React Router routes like `/chat/new` work after refresh.

## Production Login Flow

Expected flow:

1. User opens `https://flashgpt-ai.vercel.app/login`.
2. User clicks "Continue with Google".
3. Browser goes to `https://flashgptai.onrender.com/auth/google`.
4. Google redirects to `https://flashgptai.onrender.com/auth/google/callback`.
5. Backend saves the session cookie.
6. Backend redirects back to `https://flashgpt-ai.vercel.app`.
7. Frontend calls `/auth/profile` using credentials.
8. User lands on `/chat/new`.

## Cookie and CORS Notes

Production needs HTTPS because the session cookie uses:

```js
secure: true
sameSite: "none"
```

Local development uses:

```js
secure: false
sameSite: "lax"
```

Make sure:

- `FRONTEND_URL` has no trailing slash, or the backend normalizes it.
- `VITE_BACKEND_URL` points to the deployed backend.
- Axios keeps `withCredentials: true`.
- Render CORS allows the exact Vercel frontend origin.

## Rate Limiting

Chat routes are protected by `backend/src/middleware/rateLimit.middleware.js`.

Current limit:

```text
15 requests per 1 minute
```

This applies to:

```text
POST   /api/chat
GET    /api/chats
GET    /api/chat/:chatId
DELETE /api/chat/:chatId
PUT    /api/chat/:chatId/title
PUT    /api/chat/:chatId/bookmark
```

The limiter uses the logged-in user id when available and falls back to the request IP.

When the limit is crossed, the API returns `429 Too Many Requests`:

```json
{
  "success": false,
  "message": "Too many chat requests. Please try again after 1 minute."
}
```

## PWA

The frontend is configured as an installable PWA through `vite-plugin-pwa`.

Production PWA behavior:

- App name: `FlashGPT`
- Start URL: `/chat/new`
- Display mode: `standalone`
- Theme color: `#0b0f19`
- Icons: `/FLASHGPT_ICON.png` and `/FlashGPT.png`
- Shortcuts: `New Chat` and `Settings`
- Service worker updates automatically
- Static app assets and image media are cached
- Auth and API routes are excluded from SPA navigation fallback

Important files:

```text
frontend/vite.config.js
frontend/src/pwa.js
frontend/public/offline.html
frontend/public/FLASHGPT_ICON.png
frontend/public/FlashGPT.png
```

After changing PWA config, rebuild and redeploy the frontend:

```bash
cd frontend
npm run build
```

## Common Issues

### Login redirects to `localhost:3000`

Cause: frontend env variable is missing or incorrectly named.

Fix:

```env
VITE_BACKEND_URL=https://flashgptai.onrender.com
```

Redeploy frontend after changing Vercel env variables.

### Login succeeds but `/chat/new` returns to `/login`

Cause: session cookie was not saved or `/auth/profile` returned `401`.

Check:

- Backend is using HTTPS in production.
- `FRONTEND_URL=https://flashgpt-ai.vercel.app`
- Axios uses `withCredentials: true`.
- Browser devtools shows a `connect.sid` cookie for the backend domain.

### `/api/chat` returns 500

Check Render logs for:

```text
Gemini Error:
Memory search skipped:
Memory store skipped:
```

Common causes:

- Missing `GOOGLE_API_KEY`
- Invalid `AI_MODEL`
- Gemini quota/rate limit
- Missing or wrong `PINECONE_API_KEY`
- Pinecone index dimension does not match `768`
- Missing `PINECONE_INDEX_NAME`

### Vercel page refresh gives 404

Make sure `frontend/vercel.json` exists:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Useful Commands

Frontend production build:

```bash
cd frontend
npm run build
```

Backend syntax check:

```bash
node --check backend/server.js
node --check backend/src/controllers/chat.controller.js
```

Git status:

```bash
git status --short
```

## API Routes

Auth:

```text
GET /auth/google
GET /auth/google/callback
GET /auth/profile
GET /auth/logout
```

Chat:

```text
GET    /api/chats
GET    /api/chat/:chatId
POST   /api/chat
DELETE /api/chat/:chatId
PUT    /api/chat/:chatId/title
PUT    /api/chat/:chatId/bookmark
```

## Deployment Checklist

- Backend env variables added on Render
- Frontend env variables added on Vercel
- Google OAuth production callback added
- MongoDB Atlas network access allows Render
- Pinecone index exists and uses 768 dimensions
- Backend root URL returns `Backend Running`
- Frontend login goes to Render backend, not localhost
- `/auth/profile` returns `200` after login
- `/api/chat` returns `200` after sending a message
