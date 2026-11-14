# AICTE Smart Approval Portal (Simplified Academic Version)

> **Disclaimer:** This is an educational DBMS and Web Development prototype. Document requirements in this application are demonstration requirements, not verified official AICTE regulations.

---

## Technology Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios, Lucide React, Recharts
- **Backend:** Node.js, Express.js, JWT (`jsonwebtoken`), `bcryptjs`, `cors`, `dotenv`
- **Database:** PostgreSQL + Prisma ORM `7.x` (`@prisma/adapter-pg` + `pg`)
- **Testing:** Jest + Supertest

---

## Folder Structure

```text
aicte-smart-approval-portal/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── config/prisma.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/api.test.js
│   ├── prisma.config.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/common/
│   │   ├── context/AuthContext.jsx
│   │   ├── hooks/useAuth.js
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/api.js
│   │   ├── utils/helpers.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── .gitignore
└── README.md
```

---

## Setup & Run Instructions

### 1. Configure Backend Environment Variables
```bash
cd aicte-smart-approval-portal/backend
cp .env.example .env
# Set DATABASE_URL (PostgreSQL / Supabase), JWT_SECRET, and PORT=5001
```

### 2. Install Dependencies, Generate Prisma Client, Migrate & Seed
```bash
cd aicte-smart-approval-portal/backend
npm install
npm run prisma:generate
npm run prisma:push      # or: npm run prisma:migrate
npm run seed
npm run dev              # starts Express on http://localhost:5001
```

### 3. Start Frontend
```bash
cd aicte-smart-approval-portal/frontend
npm install
npm run dev              # starts Vite on http://localhost:3000
```

### 4. Run Backend Tests
```bash
cd aicte-smart-approval-portal/backend
npm test
```

---

## Demonstration Login Credentials (`prisma/seed.js`)

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@aicte.demo` | `Admin@123` |
| **Reviewer** | `reviewer@aicte.demo` | `Reviewer@123` |
| **Institute 1** | `institute1@demo.com` | `Institute@123` |
| **Institute 2** | `institute2@demo.com` | `Institute@123` |
