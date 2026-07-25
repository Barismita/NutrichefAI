## Objective

Create comprehensive, clear, and maintainable documentation for APIs, code, architecture decisions, and project setup.

## Context

**Documentation Types:**
- API documentation (FastAPI auto-generated)
- Code comments and docstrings
- README files
- Architecture Decision Records (ADRs)
- Setup and deployment guides

**Audience:**
- Developers (current and future team members)
- API consumers
- DevOps engineers
- Stakeholders

## Instructions

### Step 1: API Endpoint Documentation

**FastAPI Endpoint Documentation:**
```python
from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional
from app.schemas.recipe import RecipeCreate, RecipeUpdate, RecipeResponse
from app.services.recipe_service import RecipeService

router = APIRouter(prefix="/api/v1/recipes", tags=["recipes"])

@router.post(
    "/",
    response_model=RecipeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new recipe",
    description="Create a new recipe with ingredients, instructions, and metadata.",
    response_description="The created recipe with generated ID and timestamps"
)
async def create_recipe(
    recipe: RecipeCreate,
    service: RecipeService = Depends()
):
    """
    Create a new recipe.
    
    This endpoint allows authenticated users to create a new recipe with the following information:
    - Title and description
    - List of ingredients
    - Cooking instructions
    - Preparation and cooking times
    - Servings and difficulty level
    
    **Required fields:**
    - title: Recipe name (1-200 characters)
    - ingredients: List of ingredients (at least 1)
    - instructions: Cooking steps (minimum 10 characters)
    - prep_time: Preparation time in minutes (> 0)
    - cook_time: Cooking time in minutes (> 0)
    - servings: Number of servings (> 0)
    
    **Returns:**
    - 201: Recipe created successfully
    - 400: Invalid input data
    - 401: Authentication required
    - 422: Validation error
    
    **Example request:**
    ```json
    {
        "title": "Spaghetti Carbonara",
        "ingredients": ["spaghetti", "eggs", "bacon", "parmesan"],
        "instructions": "Cook pasta, fry bacon, mix with eggs and cheese",
        "prep_time": 10,
        "cook_time": 20,
        "servings": 4,
        "difficulty": "medium"
    }
    ```
    """
    return await service.create_recipe(recipe)

@router.get(
    "/",
    response_model=List[RecipeResponse],
    summary="List recipes",
    description="Retrieve a paginated list of recipes."
)
async def list_recipes(
    skip: int = Query(0, ge=0, description="Number of recipes to skip"),
    limit: int = Query(20, ge=1, le=100, description="Maximum number of recipes to return"),
    service: RecipeService = Depends()
):
    """
    List recipes with pagination.
    
    **Query parameters:**
    - skip: Number of recipes to skip (default: 0)
    - limit: Maximum recipes to return (default: 20, max: 100)
    
    **Returns:**
    - 200: List of recipes
    - 401: Authentication required
    """
    return await service.get_recipes(skip=skip, limit=limit)
```

### Step 2: Code Comments and Docstrings

**Google-Style Docstrings:**
```python
from typing import List, Optional
from app.models.recipe import Recipe
from app.schemas.recipe import RecipeCreate

class RecipeService:
    """Service layer for recipe business logic.
    
    This service handles all recipe-related operations including creation,
    retrieval, updates, and deletion. It enforces business rules and
    orchestrates database operations.
    
    Attributes:
        None (stateless service)
    """
    
    @staticmethod
    async def create_recipe(recipe_data: RecipeCreate, user_id: str) -> Recipe:
        """Create a new recipe.
        
        Validates recipe data, creates a new recipe document, and saves it
        to the database. Automatically sets creation and update timestamps.
        
        Args:
            recipe_data: Recipe creation data including title, ingredients,
                        instructions, and metadata.
            user_id: ID of the user creating the recipe.
        
        Returns:
            The created Recipe document with generated ID and timestamps.
        
        Raises:
            ValueError: If recipe data fails validation (e.g., empty ingredients).
            DatabaseError: If database operation fails.
        
        Example:
            >>> recipe_data = RecipeCreate(
            ...     title="Pasta",
            ...     ingredients=["pasta", "sauce"],
            ...     instructions="Cook pasta, add sauce",
            ...     prep_time=5,
            ...     cook_time=10,
            ...     servings=2
            ... )
            >>> recipe = await RecipeService.create_recipe(recipe_data, "user123")
            >>> print(recipe.title)
            'Pasta'
        """
        # Validate ingredients are not empty
        if not recipe_data.ingredients:
            raise ValueError("At least one ingredient is required")
        
        # Create recipe document
        recipe = Recipe(
            **recipe_data.model_dump(),
            user_id=user_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        # Save to database
        await recipe.insert()
        logger.info(f"Recipe created: {recipe.id} by user {user_id}")
        
        return recipe
```

