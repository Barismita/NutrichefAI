---
name: "Pytest Unit Test Creation"
description: "Guide creation of comprehensive unit tests with fixtures, mocking, and async patterns"
category: "Testing"
tags: ["testing", "pytest", "unit-tests", "mocking", "async"]
---

## Objective

Create comprehensive unit tests using pytest that validate business logic, handle edge cases, and achieve 80%+ code coverage.

## Context

**Tech Stack:**
- Pytest for testing framework
- pytest-asyncio for async tests
- pytest-mock for mocking
- pytest-cov for coverage reporting
- Python 3.11

**Test Location:**
- `backend/app/tests/unit/`

**Testing Principles:**
- Test behavior, not implementation
- Isolate units under test
- Mock external dependencies
- Test edge cases and errors

## Instructions

### Step 1: Set Up Test Structure

**Directory Organization:**
```
backend/app/tests/
├── __init__.py
├── conftest.py              # Shared fixtures
├── unit/
│   ├── __init__.py
│   ├── test_recipe_service.py
│   ├── test_pantry_service.py
│   └── test_schemas.py
└── integration/
    ├── __init__.py
    └── test_recipe_api.py
```

### Step 2: Create Fixtures

**conftest.py:**
```python
import pytest
from datetime import datetime
from app.models.recipe import Recipe
from app.schemas.recipe import RecipeCreate

@pytest.fixture
def sample_recipe_data():
    """Sample recipe creation data."""
    return RecipeCreate(
        title="Test Recipe",
        description="Test description",
        ingredients=["flour", "sugar", "eggs"],
        instructions="Mix and bake",
        prep_time=15,
        cook_time=30,
        servings=4,
        difficulty="medium"
    )

@pytest.fixture
def sample_recipe():
    """Sample recipe document."""
    return Recipe(
        id="507f1f77bcf86cd799439011",
        user_id="user123",
        title="Test Recipe",
        ingredients=["flour", "sugar", "eggs"],
        instructions="Mix and bake",
        prep_time=15,
        cook_time=30,
        servings=4,
        difficulty="medium",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

@pytest.fixture
def mock_db(mocker):
    """Mock database operations."""
    return mocker.AsyncMock()
```

### Step 3: Write Service Layer Tests

**test_recipe_service.py:**
```python
import pytest
from unittest.mock import AsyncMock, MagicMock
from app.services.recipe_service import RecipeService
from app.schemas.recipe import RecipeCreate, RecipeUpdate
from app.models.recipe import Recipe
from app.exceptions import RecipeNotFoundException, UnauthorizedException

class TestRecipeService:
    """Test suite for RecipeService."""
    
    @pytest.mark.asyncio
    async def test_create_recipe_success(self, sample_recipe_data, mocker):
        """Test successful recipe creation."""
        # Arrange
        user_id = "user123"
        mock_insert = mocker.patch.object(Recipe, 'insert', new_callable=AsyncMock)
        
        # Act
        recipe = await RecipeService.create_recipe(sample_recipe_data, user_id)
        
        # Assert
        assert recipe.title == sample_recipe_data.title
        assert recipe.user_id == user_id
        assert len(recipe.ingredients) == 3
        mock_insert.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_create_recipe_with_empty_ingredients_fails(self):
        """Test recipe creation fails with empty ingredients."""
        # Arrange
        invalid_data = RecipeCreate(
            title="Test",
            ingredients=[],  # Empty list
            instructions="Test",
            prep_time=10,
            cook_time=20,
            servings=4
        )
        
        # Act & Assert
        with pytest.raises(ValueError, match="At least one ingredient"):
            await RecipeService.create_recipe(invalid_data, "user123")
    
    @pytest.mark.asyncio
    async def test_get_recipe_by_id_found(self, sample_recipe, mocker):
        """Test retrieving existing recipe by ID."""
        # Arrange
        recipe_id = "507f1f77bcf86cd799439011"
        mocker.patch.object(Recipe, 'get', new_callable=AsyncMock, return_value=sample_recipe)
        
        # Act
        recipe = await RecipeService.get_recipe_by_id(recipe_id)
        
        # Assert
        assert recipe is not None
        assert recipe.id == recipe_id
        assert recipe.title == "Test Recipe"
    
    @pytest.mark.asyncio
    async def test_get_recipe_by_id_not_found(self, mocker):
        """Test retrieving non-existent recipe returns None."""
        # Arrange
        mocker.patch.object(Recipe, 'get', new_callable=AsyncMock, return_value=None)
        
        # Act
        recipe = await RecipeService.get_recipe_by_id("nonexistent_id")
        
        # Assert
        assert recipe is None
    
    @pytest.mark.asyncio
    async def test_update_recipe_success(self, sample_recipe, mocker):
        """Test successful recipe update."""
        # Arrange
        recipe_id = sample_recipe.id
        user_id = sample_recipe.user_id
        update_data = RecipeUpdate(title="Updated Title")
        
        mocker.patch.object(Recipe, 'get', new_callable=AsyncMock, return_value=sample_recipe)
        mock_save = mocker.patch.object(sample_recipe, 'save', new_callable=AsyncMock)
        
        # Act
        updated_recipe = await RecipeService.update_recipe(recipe_id, update_data, user_id)
        
        # Assert
        assert updated_recipe.title == "Updated Title"
        mock_save.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_update_recipe_unauthorized(self, sample_recipe, mocker):
        """Test update fails when user doesn't own recipe."""
        # Arrange
        recipe_id = sample_recipe.id
        different_user_id = "different_user"
        update_data = RecipeUpdate(title="Updated Title")
        
        mocker.patch.object(Recipe, 'get', new_callable=AsyncMock, return_value=sample_recipe)
        
        # Act & Assert
        with pytest.raises(UnauthorizedException):
            await RecipeService.update_recipe(recipe_id, update_data, different_user_id)
    
    @pytest.mark.asyncio
    async def test_delete_recipe_success(self, sample_recipe, mocker):
        """Test successful recipe deletion."""
        # Arrange
        recipe_id = sample_recipe.id
        user_id = sample_recipe.user_id
        
        mocker.patch.object(Recipe, 'get', new_callable=AsyncMock, return_value=sample_recipe)
        mock_delete = mocker.patch.object(sample_recipe, 'delete', new_callable=AsyncMock)
        
        # Act
        await RecipeService.delete_recipe(recipe_id, user_id)
        
        # Assert
        mock_delete.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_get_user_recipes_with_pagination(self, sample_recipe, mocker):
        """Test retrieving user recipes with pagination."""
        # Arrange
        user_id = "user123"
        mock_find = mocker.MagicMock()
        mock_find.skip.return_value = mock_find
        mock_find.limit.return_value = mock_find
        mock_find.sort.return_value = mock_find
        mock_find.to_list = AsyncMock(return_value=[sample_recipe])
        
        mocker.patch.object(Recipe, 'find', return_value=mock_find)
        
        # Act
        recipes = await RecipeService.get_user_recipes(user_id, skip=0, limit=10)
        
        # Assert
        assert len(recipes) == 1
        assert recipes[0].user_id == user_id
        mock_find.skip.assert_called_once_with(0)
        mock_find.limit.assert_called_once_with(10)
```

