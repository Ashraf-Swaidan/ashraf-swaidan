# Twodo

Twodo is a task app built around **user experience first**. The interface stays deliberately simple on the surface, but the product is a **live experiment**: exploring the smoothest, most efficient ways to capture, organize, and finish work without fighting the UI.

## Design philosophy

**One-click mindset.** Flows are tuned so managing tasks takes as few steps as possible: direct controls, minimal navigation, and interactions that feel immediate rather than ceremonial.

**Clarity over chrome.** The layout stays readable and purposeful so attention stays on what you are doing, not on deciphering the app.

## Core concepts

- **Tasks** — Individual items you create, complete, filter, and archive in a focused workspace.
- **Projects** — A **project** is a shared container: a group of tasks that belong together (a product, a team initiative, or any bucket you choose).
- **Collaboration** — You can **invite other people** into your project so everyone works from the same task list and context.

Together, projects and invitations turn Twodo from a solo list into something you can run with others, still aligned with the same low-friction interaction model.

## Technical overview

| Area        | Stack |
|------------|--------|
| Frontend   | React (Vite), Tailwind CSS, MUI / Next UI, Framer Motion |
| Backend    | Node.js, Express |
| Data       | MongoDB (Mongoose) |
| Auth & extras | JWT-based API auth; Firebase-related configuration where used (e.g. storage) |

Repository layout:

- `frontend/twodo` — Vite React client
- `api` — Express API (`/api/todos`, `/api/projects`, `/api/invitations`, `/api/auth`, …)

## Local development

1. **API** — From `api/`, install dependencies and start the server (e.g. `npm install` then `npm run dev` with nodemon, or `npm start`). Configure environment variables as required by your setup (for example `MONGODB_URI`, `JWT_SECRET`, and any Firebase-related variables used in `api/routes/firebaseConfig.js`).

2. **Frontend** — From `frontend/twodo/`, run `npm install` then `npm run dev`. By default the client targets `http://localhost:5000` for the API in development. You can override the base URL with `VITE_BASE_API_URL` if your API runs elsewhere.

---

Twodo is meant to feel fast and unobtrusive: **fewer clicks, clearer paths,** and room to refine what “efficient” means as the experiment continues.
