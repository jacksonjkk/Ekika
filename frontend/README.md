# Ekika Cultural Experience

React/Vite public website and booking application with a Node/SQLite backend.

## Local setup

Requirements: Node.js 22.5 or newer.

1. Copy `backend/.env.example` to `backend/.env` and change the admin password and secrets.
2. Start the API with `npm run dev:backend`.
3. In another terminal, start the website with `npm run dev`.
4. Open `http://localhost:5173`.

The Vite server proxies `/api` to `http://127.0.0.1:4000`. For a separately hosted API, set `VITE_API_URL` in a root `.env.local` file.

## Commands

- `npm run dev` - run the React app
- `npm run dev:backend` - run the API with file watching
- `npm run start:backend` - run the API normally
- `npm run test:backend` - run backend API tests
- `npm run seed:backend` - reset backend application data and reseed defaults
- `npm run build` - type-check and build the frontend
- `npm run lint` - lint the frontend

Backend details and API routes are documented in [backend/README.md](backend/README.md).
