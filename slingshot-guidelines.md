# NutriChef AI - Slingshot Development Guidelines

## 1. Project Overview & Architecture

**NutriChef AI** is an AI-powered nutrition and recipe management platform built with modern technologies:

- **Backend**: Python 3.11, FastAPI, Beanie ODM, MongoDB, PyMongo Async, Pydantic v2
- **Frontend**: React
- **Architecture**: Clean Architecture with clear layer separation

**Layer Structure**:
- **API Layer** (`backend/app/api`): HTTP endpoints and request handling
- **Service Layer** (`backend/app/services`): Business logic and orchestration
- **Data Layer** (`backend/app/models`): Database models and schemas
- **Database Layer** (`backend/app/database`): Connection management and configuration

---

## 2. Development Principles

- **SOLID Principles**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **DRY (Don't Repeat Yourself)**: Avoid code duplication; extract reusable functions and classes
- **KISS (Keep It Simple, Stupid)**: Favor simplicity over complexity
- **Separation of Concerns**: Each module should have a single, well-defined responsibility
- **Fail Fast**: Validate inputs early and raise exceptions immediately when errors occur

---

## 3. Slingshot Development Workflow

All development in this project should follow the AI-SDLC workflow.

For every feature:

1. Create or update a reusable `.prompt.md` file.
2. Use Plan & Execute mode for feature planning whenever applicable.
3. Use Smart Chat for implementation and code generation.
4. Use @Workspace to search the existing codebase before generating new code.
5. Review generated code before accepting changes.
6. Export the Slingshot conversation for future reference.
7. Commit changes in small logical commits.

Generated code should never replace working project infrastructure unless explicitly requested.
## 4. Folder Structure

### Backend Structure
```
backend/
├── app/
│   ├── api/              # FastAPI route handlers
│   ├── models/           # Beanie ODM models
│   ├── schemas/          # Pydantic request/response schemas
│   ├── services/         # Business logic layer
│   ├── database/         # MongoDB connection and config
│   ├── config/           # Application settings
│   ├── utils/            # Helper functions
│   └── tests/            # Test files
├── main.py               # Application entry point
└── requirements.txt      # Python dependencies
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/       # Reusable React components
│   ├── pages/            # Page-level components
│   ├── services/         # API client services
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   └── styles/           # CSS/styling files
└── package.json          # Node dependencies
```

---

## 4. Python Coding Standards

- **PEP 8 Compliance**: Follow Python's official style guide
- **Type Hints**: Always use type hints for function parameters and return values
- **Docstrings**: Use Google-style docstrings for all public functions and classes
- **Line Length**: Maximum 100 characters per line
- **Formatting**: Use `black` for automatic code formatting

```python
from typing import Optional, List
from pydantic import BaseModel

async def get_recipe_by_id(recipe_id: str) -> Optional[Recipe]:
    """Retrieve a recipe by its ID.
    
    Args:
        recipe_id: The unique identifier of the recipe
        
    Returns:
        Recipe object if found, None otherwise
    """
    return await Recipe.get(recipe_id)
```

---

## 5. Import Ordering

Organize imports in three groups, alphabetically sorted within each:

```python
# Standard library imports
import os
from datetime import datetime
from typing import List, Optional

# Third-party imports
from beanie import Document
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

# Local application imports
from app.models.recipe import Recipe
from app.schemas.recipe import RecipeCreate, RecipeResponse
from app.services.recipe_service import RecipeService
```

---

## 6. Naming Conventions

- **Functions/Variables/Modules**: `snake_case`
  - Examples: `get_user_recipes`, `recipe_service`, `user_id`
- **Classes**: `PascalCase`
  - Examples: `Recipe`, `RecipeService`, `UserProfile`
- **Constants**: `UPPER_CASE`
  - Examples: `MAX_RECIPES_PER_PAGE`, `DEFAULT_TIMEOUT`
- **Private Members**: Prefix with single underscore `_private_method`
- **Descriptive Names**: Use meaningful, self-documenting names

---

## 7. FastAPI API Design

### RESTful Endpoint Design
- Use plural nouns for resources: `/api/v1/recipes`, `/api/v1/users`
- HTTP methods:
  - `GET`: Retrieve resources
  - `POST`: Create new resources
  - `PUT`: Full update of resources
  - `PATCH`: Partial update of resources
  - `DELETE`: Remove resources

### URL Structure
```python
router = APIRouter(prefix="/api/v1/recipes", tags=["recipes"])

@router.get("/", response_model=List[RecipeResponse])
@router.get("/{recipe_id}", response_model=RecipeResponse)
@router.post("/", status_code=status.HTTP_201_CREATED)
@router.put("/{recipe_id}", response_model=RecipeResponse)
@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
```

### Response Status Codes
- `200 OK`: Successful GET, PUT, PATCH
- `201 Created`: Successful POST
- `204 No Content`: Successful DELETE
- `400 Bad Request`: Invalid input
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server errors

---

## 8. Request/Response Schema Standards

### Pydantic v2 Models
- Use separate schemas for Create, Update, and Response operations
- Naming convention: `{Resource}{Operation}` (e.g., `RecipeCreate`, `RecipeResponse`)

```python
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List

class RecipeCreate(BaseModel):
    """Schema for creating a new recipe."""
    title: str = Field(..., min_length=1, max_length=200)
    ingredients: List[str] = Field(..., min_items=1)
    instructions: str = Field(..., min_length=10)
    prep_time: int = Field(..., gt=0)
    
class RecipeResponse(BaseModel):
    """Schema for recipe responses."""
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    title: str
    ingredients: List[str]
    instructions: str
    prep_time: int
    created_at: datetime
```

---

## 9. Beanie ODM Best Practices

### Document Model Definitions
```python
from beanie import Document, Indexed
from pydantic import Field
from typing import Optional, List
from datetime import datetime

class Recipe(Document):
    title: Indexed(str)  # Create index for faster queries
    ingredients: List[str]
    instructions: str
    prep_time: int
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "recipes"  # Collection name
        indexes = [
            "title",
            [("created_at", -1)],  # Descending index
        ]
```

### Query Optimization
- Use indexes for frequently queried fields
- Use projection to fetch only required fields: `Recipe.find().project(RecipeResponse)`
- Leverage aggregation pipelines for complex queries

---

## 10. MongoDB Guidelines

### Collection Naming
- Use lowercase plural nouns: `recipes`, `users`, `meal_plans`
- Avoid special characters except underscores

### Index Strategies
- Index fields used in queries, sorts, and filters
- Use compound indexes for multi-field queries
- Monitor index usage with `explain()`

### Connection Management
```python
# backend/app/database/mongodb.py
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

async def init_db():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    await init_beanie(
        database=client[settings.DATABASE_NAME],
        document_models=[Recipe, User, MealPlan]
    )
```

---

## 11. Service Layer Responsibilities

### Business Logic Encapsulation
- All business logic resides in service classes
- Services orchestrate database operations and external API calls
- API handlers should be thin, delegating to services

```python
# backend/app/services/recipe_service.py
from typing import List, Optional
from app.models.recipe import Recipe
from app.schemas.recipe import RecipeCreate

class RecipeService:
    @staticmethod
    async def create_recipe(recipe_data: RecipeCreate) -> Recipe:
        """Create a new recipe with validation."""
        recipe = Recipe(**recipe_data.model_dump())
        await recipe.insert()
        return recipe
    
    @staticmethod
    async def get_user_recipes(user_id: str) -> List[Recipe]:
        """Retrieve all recipes for a user."""
        return await Recipe.find(Recipe.user_id == user_id).to_list()
```

---

## 12. Validation Rules

### Input Validation with Pydantic
- Use Field validators for custom validation logic
- Provide clear error messages

```python
from pydantic import BaseModel, Field, field_validator

class RecipeCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    prep_time: int = Field(..., gt=0, le=1440)
    
    @field_validator('title')
    @classmethod
    def title_must_not_be_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('Title cannot be empty or whitespace')
        return v.strip()
```

---

## 13. Error Handling

### Custom Exception Classes
```python
from fastapi import HTTPException, status

class RecipeNotFoundException(HTTPException):
    def __init__(self, recipe_id: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recipe with id {recipe_id} not found"
        )
```

### Error Response Format
```python
@router.get("/{recipe_id}")
async def get_recipe(recipe_id: str):
    recipe = await RecipeService.get_recipe_by_id(recipe_id)
    if not recipe:
        raise RecipeNotFoundException(recipe_id)
    return recipe
```

---

## 14. Async Programming

### Async/Await Patterns
- Use `async def` for all I/O-bound operations
- Always `await` async functions
- Use PyMongo Async for database operations

```python
async def get_recipes_with_ingredients(ingredient: str) -> List[Recipe]:
    """Find recipes containing a specific ingredient."""
    recipes = await Recipe.find(
        {"ingredients": {"$in": [ingredient]}}
    ).to_list()
    return recipes
```

### Avoid Blocking Calls
- Never use synchronous I/O in async functions
- Use `asyncio.gather()` for concurrent operations

---

## 15. Security Best Practices

### Authentication & Authorization
- Implement JWT-based authentication
- Validate tokens on protected endpoints
- Use role-based access control (RBAC)

### Input Sanitization
- Validate all user inputs with Pydantic
- Escape special characters in database queries
- Prevent NoSQL injection by using Beanie's query builders

### Environment Variables
```python
# backend/app/config/settings.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGODB_URL: str
    SECRET_KEY: str
    DATABASE_NAME: str
    
    class Config:
        env_file = ".env"

settings = Settings()
```

---

## 16. Logging Standards

### Logging Levels
- `DEBUG`: Detailed diagnostic information
- `INFO`: General informational messages
- `WARNING`: Warning messages for potentially harmful situations
- `ERROR`: Error events that might still allow the application to continue
- `CRITICAL`: Severe errors causing application failure

```python
import logging

logger = logging.getLogger(__name__)

async def create_recipe(recipe_data: RecipeCreate):
    logger.info(f"Creating recipe: {recipe_data.title}")
    try:
        recipe = await RecipeService.create_recipe(recipe_data)
        logger.info(f"Recipe created successfully: {recipe.id}")
        return recipe
    except Exception as e:
        logger.error(f"Failed to create recipe: {str(e)}", exc_info=True)
        raise
```

---

## 17. Testing with Pytest

### Test Organization
```
backend/app/tests/
├── unit/
│   ├── test_recipe_service.py
│   └── test_user_service.py
├── integration/
│   ├── test_recipe_api.py
│   └── test_auth_api.py
└── conftest.py  # Shared fixtures
```

### Unit Test Example
```python
import pytest
from app.services.recipe_service import RecipeService
from app.schemas.recipe import RecipeCreate

@pytest.mark.asyncio
async def test_create_recipe():
    recipe_data = RecipeCreate(
        title="Test Recipe",
        ingredients=["ingredient1", "ingredient2"],
        instructions="Test instructions",
        prep_time=30
    )
    recipe = await RecipeService.create_recipe(recipe_data)
    assert recipe.title == "Test Recipe"
    assert len(recipe.ingredients) == 2
```

### Coverage Requirements
- Minimum 80% code coverage
- 100% coverage for critical business logic

---

## 18. Documentation Standards

### API Documentation
- FastAPI auto-generates OpenAPI docs at `/docs` and `/redoc`
- Add descriptions to endpoints using docstrings

```python
@router.post("/", response_model=RecipeResponse, status_code=status.HTTP_201_CREATED)
async def create_recipe(recipe: RecipeCreate):
    """Create a new recipe.
    
    Args:
        recipe: Recipe creation data including title, ingredients, and instructions
        
    Returns:
        The created recipe with generated ID and timestamp
    """
    return await RecipeService.create_recipe(recipe)
```

### Code Comments
- Comment complex logic and business rules
- Avoid obvious comments
- Keep comments up-to-date with code changes

---

## 19. Git Commit Conventions

### Conventional Commits Format
```
type(scope): description

[optional body]

[optional footer]
```

### Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without changing functionality
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```
feat(recipe): add endpoint to search recipes by ingredients
fix(auth): resolve token expiration issue
docs(readme): update installation instructions
test(recipe): add unit tests for recipe service
```

---

## 20. AI-Assisted Development with Slingshot

### Effective Slingshot Usage
- **Provide Context**: Always include relevant file paths and existing code
- **Specify Tech Stack**: Mention Python 3.11, FastAPI, Beanie ODM, Pydantic v2
- **Reference Architecture**: Point to Clean Architecture layers (API, Service, Model)
- **Request Complete Solutions**: Ask for code with imports, type hints, and tests

### Example Prompts
```
"Create a FastAPI endpoint in backend/app/api/recipe.py to update a recipe, 
using RecipeUpdate schema from backend/app/schemas/recipe.py and RecipeService 
from backend/app/services/recipe_service.py. Include proper error handling and 
type hints."
```

---

## 21. Workspace Search Guidelines

Before generating new code:

- Search for similar implementations using @Workspace.
- Reuse existing models, services and schemas whenever possible.
- Avoid creating duplicate business logic.
- Respect existing folder structure.
- Prefer extending existing modules over creating new ones.

## 22. Prompt Engineering Best Practices

### Clear Context Provision
- Specify the exact file path and layer (API, Service, Model)
- Mention related files and dependencies
- Include existing code snippets for reference

### Technology Stack Requirements
- Always mention: Python 3.11, FastAPI, Beanie ODM, MongoDB, Pydantic v2
- Specify async/await requirements
- Request proper import statements

### Plan & Execute Usage

Plan & Execute mode should be preferred for:

- Large features
- Multi-file implementations
- Refactoring
- Architectural changes

Smart Chat should be preferred for:

- Bug fixes
- Small enhancements
- Documentation
- Code review

### Prompt Library

Every reusable prompt must:

- Have valid front matter
- Be stored inside `.slingshot/prompts`
- Be updated after major refinements
- Be reusable across multiple features

Prompt files are part of the project documentation.

### Agent Skills

Whenever suitable:

- Prefer installed Agent Skills over rewriting prompts.
- Reuse project skills.
- Keep skills generic enough to work across multiple backend modules.

### Agent Hooks

Recommended hooks:

- Review newly created services.
- Suggest unit tests after creating APIs.
- Validate code against project guidelines before commit.

Hooks should automate repetitive engineering tasks without modifying unrelated files.

### Comprehensive Requests
```
"Generate a Beanie ODM model for MealPlan in backend/app/models/meal_plan.py 
with fields: user_id (str), recipes (List[Recipe]), start_date (datetime), 
end_date (datetime). Include indexes on user_id and start_date. Also create 
corresponding Pydantic schemas in backend/app/schemas/meal_plan.py for 
MealPlanCreate and MealPlanResponse."
```

---

## 22. Code Review Checklist

### Code Quality
- [ ] Follows PEP 8 and project coding standards
- [ ] Uses type hints for all functions
- [ ] Includes docstrings for public functions and classes
- [ ] No code duplication (DRY principle)
- [ ] Proper error handling with custom exceptions

### Security
- [ ] Input validation with Pydantic schemas
- [ ] No hardcoded secrets or credentials
- [ ] Proper authentication and authorization checks
- [ ] NoSQL injection prevention

### Performance
- [ ] Database queries are optimized with indexes
- [ ] Async/await used for I/O operations
- [ ] No blocking calls in async functions
- [ ] Efficient data structures and algorithms

### Testing
- [ ] Unit tests written and passing
- [ ] Integration tests for API endpoints
- [ ] Test coverage meets minimum requirements (80%)
- [ ] Edge cases covered

### Documentation
- [ ] API endpoints documented
- [ ] Complex logic explained with comments
- [ ] README updated if necessary
- [ ] Commit messages follow conventional format

---

## 23. Definition of Done

A task is considered complete when:

- [ ] **Code Complete**: All code written and follows project standards
- [ ] **Code Reviewed**: At least one peer review completed and approved
- [ ] **Tests Written**: Unit and integration tests implemented
- [ ] **Tests Passing**: All tests pass locally and in CI/CD pipeline
- [ ] **Documentation Updated**: API docs, code comments, and README updated
- [ ] **No Linting Errors**: Code passes `black`, `flake8`, and `mypy` checks
- [ ] **Security Scan Passed**: No security vulnerabilities detected
- [ ] **Deployed to Staging**: Changes deployed and verified in staging environment (if applicable)
- [ ] **Acceptance Criteria Met**: All user story acceptance criteria satisfied
- [ ] **No Regressions**: Existing functionality remains intact

---

**Document Version**: 1.0  
**Last Updated**: 2026-07-24  
**Maintained By**: NutriChef AI Development Team