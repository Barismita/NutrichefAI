# Documentation Generation Prompt

## Objective

Generate or update project documentation for NutriChef AI to ensure it remains accurate, comprehensive, and aligned with
the current implementation.

Documentation should be clear, maintainable, and suitable for both new contributors and existing developers.

---

## Project Context

NutriChef AI is an AI-powered smart kitchen assistant developed using an AI-assisted Software Development Life Cycle (
AI-SDLC).

Technology stack:

### Frontend

- React 19
- Vite
- React Router
- Material UI
- Axios

### Backend

- Python 3.11
- FastAPI
- MongoDB Atlas
- Beanie ODM
- Pydantic

---

## Documentation Scope

Review the implementation and determine which documentation requires creation or updates.

Documentation may include:

- README
- Installation Guide
- Development Guide
- Architecture Documentation
- Backend Documentation
- Frontend Documentation
- API Documentation
- Slingshot Documentation

---

## Documentation Standards

Documentation should:

- Be concise and easy to navigate.
- Use Markdown formatting.
- Include headings and code blocks where appropriate.
- Keep implementation details separate from high-level overviews.
- Remain consistent with the existing documentation style.

---

## README Updates

When necessary, update the project README to reflect:

- New features
- Technology stack
- Project structure
- Quick start instructions
- Documentation links

Avoid placing detailed implementation instructions in the README.

---

## Technical Documentation

When architecture changes, update the relevant technical documentation.

Include:

- Folder structure
- Data flow
- Component relationships
- Service interactions
- Architectural decisions

---

## API Documentation

When API endpoints change:

- Document new endpoints.
- Update request and response models.
- Describe expected behaviour.
- Include relevant HTTP status codes.

Leverage FastAPI's generated OpenAPI documentation whenever possible.

---

## Code Examples

Include code examples only when they improve understanding.

Ensure examples are:

- Correct
- Minimal
- Consistent with the codebase

---

## Documentation Quality

Verify that documentation is:

- Technically accurate
- Up to date
- Consistent across all documents
- Free from duplication
- Easy for new developers to follow

---

## Expected Output

Provide:

1. Documentation files to create or update.
2. Complete Markdown content.
3. Updated project structure (if applicable).
4. Cross-references between related documents.
5. Summary of documentation changes.