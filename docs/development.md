# Development Guide

This guide covers the day-to-day development workflow for NutriChef AI.

---

# Running the Application

The backend and frontend should be run in separate terminals.

## Backend

Navigate to the backend directory.

```bash
cd backend
```

Activate the virtual environment.

### Windows

```bash
.venv\Scripts\activate
```

### macOS / Linux

```bash
source .venv/bin/activate
```

Start the FastAPI development server.

```bash
python -m uvicorn app.main:app --reload
```

Backend URLs

| Service    | URL                                |
|------------|------------------------------------|
| API        | http://127.0.0.1:8000              |
| Swagger UI | http://127.0.0.1:8000/docs         |
| OpenAPI    | http://127.0.0.1:8000/openapi.json |

---

## Frontend

Navigate to the frontend directory.

```bash
cd frontend
```

Start the Vite development server.

```bash
npm run dev
```

Frontend URL

```
http://localhost:5173
```

---

# Backend Development

## Running Tests

Run the complete test suite.

```bash
pytest
```

Run a specific test file.

```bash
pytest tests/test_profile_api.py
```

Run a specific test.

```bash
pytest tests/test_profile_api.py::test_create_profile
```

---

## Formatting

Format the codebase.

```bash
black .
```

---

## Organize Imports

```bash
isort .
```

---

# Frontend Development

## Lint the Project

```bash
npm run lint
```

---

## Automatically Fix Lint Issues

```bash
npm run lint:fix
```

---

## Format the Project

```bash
npm run format
```

---

## Verify Formatting

```bash
npm run format:check
```

---

# Git Hooks

The project uses **Husky** together with **lint-staged**.

Before every commit, Husky automatically executes the configured lint-staged tasks.

Current checks include:

- ESLint
- Prettier

If a check fails, the commit is aborted until the issue is resolved.

---

# Recommended Development Workflow

## 1. Start the Backend

```bash
cd backend

.venv\Scripts\activate

python -m uvicorn app.main:app --reload
```

---

## 2. Start the Frontend

Open a second terminal.

```bash
cd frontend

npm run dev
```

---

## 3. Develop the Feature

- Create a feature branch.
- Implement the required functionality.
- Write or update tests.
- Verify the application manually.

---

## 4. Verify Code Quality

### Backend

```bash
pytest

black .

isort .
```

### Frontend

```bash
npm run lint

npm run format
```

---

## 5. Commit Changes

```bash
git add .

git commit -m "feat: your feature"

git push
```

---

# Development Principles

- Keep business logic inside the service layer.
- Keep API routes lightweight.
- Validate all request and response models using Pydantic.
- Keep React components modular and reusable.
- Prefer composition over duplication.
- Write tests for all new functionality.
- Maintain consistent formatting using the configured tooling.