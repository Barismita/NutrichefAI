# Frontend Architecture Planning Prompt

## Objective

Design a scalable frontend architecture for NutriChef AI before implementation begins.

The architecture should prioritize maintainability, modularity, and long-term scalability while following React best
practices.

---

## Project Context

NutriChef AI is an AI-powered smart kitchen assistant.

The frontend is built using:

- React 19
- Vite
- React Router
- Material UI (MUI)
- Axios

The application follows a component-driven architecture with reusable UI components and centralized routing.

---

## Architecture Goals

Design the frontend to:

- Scale as new features are added.
- Promote component reusability.
- Separate presentation from business logic.
- Minimize code duplication.
- Maintain a consistent user experience.

---

## Folder Structure

Organize the application using the following structure.

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

## Routing Strategy

Plan application routes before implementation.

Each major feature should have its own page.

Current pages include:

- Home
- Dashboard
- Pantry
- Recipes
- Nutrition
- Cooking Guide
- Leftover
- Expiry
- AI Assistant
- Profiles

Routes should remain centralized within the routing module.

---

## Component Strategy

Identify opportunities to create reusable components.

Prefer reusable components over page-specific implementations.

Suggested categories:

- Layout components
- Cards
- Forms
- Navigation
- Buttons
- Dialogs
- Loading indicators

---

## Theme

Use a centralized Material UI theme.

The theme should define:

- Color palette
- Typography
- Border radius
- Component defaults
- Global styling

Avoid hardcoded styling whenever possible.

---

## API Integration

Keep API communication isolated.

Components should never directly construct HTTP requests.

All requests should pass through the API layer.

---

## State Management

Determine the appropriate state scope.

Use:

- Local component state for isolated behaviour.
- Context for shared application state.
- Props only for direct parent-child communication.

Avoid unnecessary prop drilling.

---

## Code Quality

Ensure the proposed architecture supports:

- ESLint
- Prettier
- Husky
- lint-staged

Maintain consistency with the existing project standards.

---

## Expected Output

Provide:

1. Recommended folder structure.
2. Page hierarchy.
3. Component hierarchy.
4. Routing strategy.
5. Theme strategy.
6. API communication strategy.
7. State management recommendations.
8. Architectural rationale.