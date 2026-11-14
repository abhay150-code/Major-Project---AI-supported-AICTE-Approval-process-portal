# Deployment Guide: AICTE Smart Approval Portal on Render (Free Tier)

This guide walks you through deploying both the **Express.js / Prisma Backend** and the **React / Vite Frontend** to [Render](https://render.com) using your GitHub repository.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│     AICTE Frontend (React)      │       │     AICTE Backend (Express)     │
│   Render Static Site (Free)     │ ────> │    Render Web Service (Free)    │
│  https://aicte-frontend.onrender│       │ https://aicte-backend.onrender  │
└─────────────────────────────────┘       └────────────────┬────────────────┘
                                                           │
                                                           ▼
                                          ┌─────────────────────────────────┐
                                          │  Supabase PostgreSQL Database   │
                                          │   (Cloud Hosted - Pooler 5432)  │
                                          └─────────────────────────────────┘
```

---

## ⚡ Option A: 1-Click Deployment via Render Blueprints (Recommended)

Because we have added `render.yaml` to the root of your repository, Render can configure both services automatically!

### Step 1: Push the Configuration to GitHub
Ensure `render.yaml` and `frontend/public/_redirects` are pushed to your `main` branch.

### Step 2: Create a Render Blueprint
1. Go to [render.com](https://render.com) and log in (or sign up with GitHub).
2. Click **New +** at the top right, then select **Blueprint**.
3. Connect your GitHub repository:
   ```
   abhay150-code/Major-Project---AI-supported-AICTE-Approval-process-portal
   ```
4. Render will read `render.yaml` and display two services to create:
   - `aicte-portal-backend` (Node Web Service)
   - `aicte-portal-frontend` (Static Site)
5. Fill in the required secret environment variable:
   - **`DATABASE_URL`**: Paste your Supabase PostgreSQL connection string:
     ```
     postgresql://postgres.ircurxpwpumjekuhyvcl:[YOUR_PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres?sslmode=require
     ```
6. Click **Apply**.
7. Render will automatically build the backend, run `npx prisma generate`, build the frontend with Vite, wire the backend URL to `VITE_API_URL`, and deploy both live!

---

## 🛠️ Option B: Manual Setup on Render

If you prefer configuring the two services individually in the Render Dashboard:

### 1. Deploy the Backend (Web Service)
1. In Render Dashboard, click **New +** > **Web Service**.
2. Select your repository: `Major-Project---AI-supported-AICTE-Approval-process-portal`.
3. Configure the service settings:
   - **Name:** `aicte-portal-backend`
   - **Region:** `Oregon (US West)` (or closest to your DB)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npx prisma generate`
   - **Start Command:** `npm start`
   - **Plan:** `Free`
4. Under **Environment Variables**, add:
   | Key | Value | Description |
   |---|---|---|
   | `NODE_ENV` | `production` | Production environment flag |
   | `DATABASE_URL` | `postgresql://postgres...` | Your Supabase connection string (with `?sslmode=require`) |
   | `JWT_SECRET` | *(Random 32-character string)* | Secret for signing JWT auth tokens |
   | `JWT_EXPIRES_IN` | `60m` | Token expiration time |
   | `FRONTEND_URL` | *(Leave empty initially)* | Update with frontend URL once deployed |
5. Click **Create Web Service**.
6. Wait 2 minutes for the build to finish. Copy your backend URL:
   `https://aicte-portal-backend.onrender.com`

---

### 2. Deploy the Frontend (Static Site)
1. In Render Dashboard, click **New +** > **Static Site**.
2. Select your repository: `Major-Project---AI-supported-AICTE-Approval-process-portal`.
3. Configure the static site settings:
   - **Name:** `aicte-portal-frontend`
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Under **Environment Variables**, add:
   | Key | Value | Description |
   |---|---|---|
   | `VITE_API_URL` | `https://aicte-portal-backend.onrender.com` | Your live backend URL from step 1 |
5. Under **Redirects / Rewrites**, verify:
   - **Type:** `Rewrite`
   - **Source:** `/*`
   - **Destination:** `/index.html`
   *(This ensures client-side routing like `/institute/dashboard` works on hard refresh)*
6. Click **Create Static Site**.
7. Once deployed, copy your live frontend URL:
   `https://aicte-portal-frontend.onrender.com`

---

### 3. Update Backend CORS
1. Go back to your `aicte-portal-backend` service in Render.
2. Under **Environment Variables**, set `FRONTEND_URL` to your live frontend URL:
   `https://aicte-portal-frontend.onrender.com`
3. Click **Save Changes** (Render will automatically redeploy the backend).

---

## 🧪 Verifying the Live Deployment

1. **Backend Health Check:**
   Visit `https://aicte-portal-backend.onrender.com/api/health` in your browser.
   Expected response:
   ```json
   { "status": "ok", "message": "AICTE Approval Portal API is running" }
   ```

2. **Frontend UI:**
   Visit your live frontend URL: `https://aicte-portal-frontend.onrender.com`.
   - Log in with demonstration credentials:
     - **Institute:** `institute@demo.com` / `password123`
     - **Reviewer:** `reviewer@demo.com` / `password123`
     - **Admin:** `admin@demo.com` / `password123`

---

## 💡 Free Tier Notes
- Render free-tier Web Services go to sleep after 15 minutes of inactivity. When a request arrives, it may take 30–50 seconds for the backend to spin up (cold start). Subsequent requests will be fast.
- The PostgreSQL database is hosted on Supabase and is always online.