**Inline Comments for Complex Logic:**
```python
async def calculate_nutritional_info(recipe: Recipe) -> NutritionalInfo:
    """Calculate total nutritional information for a recipe."""
    total_calories = 0
    total_protein = 0
    total_carbs = 0
    total_fat = 0
    
    # Iterate through each ingredient to sum nutritional values
    for ingredient in recipe.ingredients:
        # Fetch nutritional data from external API or database
        nutrition = await get_ingredient_nutrition(ingredient)
        
        # Scale nutritional values based on quantity
        # Note: Assumes nutrition data is per 100g
        quantity_multiplier = ingredient.quantity / 100
        
        total_calories += nutrition.calories * quantity_multiplier
        total_protein += nutrition.protein * quantity_multiplier
        total_carbs += nutrition.carbs * quantity_multiplier
        total_fat += nutrition.fat * quantity_multiplier
    
    # Divide by servings to get per-serving values
    return NutritionalInfo(
        calories=int(total_calories / recipe.servings),
        protein=round(total_protein / recipe.servings, 1),
        carbs=round(total_carbs / recipe.servings, 1),
        fat=round(total_fat / recipe.servings, 1)
    )
```

### Step 3: README Documentation

**README.md Structure:**
```markdown
# NutriChef AI

AI-powered nutrition and recipe management platform.

## Features

- 🍳 Recipe management with AI-powered generation
- 🥗 Pantry tracking and inventory management
- 📊 Nutritional information and analysis
- 🛒 Shopping list generation
- 🔍 Advanced recipe search and filtering

## Tech Stack

**Backend:**
- Python 3.11
- FastAPI
- Beanie ODM
- MongoDB
- Pydantic v2

**Frontend:**
- React
- TypeScript
- TailwindCSS

## Prerequisites

- Python 3.11+
- MongoDB 6.0+
- Node.js 18+
- npm or yarn

## Installation

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/yourorg/nutrichef-ai.git
cd nutrichef-ai
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Run database migrations (if applicable):
```bash
python scripts/init_db.py
```

6. Start the server:
```bash
uvicorn app.main:app --reload
```

API will be available at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

## API Documentation

Interactive API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Testing

### Run Unit Tests
```bash
pytest backend/app/tests/unit/ -v
```

### Run Integration Tests
```bash
pytest backend/app/tests/integration/ -v
```

### Run with Coverage
```bash
pytest backend/app/tests/ --cov=backend/app --cov-report=html
```

## Project Structure

```
nutrichef-ai/
├── backend/
│   ├── app/
│   │   ├── api/              # FastAPI route handlers
│   │   ├── models/           # Beanie ODM models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── services/         # Business logic
│   │   ├── database/         # Database configuration
│   │   └── tests/            # Test files
│   ├── main.py               # Application entry point
│   └── requirements.txt      # Python dependencies
└── frontend/
    └── src/                  # React application
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## License

MIT License - see [LICENSE](LICENSE) file.
```

### Step 4: Architecture Decision Records (ADRs)

**docs/adr/001-use-beanie-odm.md:**
```markdown
# ADR 001: Use Beanie ODM for MongoDB Operations

## Status
Accepted

## Context
We need an Object-Document Mapper (ODM) for MongoDB that supports:
- Async operations
- Type safety with Pydantic
- Clean query API
- Good integration with FastAPI

## Decision
We will use Beanie ODM for all MongoDB operations.

## Consequences

### Positive
- Native async/await support
- Built on Pydantic v2 for validation
- Type-safe queries
- Excellent FastAPI integration
- Active maintenance and community

### Negative
- Learning curve for team members unfamiliar with Beanie
- Less mature than some alternatives (e.g., MongoEngine)
- Smaller ecosystem compared to SQL ORMs

## Alternatives Considered

1. **Motor (raw PyMongo async)**
   - Rejected: Too low-level, no built-in validation

2. **MongoEngine**
   - Rejected: No async support, outdated

3. **ODMantic**
   - Rejected: Less active development, smaller community
```

## Expected Output

**Documentation Files:**
- API documentation (auto-generated by FastAPI)
- README.md with setup and usage instructions
- Code with comprehensive docstrings
- ADRs for major architectural decisions
- Deployment guides

**Documentation Quality:**
- Clear and concise
- Up-to-date with code
- Examples included
- Proper formatting
- Easy to navigate

## Constraints

- **MUST** use Google-style docstrings
- **MUST** document all public APIs
- **MUST** include examples in API docs
- **MUST** keep README up-to-date
- **MUST** document complex algorithms
- **MUST NOT** include outdated information
- **MUST NOT** duplicate information unnecessarily
- **MUST** use proper Markdown formatting

## Notes

- Update documentation when code changes
- Use FastAPI's built-in documentation features
- Include examples for complex operations
- Document error scenarios and responses
- Add diagrams for architecture if helpful
- Keep language simple and clear
- Review documentation in code reviews
- Consider adding video tutorials for complex features