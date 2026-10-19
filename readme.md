# TaskForge API

A clean, modular, production-grade Task Management REST API built with Node.js, Express, TypeScript, and Zod.

---

## 🛠 Features

- **Layered Architecture**: Clear separation of concerns (`routes` -> `controllers` -> `services` -> `types`).
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
    ├── app.ts                  # Express application configuration & route binding
    ├── server.ts               # HTTP server bootstrap & graceful termination
    ├── controllers/
    │   └── task.controller.ts  # HTTP request orchestration & response formatting
    ├── errors/
    │   └── app.error.ts        # AppError hierarchy (NotFoundError, ValidationError, etc.)
    ├── middleware/
    │   ├── errorHandler.ts     # Global centralized error handling middleware
    │   └── validate.ts         # Generic Zod validation middleware for Express
    ├── routes/
    │   └── task.routes.ts      # REST API route declarations with validation guards
    ├── schemas/
    │   └── task.schema.ts      # Zod validation schemas for payload, query, and params
    ├── services/
    │   └── task.service.ts     # Task business logic, in-memory store, filtering & pagination
    └── types/
        └── task.types.ts       # Domain types, interfaces, and pagination DTOs
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

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/health` | Service health check | `200` |
| `GET` | `/api/v1/tasks` | List tasks (supports `status`, `priority`, `search`, `page`, `limit`) | `200`, `400` |
| `GET` | `/api/v1/tasks/:id` | Fetch task by UUID | `200`, `400`, `404` |
| `POST` | `/api/v1/tasks` | Create new task | `201`, `400` |
| `PUT` | `/api/v1/tasks/:id` | Update task by UUID | `200`, `400`, `404` |
| `DELETE` | `/api/v1/tasks/:id` | Remove task by UUID | `204`, `400`, `404` |