### Step 4: Write Schema Tests

**test_schemas.py:**
```python
import pytest
from pydantic import ValidationError
from app.schemas.recipe import RecipeCreate, RecipeUpdate

class TestRecipeSchemas:
    """Test suite for recipe schemas."""
    
    def test_recipe_create_valid_data(self):
        """Test RecipeCreate with valid data."""
        data = {
            "title": "Test Recipe",
            "ingredients": ["flour", "sugar"],
            "instructions": "Mix and bake",
            "prep_time": 15,
            "cook_time": 30,
            "servings": 4
        }
        recipe = RecipeCreate(**data)
        assert recipe.title == "Test Recipe"
        assert len(recipe.ingredients) == 2
    
    def test_recipe_create_empty_title_fails(self):
        """Test RecipeCreate fails with empty title."""
        with pytest.raises(ValidationError):
            RecipeCreate(
                title="",
                ingredients=["flour"],
                instructions="Test",
                prep_time=10,
                cook_time=20,
                servings=4
            )
    
    def test_recipe_create_negative_prep_time_fails(self):
        """Test RecipeCreate fails with negative prep time."""
        with pytest.raises(ValidationError):
            RecipeCreate(
                title="Test",
                ingredients=["flour"],
                instructions="Test",
                prep_time=-10,
                cook_time=20,
                servings=4
            )
```

### Step 5: Run Tests and Check Coverage

```bash
# Run all unit tests
pytest backend/app/tests/unit/ -v

# Run with coverage
pytest backend/app/tests/unit/ --cov=backend/app --cov-report=html --cov-report=term-missing

# Run specific test file
pytest backend/app/tests/unit/test_recipe_service.py -v

# Run specific test
pytest backend/app/tests/unit/test_recipe_service.py::TestRecipeService::test_create_recipe_success -v
```

## Expected Output

**Test Files:**
- `backend/app/tests/unit/test_{module}_service.py`
- `backend/app/tests/unit/test_{module}_schemas.py`
- `backend/app/tests/conftest.py` with shared fixtures

**Test Coverage:**
- >= 80% overall coverage
- 100% coverage for critical business logic
- All edge cases tested
- Error scenarios covered

## Constraints

- **MUST** use pytest framework
- **MUST** use @pytest.mark.asyncio for async tests
- **MUST** mock external dependencies (database, APIs)
- **MUST** achieve 80%+ code coverage
- **MUST** test edge cases and error scenarios
- **MUST** use descriptive test names
- **MUST** follow AAA pattern (Arrange, Act, Assert)
- **MUST NOT** test implementation details
- **MUST NOT** have tests depend on each other
- **MUST NOT** use real database in unit tests

## Notes

- Use fixtures for reusable test data
- Mock database operations with AsyncMock
- Test one thing per test function
- Use parametrize for testing multiple inputs
- Keep tests fast (mock I/O operations)
- Use clear assertion messages
- Organize tests in classes by functionality
- Run tests frequently during development