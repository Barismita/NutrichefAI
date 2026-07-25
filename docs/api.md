# API Documentation

This document provides an overview of the NutriChef AI REST API.

The backend is built using **FastAPI**, which automatically generates interactive API documentation.

---

# Interactive Documentation

After starting the backend server, the API documentation is available at:

## Swagger UI

```
http://127.0.0.1:8000/docs
```

Swagger UI provides:

- Endpoint documentation
- Request schemas
- Response schemas
- Interactive testing
- HTTP status codes

---

## OpenAPI Specification

```
http://127.0.0.1:8000/openapi.json
```

The OpenAPI specification can be imported into tools such as:

- Postman
- Insomnia
- Swagger Editor

---

# API Organization

The API is organized into feature-based modules.

Future endpoints will include functionality for:

- User Profiles
- Pantry Management
- Recipe Generation
- Nutrition Analysis
- Ingredient Substitutions
- Leftover Recommendations
- Cooking Assistance
- Expiry Tracking

---

# Response Format

Unless otherwise specified, endpoints return JSON responses.

Example:

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully."
}
```

---

# Error Responses

Validation and server errors follow FastAPI's standard response format.

Example:

```json
{
  "detail": "Validation error"
}
```

---

# Authentication

Authentication is not currently implemented.

Future versions may support authenticated user sessions.

---

# Versioning

The API is currently under active development.

Future releases may introduce versioned endpoints as the application evolves.