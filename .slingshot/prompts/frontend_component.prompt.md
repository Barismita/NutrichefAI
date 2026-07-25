# Frontend Component Development Prompt

## Objective

Develop reusable React components for NutriChef AI that follow the existing project architecture, design system, and
coding standards.

---

## Project Context

NutriChef AI is an AI-powered smart kitchen assistant built using a modern React frontend.

Technology stack:

- React 19
- Vite
- React Router
- Material UI (MUI)
- Axios

The application follows a component-based architecture with reusable UI elements and centralized routing.

---

## Existing Project Structure

```text
src/
├── api/
├── assets/
├── components/
│   ├── cards/
│   ├── common/
│   └── layout/
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

## Component Requirements

When implementing a new feature:

- Identify whether it should be a page or reusable component.
- Reuse existing components whenever possible.
- Keep components focused on a single responsibility.
- Follow the existing folder structure.
- Use functional React components.
- Use modern React hooks where appropriate.

---

## UI Guidelines

Use Material UI components whenever possible.

Follow the project's design language:

- Clean layouts
- Consistent spacing
- Responsive design
- Accessible components
- Minimal visual clutter

Do not introduce custom styling unless necessary.

---

## State Management

- Keep local state within components when appropriate.
- Lift state only when shared across multiple components.
- Use Context only for application-wide state.
- Avoid unnecessary prop drilling.

---

## API Integration

API communication should be isolated within the `api/` directory.

Components should:

- Call service functions instead of embedding request logic.
- Handle loading states.
- Handle API errors gracefully.
- Display meaningful feedback to users.

---

## Routing

If new pages are created:

- Register them using React Router.
- Keep route definitions centralized.
- Follow existing route naming conventions.

---

## Code Quality

Generate code that is compatible with:

- ESLint
- Prettier
- Husky
- lint-staged

Avoid unused imports and unnecessary complexity.

---

## Documentation

If new components introduce architectural changes, update the relevant documentation.

---

## Expected Output

Provide:

1. Components to create or modify.
2. Complete implementation.
3. Routing updates (if required).
4. Styling considerations.
5. Testing recommendations.
6. Documentation updates (if required).