# Deployment Guide: AICTE Smart Approval Portal (Unified Architecture)

The backend and frontend are now **fully connected into a single unified service**. Express directly serves the compiled React application, meaning:
- **Single Live Link** for the entire portal (e.g. `https://aicte-smart-portal.onrender.com`).
- **Zero CORS issues** because frontend and API requests are same-origin.
- **Zero API URL mismatch** because all frontend requests use relative paths (`/api/*`).

---

## ⚡ 1-Click Permanent Deployment on Render

### Step 1: Open Render
1. Visit **[dashboard.render.com](https://dashboard.render.com/)** and sign in with GitHub (`abhay150-code` / `araj40872@gmail.com`).

### Step 2: Deploy Unified Blueprint
1. Click **New +** (top right) ➔ **Blueprint**.
2. Select your repository: `abhay150-code/Major-Project---AI-supported-AICTE-Approval-process-portal`.
3. When prompted for `DATABASE_URL`, paste your Supabase connection string:
   ```
   postgresql://postgres.ircurxpwpumjekuhyvcl:[YOUR-PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres?sslmode=require
   ```
4. Click **Apply**.
5. Render will build the React frontend, generate Prisma client, start the server, and provide your permanent public URL (e.g. `https://aicte-smart-portal.onrender.com`).

---

## 🧪 Demonstration Credentials

Use any of the seeded demonstration accounts:
- **Institute:** `institute@demo.com` / `password123`
- **Reviewer:** `reviewer@demo.com` / `password123`
- **Admin:** `admin@demo.com` / `password123`
