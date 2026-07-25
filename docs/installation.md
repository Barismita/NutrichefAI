# Installation

This guide explains how to set up NutriChef AI for local development.

---

# Prerequisites

Ensure the following software is installed before starting.

| Software      | Version        |
|---------------|----------------|
| Python        | 3.11+          |
| Node.js       | 18+            |
| npm           | Latest         |
| MongoDB Atlas | Active Cluster |
| Git           | Latest         |

---

# Clone the Repository

```bash
git clone <repository-url>

cd NutriChefAI
```

---

# Backend Setup

Navigate to the backend directory.

```bash
cd backend
```

## Create a Virtual Environment

```bash
python -m venv .venv
```

---

## Activate the Virtual Environment

### Windows

```bash
.venv\Scripts\activate
```

### macOS / Linux

```bash
source .venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

# Configure Environment Variables

Create a `.env` file inside the `backend` directory.

Example:

```env
MONGODB_URI=<your-mongodb-uri>
DATABASE_NAME=nutrichef
OPENAI_API_KEY=<your-api-key>
```

Update the values according to your local environment.

---

# Frontend Setup

Navigate to the frontend directory.

```bash
cd frontend
```

Install project dependencies.

```bash
npm install
```

---

# Verify the Installation

## Start the Backend

```bash
cd backend

python -m uvicorn app.main:app --reload
```

The backend should be available at:

```
http://127.0.0.1:8000
```

Swagger UI:

```
http://127.0.0.1:8000/docs
```

---

## Start the Frontend

Open a second terminal.

```bash
cd frontend

npm run dev
```

The frontend should be available at:

```
http://localhost:5173
```

---

# Project Setup Complete

Once both servers are running successfully:

- Backend → http://127.0.0.1:8000
- Frontend → http://localhost:5173

You are now ready to begin development.

For day-to-day development commands, refer to **development.md**.