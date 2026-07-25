# Architecture

This document provides a high-level overview of the NutriChef AI architecture, including the frontend, backend,
database, and AI-assisted development workflow.

---

# System Architecture

```text
                     +----------------------+
                     |      React App       |
                     |  (Material UI, Vite) |
                     +----------+-----------+
                                |
                           HTTP/REST API
                                |
                     +----------v-----------+
                     |      FastAPI         |
                     |     API Layer        |
                     +----------+-----------+
                                |
                     +----------v-----------+
                     |    Service Layer     |
                     | Business Logic       |
                     +----------+-----------+
                                |
              +-----------------+-----------------+
              |                                   |
     +--------v--------+               +----------v---------+
     |   MongoDB       |               | External AI Models |
     |  (Beanie ODM)   |               | (Recipe Generation)|
     +-----------------+               +--------------------+
```

---

# Technology Stack

| Layer          | Technology               |
|----------------|--------------------------|
| Frontend       | React, Vite, Material UI |
| Backend        | FastAPI                  |
| Database       | MongoDB Atlas            |
| ODM            | Beanie                   |
| Validation     | Pydantic                 |
| HTTP Client    | Axios                    |
| AI Development | Slingshot                |

---

# Backend Architecture

The backend follows a layered architecture.

```text
Client
   │
   ▼
API Routes
   │
   ▼
Service Layer
   │
   ▼
Database Models
   │
   ▼
MongoDB
```

Each layer has a single responsibility.

| Layer    | Responsibility                       |
|----------|--------------------------------------|
| API      | Handle HTTP requests and responses   |
| Services | Business logic                       |
| Models   | Database representation              |
| Schemas  | Request and response validation      |
| Database | MongoDB connection and configuration |
| Utils    | Shared helper functions              |

---

# Frontend Architecture

The frontend follows a component-based architecture.

```text
Pages
   │
   ▼
Reusable Components
   │
   ▼
API Layer
   │
   ▼
FastAPI Backend
```

Primary directories:

```text
src/
├── api/
├── assets/
├── components/
├── contexts/
├── hooks/
├── pages/
├── routes/
├── styles/
├── utils/
├── App.jsx
├── main.jsx
└── theme.js
```

---

# Data Flow

A typical request flows through the application as follows.

```text
User
   │
   ▼
React Page
   │
   ▼
Axios Request
   │
   ▼
FastAPI Route
   │
   ▼
Service Layer
   │
   ▼
MongoDB
   │
   ▼
JSON Response
   │
   ▼
React UI
```

---

# Project Structure

```text
NutriChefAI/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── config/
│   │   ├── database/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── docs/
│
├── .slingshot/
│
└── README.md
```

---

# Design Principles

The project follows the following architectural principles.

- Separation of concerns
- Layered architecture
- Reusable UI components
- Service-oriented backend
- Modular folder structure
- Strong request and response validation
- Consistent coding standards
- AI-assisted software development

---

# AI-Assisted Development

NutriChef AI follows an AI-assisted Software Development Life Cycle (AI-SDLC).

Slingshot is used throughout the project to assist with:

- Feature planning
- Code generation
- Refactoring
- Testing
- Documentation
- Code reviews

Further details are available in `slingshot.md`.