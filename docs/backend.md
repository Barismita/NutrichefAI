# Backend Architecture

This document describes the backend architecture of NutriChef AI.

The backend is built using **FastAPI**, **Beanie ODM**, and **MongoDB Atlas**, following a layered architecture that
separates API endpoints, business logic, data models, and database configuration.

---

# Technology Stack

| Component  | Technology    |
|------------|---------------|
| Language   | Python 3.11   |
| Framework  | FastAPI       |
| Database   | MongoDB Atlas |
| ODM        | Beanie        |
| Validation | Pydantic      |
| Testing    | Pytest        |

---

# Directory Structure

```text
backend/
├── app/
│
├── api/
├── config/
├── database/
├── models/
├── schemas/
├── services/
├── utils/
│
├── tests/
│
├── requirements.txt
└── main.py
```

---

# Layered Architecture

The backend follows a layered architecture.

```text
Client
   │
   ▼
API Layer
   │
   ▼
Service Layer
   │
   ▼
Database Models
   │
   ▼
MongoDB Atlas
```

Each layer has a single responsibility.

---

# API Layer

Location:

```text
app/api/
```

Responsibilities:

- Define REST endpoints
- Validate incoming requests
- Return HTTP responses
- Delegate business logic to services

The API layer should not contain business logic.

---

# Service Layer

Location:

```text
app/services/
```

Responsibilities:

- Business logic
- Database operations
- AI integrations
- Data transformation
- Validation beyond request schemas

The service layer acts as the core of the application.

---

# Models

Location:

```text
app/models/
```

Responsibilities:

- Define Beanie document models
- Represent MongoDB collections
- Configure indexes and document settings

Each model corresponds to a MongoDB collection.

---

# Schemas

Location:

```text
app/schemas/
```

Responsibilities:

- Request validation
- Response validation
- API documentation

Schemas use **Pydantic** and are separate from database models.

---

# Database

Location:

```text
app/database/
```

Responsibilities:

- MongoDB connection
- Beanie initialization
- Database configuration

The application uses MongoDB Atlas with Beanie ODM.

---

# Configuration

Location:

```text
app/config/
```

Responsibilities:

- Environment variables
- Application settings
- Configuration management

Configuration values are loaded from the project's `.env` file.

---

# Utilities

Location:

```text
app/utils/
```

Contains reusable helper functions that are shared across the application.

Utilities should remain generic and independent of business logic.

---

# Request Lifecycle

A typical backend request follows this flow.

```text
HTTP Request
      │
      ▼
FastAPI Route
      │
      ▼
Pydantic Validation
      │
      ▼
Service Layer
      │
      ▼
Beanie ODM
      │
      ▼
MongoDB Atlas
      │
      ▼
Response Schema
      │
      ▼
HTTP Response
```

---

# Error Handling

The backend uses FastAPI's exception handling mechanisms to provide consistent API responses.

Common categories include:

- Validation errors
- Resource not found
- Database errors
- Internal server errors

---

# Testing

Backend tests are written using **Pytest**.

Tests should verify:

- API endpoints
- Service layer logic
- Database interactions
- Validation rules

---

# Development Principles

The backend follows these principles:

- Keep routes lightweight.
- Place business logic in the service layer.
- Keep database access inside services.
- Validate all inputs using Pydantic.
- Write reusable utility functions.
- Maintain modular and testable code.
- Follow consistent coding standards.