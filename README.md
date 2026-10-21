# StudentHub Backend

Express + MongoDB REST API for StudentHub. Requires Node.js 20+ and a MongoDB database (MongoDB Atlas is fine).

## Setup

1. Open a terminal in the `backend` directory.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Set `MONGODB_URI`, a long random `SESSION_SECRET`, and `CLIENT_URL=http://localhost:5173`.
5. Run `npm run dev`.
6. Visit `http://localhost:5000/api/health`.

PowerShell copy command: `Copy-Item .env.example .env`

Generate a session secret in PowerShell with: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

## API routes

- `GET /api/health` — API status
- `POST /api/auth/register` — `{ "name": "Ada Example", "email": "ada@example.com", "password": "a-strong-password" }`
- `POST /api/auth/login` — `{ "email": "ada@example.com", "password": "a-strong-password" }`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `PATCH /api/auth/change-password` — `{ "currentPassword": "...", "newPassword": "..." }`
- `GET, POST /api/assignments`; `GET, PATCH, DELETE /api/assignments/:id`
- `GET, POST /api/goals`; `PATCH, DELETE /api/goals/:id`
- `GET, POST /api/notes`; `PATCH, DELETE /api/notes/:id`
- `GET /api/dashboard/summary`

All assignment, goal, note, and dashboard routes require a logged-in session. All records are scoped to the authenticated user. Use `credentials: 'include'` with browser fetch or `withCredentials: true` with Axios so session cookies are sent.

## Security notes

- Passwords are hashed using bcrypt; plaintext passwords are never stored.
- Session data is stored in MongoDB, not Express's in-memory development store.
- Cookies are HttpOnly, SameSite=Lax, and Secure in production.
- Login and registration are rate-limited; Helmet adds security headers; request bodies are size-limited and validated.
- For production, deploy frontend and API over HTTPS, use a strong secret, configure the exact frontend origin, and review cross-site cookie/CSRF requirements if frontend and API are on different sites.
