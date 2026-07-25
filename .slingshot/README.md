# Slingshot Configuration

This directory contains the AI assets used to assist development of the NutriChef AI project.

## Structure

```text
.slingshot/
├── prompts/
├── skills/
├── README.md
├── memory.json
├── agentHooks.json
├── prompts-cache.json
└── skills-cache.json
```

## Prompts

Prompts define feature-specific tasks and provide context for implementing functionality.

Examples include:

- Backend feature development
- Frontend component creation
- API design
- Database modelling
- Unit testing
- Bug fixing
- Feature-specific AI capabilities (Cooking Guide, Ingredient Substitution, etc.)

Prompts should focus on **what** needs to be built.

---

## Skills

Skills define reusable engineering knowledge that can be applied across multiple prompts.

Current skills include:

- AI Provider
- Backend Development
- Frontend Development
- Database
- API Design
- Testing
- Debugging
- Code Review
- Documentation

Skills describe **how** implementation should be performed.

---

## Development Workflow

A typical feature implementation follows this process:

1. Review the relevant feature prompt.
2. Load the required engineering skills.
3. Design the API and data model.
4. Implement backend functionality.
5. Implement frontend functionality (if applicable).
6. Test the implementation.
7. Review the code.
8. Update documentation.

---

## Design Principles

- Keep prompts focused on features.
- Keep skills generic and reusable.
- Follow the project's layered architecture.
- Prefer modular and maintainable code.
- Update documentation whenever behaviour changes.

---

## Project Architecture

NutriChef AI uses:

### Backend

- FastAPI
- Python 3.11
- MongoDB Atlas
- Beanie ODM
- Pydantic

### Frontend

- React 19
- Vite
- Material UI
- React Router
- Axios

---

## Objective

The goal of this configuration is to support an AI-assisted Software Development Life Cycle (AI-SDLC) by providing
consistent prompts, reusable engineering skills, and shared project context.