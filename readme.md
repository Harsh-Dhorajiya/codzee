# TaskForge API

A clean, modular, production-grade Task Management REST API built with Node.js, Express, TypeScript, Zod, and JWT authentication.

---

## 🛠 Features

- **Layered Architecture**: Clear separation of concerns (`routes` -> `controllers` -> `services` -> `types`).
- **JWT Authentication & Password Security**: Secure user registration and login with `bcrypt` salt hashing, Bearer JWT verification, and timing-attack protections.
- **Multi-Tenant User Isolation (IDOR Protected)**: Tasks are scoped to the authenticated user (`ownerId`). Direct object reference attacks on `GET`, `PUT`, and `DELETE` are strictly blocked (`403 Forbidden`).
- **Rate Limiting**: Brute-force protection on `/api/v1/auth/login` using `express-rate-limit`.
- **Schema Validation**: Runtime request validation powered by Zod (`body`, `params`, `query`) with detailed field-level error messages.
- **Centralized Error Handling**: Custom `AppError` hierarchy, uniform JSON error structures, and environment-aware stack traces.
- **Query Filtering & Pagination**: Filter tasks by `status` and `priority`, case-insensitive keyword `search`, and page-based pagination.
- **In-Memory Store**: Thread-safe in-memory `Map` storage with $O(1)$ lookups.
- **Graceful Shutdown**: Production-ready `SIGINT` / `SIGTERM` listeners.

---

## 📁 Project Structure

```text
taskforge-api/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── app.ts                  # Express application setup & middleware mounting
    ├── server.ts               # HTTP server bootstrap & graceful termination
    ├── config/
    │   └── jwt.config.ts       # JWT secret & expiration configuration
    ├── controllers/
    │   ├── auth.controller.ts  # Registration & login HTTP handlers
    │   └── task.controller.ts  # Task HTTP handlers with owner scoping
    ├── errors/
    │   └── app.error.ts        # AppError hierarchy (Unauthorized, Forbidden, NotFound, etc.)
    ├── middleware/
    │   ├── auth.middleware.ts  # JWT Bearer verification & req.user attachment
    │   ├── errorHandler.ts     # Global centralized error handling middleware
    │   ├── rateLimiter.ts      # Brute-force protection for login
    │   └── validate.ts         # Generic Zod validation middleware for Express
    ├── routes/
    │   ├── auth.routes.ts      # Auth endpoints (/register, /login)
    │   └── task.routes.ts      # Protected task REST endpoints
    ├── schemas/
    │   ├── auth.schema.ts      # Zod validation schemas for registration & login
    │   └── task.schema.ts      # Zod validation schemas for task payloads & queries
    ├── services/
    │   ├── auth.service.ts     # Password hashing, timing-safe auth & token issuance
    │   └── task.service.ts     # Scoped task business logic & in-memory store
    └── types/
        ├── express.d.ts        # Express Request declaration augmentation (req.user)
        ├── task.types.ts       # Task models, enums & pagination DTOs
        └── user.types.ts       # User models, auth payloads & DTOs
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

```bash
cp .env.example .env
```

### 3. Run in Development Mode

```bash
npm run dev
```

### 4. Build and Run in Production

```bash
npm run build
npm run start
```

---

## 🔌 API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required | Status Codes |
|---|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register new user account | No | `201`, `400`, `409` |
| `POST` | `/api/v1/auth/login` | Authenticate & get JWT (Rate limited) | No | `200`, `400`, `401`, `429` |

### Tasks (`/api/v1/tasks`)

| Method | Endpoint | Description | Auth Required | Status Codes |
|---|---|---|---|---|
| `GET` | `/api/v1/tasks` | List user's tasks (filters: `status`, `priority`, `search`, `page`, `limit`) | Yes (Bearer) | `200`, `401` |
| `GET` | `/api/v1/tasks/:id` | Fetch task by ID | Yes (Bearer) | `200`, `401`, `403`, `404` |
| `POST` | `/api/v1/tasks` | Create task assigned to user | Yes (Bearer) | `201`, `400`, `401` |
| `PUT` | `/api/v1/tasks/:id` | Update user's task | Yes (Bearer) | `200`, `400`, `401`, `403`, `404` |
| `DELETE` | `/api/v1/tasks/:id` | Remove user's task | Yes (Bearer) | `204`, `401`, `403`, `404` |

| Method | Endpoint | Description | Auth Required | Status Codes |
|---|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register new user account | No | `201`, `400`, `409` |
| `POST` | `/api/v1/auth/login` | Authenticate & get JWT (Rate limited) | No | `200`, `400`, `401`, `429` |

### Tasks (`/api/v1/tasks`)

| Method | Endpoint | Description | Auth Required | Status Codes |
|---|---|---|---|---|
| `GET` | `/api/v1/tasks` | List user's tasks (filters: `status`, `priority`, `search`, `page`, `limit`) | Yes (Bearer) | `200`, `401` |
| `GET` | `/api/v1/tasks/:id` | Fetch task by ID | Yes (Bearer) | `200`, `401`, `403`, `404` |
| `POST` | `/api/v1/tasks` | Create task assigned to user | Yes (Bearer) | `201`, `400`, `401` |
| `PUT` | `/api/v1/tasks/:id` | Update user's task | Yes (Bearer) | `200`, `400`, `401`, `403`, `404` |
| `DELETE` | `/api/v1/tasks/:id` | Remove user's task | Yes (Bearer) | `204`, `401`, `403`, `404` |

