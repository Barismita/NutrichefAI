# Database Model Development Prompt

## Objective

Design and implement a MongoDB data model for NutriChef AI using Beanie ODM.

The implementation should align with the existing project architecture, support future scalability, and follow MongoDB
best practices.

---

## Project Context

NutriChef AI uses MongoDB Atlas as its primary database and Beanie ODM for document modelling.

Technology stack:

- Python 3.11
- FastAPI
- MongoDB Atlas
- Beanie ODM
- Pydantic

---

## Existing Project Structure

```text
app/
├── database/
├── models/
├── schemas/
├── services/
└── api/
```

---

## Model Requirements

For every new collection:

- Create a Beanie `Document`.
- Define all required fields.
- Use meaningful field names.
- Specify optional and required attributes.
- Configure indexes where appropriate.
- Follow existing naming conventions.

---

## Schema Requirements

Generate matching Pydantic models for:

- Create requests
- Update requests
- Response models

Request and response schemas should remain independent of database models.

---

## Database Design Principles

Design collections that are:

- Easy to query
- Easy to maintain
- Optimized for expected access patterns
- Consistent with existing collections

Avoid unnecessary duplication of data.

---

## Relationships

When modelling relationships:

- Embed documents only when appropriate.
- Reference other collections when relationships are expected to grow.
- Consider future scalability before choosing a modelling approach.

Explain the rationale behind the chosen design.

---

## Validation

Ensure:

- Required fields are validated.
- Optional fields have sensible defaults.
- Enumerated values use appropriate constraints.
- Data types accurately represent the domain.

---

## Service Integration

Update the corresponding service layer to support:

- Create operations
- Read operations
- Update operations
- Delete operations

Maintain asynchronous database interactions throughout.

---

## Testing

Generate tests covering:

- Model validation
- CRUD operations
- Invalid input
- Edge cases

---

## Documentation

If the new model introduces architectural or API changes, identify any documentation that should be updated.

---

## Expected Output

Provide:

1. Beanie document model.
2. Pydantic schemas.
3. Required indexes.
4. CRUD service implementation.
5. Testing recommendations.
6. Database design rationale.