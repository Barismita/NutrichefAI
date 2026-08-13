# NutriChef AI

NutriChef AI is an AI-powered smart kitchen assistant that helps users make the most of the ingredients they already
have. The application generates personalized recipes based on pantry inventory, dietary preferences, health goals, and
budget while promoting healthier eating habits and reducing food waste.

The project follows an AI-assisted Software Development Life Cycle (AI-SDLC), with Slingshot being used throughout the
development process for planning, implementation, code review, testing, and documentation.

---

# Features

- Smart recipe generation from available ingredients
- Pantry tracking and ingredient management
- Ingredient substitution recommendations
- Leftover food rescue ideas
- Nutrition insights and healthy alternatives
- Step-by-step cooking assistance

---

# Tech Stack

## Frontend

- React 19
- Vite
- React Router
- Material UI (MUI)
- Axios

## Backend

- Python 3.11
- FastAPI

## Database

- MongoDB Atlas

## ODM

- Beanie ODM

## Testing & Code Quality

### Backend

- Pytest
- Black
- isort

### Frontend

- ESLint
- Prettier
- Husky
- lint-staged

## AI-Assisted Development

- Slingshot

---

# Project Structure

```text
NutriChefAI/
│
├── backend/
│
├── frontend/
│
├── docs/
│   ├── installation.md
│   ├── development.md
│   ├── architecture.md
│   ├── backend.md
│   ├── frontend.md
│   ├── api.md
│   └── slingshot.md
│
├── .slingshot/
│
├── slingshot-guidelines.md
└── README.md
```

---

# Quick Start

## Prerequisites

- Python 3.11+
- Node.js 18+
- MongoDB Atlas

### Backend

```bash
cd backend

python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt

python -m uvicorn app.main:app --reload
```

Backend:

- http://127.0.0.1:8000
- Swagger: http://127.0.0.1:8000/docs

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend:

- http://localhost:5173

For detailed installation instructions, see **docs/installation.md**.

---

# Documentation

| Guide           | Description                                            |
|-----------------|--------------------------------------------------------|
| installation.md | Project installation and initial setup                 |
| development.md  | Development workflow, testing, formatting, and linting |
| architecture.md | Overall system architecture                            |
| backend.md      | Backend architecture and implementation details        |
| frontend.md     | Frontend architecture, routing, and UI structure       |
| api.md          | API documentation                                      |
| slingshot.md    | AI-assisted development workflow using Slingshot       |

---

# AI-Assisted Development

NutriChef AI follows an AI-assisted SDLC using Slingshot throughout the project lifecycle.

Slingshot is used for:

- Feature planning
- API design
- Database model generation
- Service implementation
- Code reviews
- Refactoring
- Unit testing
- Documentation

Additional documentation is available in **docs/slingshot.md**.

---

# Contributing

Contributions are welcome.

Please ensure that all new code:

- follows the project architecture
- includes appropriate tests
- adheres to the established coding standards
- updates documentation where necessary

---

# Acknowledgments

- Built using **Slingshot AI**
- Powered by **FastAPI**, **React**, **MongoDB Atlas**, and **Beanie ODM**
- Developed following an AI-assisted Software Development Life Cycle (AI-SDLC)
