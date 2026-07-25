# NutriChef AI
NutriChef AI is an AI-powered smart kitchen assistant that helps users make the most of the ingredients they already have. The application generates personalized recipes based on pantry inventory, dietary preferences, health goals, and budget while promoting healthier eating habits and reducing food waste.
The project follows an AI-assisted Software Development Life Cycle (AI-SDLC), with Slingshot being used throughout the development process for planning, implementation, code review, testing, and documentation.

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
- React
- React Router
- Axios

## Backend
- Python 3.11
- FastAPI

## Database

- MongoDB

## ODM

- Beanie ODM

## Testing

- Pytest

## AI-Assisted Development

- Slingshot

---

# Project Structure

```text
NutriChefAI/
│
├── backend/
│   └── app/
│       ├── api/
│       ├── config/
│       ├── database/
│       ├── models/
│       ├── schemas/
│       ├── services/
│       └── utils/
│
├── frontend/
│
├── .slingshot/
│   ├── prompts/
│   ├── skills/
│   └── exports/
│
├── slingshot-guidelines.md
└── README.md
```

---

# Getting Started

## Prerequisites

- Python 3.11+
- Node.js 18+
- MongoDB 6.0+
- npm or yarn

## Installation

### Clone the repository

```bash
git clone <repository-url>
cd NutriChefAI
```

### Backend Setup

```bash
cd backend

python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
```

### Frontend Setup

```bash
cd frontend
npm install
```

### Environment Configuration

Create a `.env` file and configure the required environment variables.

### Run the Backend

```bash
uvicorn app.main:app --reload
```

### Run the Frontend

```bash
npm start
```

### Run Tests

```bash
pytest
```

---

# AI-Assisted Development with Slingshot

Slingshot was used throughout the project to accelerate development while maintaining consistent engineering standards.

## How Slingshot Was Used

- Feature planning and implementation
- API, schema, and database model generation
- Service layer implementation
- Documentation generation
- Code review and refactoring
- Unit testing assistance
- Development guidelines creation

## Prompt Library

Reusable prompts are maintained under:

```text
.slingshot/prompts/
```

These prompts provide standardized guidance for feature development, API design, testing, documentation, refactoring, and code reviews.

## Skills Library

Reusable AI skills are maintained under:

```text
.slingshot/skills/
```

The skills support common development activities including:

- FastAPI API development
- Beanie ODM model design
- Pydantic schema generation
- Service layer implementation
- Code review
- Unit testing
- Documentation

## Development Workflow

The project follows a repeatable AI-assisted workflow:

1. Define feature requirements.
2. Use Slingshot prompts for planning.
3. Generate implementation.
4. Review generated code.
5. Write or update tests.
6. Export development conversations.
7. Commit changes.

## Prompt Engineering Strategy

Each prompt provides:

- Project context
- Tech stack
- Target architecture layer
- Existing file references
- Coding standards
- Expected outputs
- Project-specific constraints

This improves the consistency and quality of AI-generated code.

## Benefits

- Faster feature implementation
- Consistent coding standards
- Improved documentation quality
- Reusable AI assets
- Better code review process
- Standardized development workflow

---

# Contributing

Contributions are welcome. Please ensure all new code follows the project guidelines defined in `slingshot-guidelines.md` and includes appropriate tests and documentation.


---

# Acknowledgments

- Built using **Slingshot AI** by **Publicis Sapient**
- Powered by **FastAPI**, **React**, **MongoDB**, and **Beanie ODM**
- Developed following an AI-assisted Software Development Life Cycle (AI-SDLC)