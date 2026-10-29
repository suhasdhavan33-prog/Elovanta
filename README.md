# Elovanta — Online Tutoring Platform

A full-stack platform for online English/phonics tutoring for kids aged 4–14 — website,
iOS + Android app, cloud database, and cloud hosting.

- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth
- **Website frontend:** React (Vite), React Router, Axios
- **Mobile app (iOS + Android):** React Native + Expo — see [mobile/README.md](mobile/README.md)
- **Database:** MongoDB (local for dev, [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) in the cloud)
- **Hosting:** Render (backend API), Vercel (website), EAS (mobile app builds + store submission)

## Features

- Student, Parent, and Admin accounts (JWT-based auth) — shared by the website and mobile app
- Course catalog by category (phonics, sounds, reading, vocabulary, grammar) and age range
- Lessons with text content, "read aloud" buttons (text-to-speech), and multiple-choice quizzes
- Progress tracking per student, with a parent dashboard to view a linked child's progress
- Admin panel (website only) to create/edit/delete courses, lessons, and quiz questions

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed
- [MongoDB](https://www.mongodb.com/try/download/community) running locally, OR a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string
- [Git](https://git-scm.com/downloads) installed (only needed for the cloud deployment section below)
- Visual Studio Code (recommended) with the project opened at the `online-tutoring-platform` folder

## 1. Backend setup

```bash
cd backend
npm install
copy .env.example .env
```

Edit `.env` if needed (default assumes MongoDB running locally on port 27017).

Seed the database with sample courses, lessons, and demo accounts:

```bash
npm run seed
```

Start the API server (runs on http://localhost:5000):

```bash
npm run dev
```

## 2. Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

The site will be available at **http://localhost:5173**.

## Demo accounts (created by `npm run seed`)

| Role    | Email                    | Password    |
|---------|--------------------------|-------------|
| Admin   | admin@elovanta.com       | admin123    |
| Parent  | parent@elovanta.com      | parent123   |
| Student | student@elovanta.com     | student123  |

The seeded student account is already linked to the seeded parent account, so logging in
as the parent will show that student's progress on the Parent Dashboard.

## Project structure

```
online-tutoring-platform/
  render.yaml                Render Blueprint (optional one-click backend deploy)
  backend/
    config/db.js            MongoDB connection
    models/                 User, Course, Lesson, Progress schemas
    controllers/             Request handlers
    routes/                  Express routers
    middleware/auth.js       JWT auth + role guard
    seed/seedData.js         Sample data loader
    server.js                App entry point
  frontend/
    vercel.json              SPA routing rewrite for Vercel
    src/
      api/axios.js           Axios instance with auth header
      context/AuthContext.jsx Global auth state
      components/            Reusable UI pieces
      pages/                  Route-level pages
      App.jsx, main.jsx       App shell & router setup
  mobile/                    React Native (Expo) app for iOS + Android — see mobile/README.md
    app.json, eas.json        Expo config + cloud build/submit profiles
    src/
      api/, context/, theme/   Same roles as the frontend's equivalents
      components/, screens/    Native UI, mirroring the website's pages
      navigation/               Bottom tabs (Home / Courses / Account), each with its own stack
```

## Opening in Visual Studio Code

1. Open VS Code → File → Open Folder → select `online-tutoring-platform`.
2. Open two integrated terminals (one for `backend`, one for `frontend`) and run the steps above.
3. Recommended extensions: ESLint, Prettier.

## Deploying to the Cloud

This moves the database to **MongoDB Atlas** (cloud), the backend to **Render**, and the
frontend to **Vercel** — all have free tiers and none require a credit card for the free plan.
Do this after the app already works locally (section 1 & 2 above).

### A. Push the project to GitHub

Render and Vercel both deploy by connecting to a GitHub repo.

1. Create a new **empty** repository on [github.com/new](https://github.com/new) (don't add a
   README/.gitignore there — this project already has them).
2. In VS Code's terminal, at the `online-tutoring-platform` root:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

### B. Database — MongoDB Atlas

1. Go to [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register) and
   create a free account.
2. Create a free **M0** cluster (any cloud provider/region is fine).
3. **Database Access** (left sidebar) → Add New Database User → set a username/password
   (save these — you'll need them in the connection string). Choose "Password" auth and
   "Read and write to any database".
4. **Network Access** (left sidebar) → Add IP Address → **Allow Access From Anywhere**
   (`0.0.0.0/0`) — needed since Render's servers don't have a fixed IP on the free plan.
5. **Database** → Connect → Drivers → copy the connection string. It looks like:
   `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority`
6. Add a database name before the `?`, e.g. `.../elovanta?retryWrites=true&w=majority`.
7. Put that full string in `backend/.env` as `MONGO_URI`, replacing `<username>`/`<password>`
   with the real values. Run `npm run seed` locally once against this URI to populate Atlas
   with the sample courses/lessons and demo accounts.

### C. Backend — Render

1. Go to [render.com](https://render.com) and sign up (e.g. with your GitHub account).
2. New → Web Service → connect your GitHub repo.
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
4. Add environment variables (Environment tab):
   - `MONGO_URI` → your Atlas connection string from step B
   - `JWT_SECRET` → a long random string
   - `JWT_EXPIRES_IN` → `7d`
   - `CLIENT_URL` → leave as `http://localhost:5173` for now; you'll update it after step D
5. Deploy. Once live, note the URL Render gives you, e.g. `https://elovanta-backend.onrender.com`.
6. Visit `https://<your-backend>.onrender.com/api/health` — it should return `{"status":"ok"}`.

> A `render.yaml` file is included at the project root if you prefer Render's
> "New +" → "Blueprint" flow instead of the manual steps above.
>
> Note: Render's free web services spin down after ~15 minutes idle, so the first request
> after a quiet period can take 30–50 seconds to wake back up. That's normal on the free tier.

### D. Frontend — Vercel

1. Go to [vercel.com](https://vercel.com) and sign up (e.g. with your GitHub account).
2. Add New → Project → import the same GitHub repo.
3. Settings:
   - **Root Directory:** `frontend`
   - Framework preset: Vite (auto-detected)
4. Add environment variable:
   - `VITE_API_URL` → `https://<your-backend>.onrender.com/api` (from step C)
5. Deploy. Vercel gives you a URL, e.g. `https://elovanta.vercel.app`.

### E. Close the loop (CORS)

Go back to Render → your backend service → Environment, and update `CLIENT_URL` to your
real Vercel URL (comma-separate if you want to keep local dev working too):

```
CLIENT_URL=http://localhost:5173,https://elovanta.vercel.app
```

Save — Render redeploys automatically. Your site is now fully live: Vercel (frontend) →
Render (backend API) → MongoDB Atlas (database).

### Keeping it updated

Both Render and Vercel auto-deploy on every `git push` to `main` once connected, so after the
first setup, shipping a change is just:

```bash
git add .
git commit -m "Describe your change"
git push
```

## Notes / Next Steps

- This is an MVP. Before going to production you should add: HTTPS, rate limiting,
  input sanitization/validation (e.g. with `express-validator`), password reset flow,
  and real email verification.
- Live 1-on-1 video tutoring is not included — this version is self-paced lessons + quizzes.
  Adding live classes would mean integrating a video provider (e.g. Twilio, Daily.co, Zoom SDK)
  plus a booking/calendar system.
