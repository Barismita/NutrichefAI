# Frontend Architecture

This document describes the frontend architecture of NutriChef AI.

The frontend is built using **React**, **Vite**, and **Material UI**, following a component-based architecture focused
on reusability, maintainability, and scalability.

---

# Technology Stack

| Component   | Technology          |
|-------------|---------------------|
| Framework   | React 19            |
| Build Tool  | Vite                |
| Routing     | React Router        |
| UI Library  | Material UI (MUI)   |
| HTTP Client | Axios               |
| Linting     | ESLint              |
| Formatting  | Prettier            |
| Git Hooks   | Husky & lint-staged |

---

# Directory Structure

```text
frontend/
├── public/
├── src/
│
├── api/
├── assets/
├── components/
│   ├── cards/
│   ├── common/
│   └── layout/
│
├── contexts/
├── hooks/
├── pages/
│
├── routes/
├── styles/
├── utils/
│
├── App.jsx
├── main.jsx
└── theme.js
│
├── package.json
└── vite.config.js
```

---

# Application Architecture

The frontend follows a layered architecture.

```text
React Pages
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

Each layer has a clearly defined responsibility.

---

# Pages

Location:

```text
src/pages/
```

Each page represents a route within the application.

Examples include:

- Home
- Dashboard
- Pantry
- Recipes
- Nutrition
- Cooking Guide
- Leftover
- Expiry
- AI Assistant
- Profile

Pages are responsible for:

- Layout composition
- Fetching data
- Managing page-level state
- Rendering reusable components

Business logic should be delegated to utility functions or API services where appropriate.

---

# Components

Location:

```text
src/components/
```

Components are designed to be reusable throughout the application.

Current organization:

```text
components/
├── cards/
├── common/
└── layout/
```

### Cards

Reusable information cards.

Examples:

- Recipe cards
- Pantry cards
- Nutrition cards

### Common

Shared UI components.

Examples:

- Buttons
- Inputs
- Dialogs
- Loading indicators

### Layout

Application layout components.

Examples:

- Navigation
- Sidebar
- Header
- Footer

---

# API Layer

Location:

```text
src/api/
```

Responsibilities include:

- HTTP requests
- API configuration
- Response handling
- Error handling

The API layer centralizes communication with the FastAPI backend.

---

# Routing

Location:

```text
src/routes/
```

React Router is used for client-side navigation.

Current routes include:

- /
- /dashboard
- /pantry
- /recipes
- /nutrition
- /cooking-guide
- /leftover
- /expiry
- /assistant
- /profile

---

# Contexts

Location:

```text
src/contexts/
```

React Context is used for application-wide state when appropriate.

Typical use cases include:

- Theme
- User preferences
- Shared application state

---

# Hooks

Location:

```text
src/hooks/
```

Custom hooks encapsulate reusable React logic.

Examples:

- API hooks
- Form hooks
- Utility hooks

---

# Utilities

Location:

```text
src/utils/
```

Contains reusable helper functions used across the application.

Examples include:

- Data formatting
- Validation
- Constants
- Helper methods

---

# Styling

The application uses **Material UI** together with a centralized theme.

Theme configuration is located in:

```text
src/theme.js
```

The global theme defines:

- Color palette
- Typography
- Component defaults
- Border radius
- Spacing

Global styles are located under:

```text
src/styles/
```

---

# Request Flow

A typical frontend request follows this flow.

```text
User
   │
   ▼
Page
   │
   ▼
Reusable Component
   │
   ▼
API Layer
   │
   ▼
FastAPI Backend
   │
   ▼
Response
   │
   ▼
UI Update
```

---

# Code Quality

The frontend uses the following tools to maintain code quality.

- ESLint
- Prettier
- Husky
- lint-staged

These tools help ensure consistent formatting and coding standards across the project.

---

# Development Principles

The frontend follows these principles.

- Build reusable components.
- Keep pages focused on layout and orchestration.
- Avoid duplicate UI logic.
- Centralize API communication.
- Follow the established theme.
- Maintain consistent code formatting.
- Keep components modular and easy to test.