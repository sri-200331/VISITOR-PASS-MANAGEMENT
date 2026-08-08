# VisitorPass — Visitor Pass Management System

A full-stack MERN assessment project with role-based authentication, visitor workflow, business-rule validation, activity history, reports, search/filtering, and a responsive dashboard.

## Stack

- React + Vite
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcryptjs
- Axios
- Recharts
- Lucide React

## Roles

- **Administrator** — dashboard, employees, users, reports, activity
- **Receptionist** — register, check-in/out, visitor history
- **Employee** — review, approve/reject, remarks

## Project structure

```text
visitor-pass-management/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   └── package.json
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── seed.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
└── README.md
```

## Setup

### 1. Backend

```bash
cd server
npm install
copy .env.example .env
npm run seed
npm run dev
```

For macOS/Linux use:

```bash
cp .env.example .env
```

### 2. Frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

The frontend runs on the Vite URL shown in the terminal, normally `http://localhost:5173`.

## Environment

`server/.env`

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/visitor_pass_db
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

For Vercel/production, set the same variables in the project environment settings. Use MongoDB Atlas for the production `MONGO_URI`.

## Demo accounts

After `npm run seed`:

| Role | Email | Password |
|---|---|---|
| Administrator | admin@visitorpass.com | Admin@123 |
| Receptionist | reception@visitorpass.com | Reception@123 |
| Employee | employee@visitorpass.com | Employee@123 |

## Core API

### Auth
- `POST /api/auth/login`

### Dashboard
- `GET /api/dashboard`

### Users
- `GET /api/users`
- `POST /api/users`

### Visitors
- `GET /api/visitors`
- `POST /api/visitors`
- `GET /api/visitors/:id`
- `PATCH /api/visitors/:id/approve`
- `PATCH /api/visitors/:id/reject`
- `PATCH /api/visitors/:id/check-in`
- `PATCH /api/visitors/:id/check-out`
- `PATCH /api/visitors/:id/cancel`

### Reports
- `GET /api/reports?from=YYYY-MM-DD&to=YYYY-MM-DD`

### Activity
- `GET /api/activity`

All protected endpoints use:

```http
Authorization: Bearer <JWT>
```

## Business rules implemented

1. A visitor cannot have more than one active visit.
2. Same visitor cannot have duplicate registrations on the same date.
3. Visit date cannot be in the past.
4. Today's expected arrival cannot be in the past.
5. An employee cannot have more than three pending requests.
6. Only approved visitors can check in.
7. Checked-in visitors cannot be checked in again.
8. Check-out must be after check-in.
9. Rejected requests cannot be checked in.
10. Cancelled visits are excluded from active lists.

## Deployment

### Backend
Deploy `server` to a Node-compatible host such as Render/Railway, or another service that supports Express.

### Frontend
Deploy `client` to Vercel/Netlify and set:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

The repository is intentionally split into `client` and `server` so deployment is straightforward.

## Notes

This project is designed as an assessment-ready starter with a polished UI and complete core workflow. Before production use, add rate limiting, refresh-token strategy, audit retention policy, stronger password policy, and HTTPS/security headers at the infrastructure level.
