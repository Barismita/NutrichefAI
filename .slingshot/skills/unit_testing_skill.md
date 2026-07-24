# Unit Testing Skill

## Name
Pytest Unit Testing for NutriChef AI

## Description
This skill provides comprehensive guidance for writing production-ready unit tests using pytest for the NutriChef AI platform. It covers test structure, async testing, mocking, fixtures, test coverage, and best practices for testing FastAPI, Beanie ODM, and service layer components.

## Purpose
To ensure all code is thoroughly tested with high-quality unit tests that validate correctness, handle edge cases, and maintain 80%+ code coverage following NutriChef AI testing standards.

## When to Use
- Writing unit tests for new features
- Testing service layer business logic
- Testing API endpoints (integration tests)
- Testing Pydantic schema validation
- Testing Beanie model methods
- Refactoring existing code (regression tests)
- Implementing TDD (Test-Driven Development)
- Validating edge cases and error scenarios

## Inputs
- **Code to Test**: Functions, classes, or modules requiring tests
- **Test Scenarios**: Happy path, edge cases, error cases
- **Dependencies**: External services, databases, APIs to mock
- **Expected Behavior**: Business requirements and acceptance criteria
- **Coverage Target**: Minimum 80% code coverage

## Outputs
- **Test Files**: `backend/app/tests/unit/test_{module}.py`
- **Test Functions**: Descriptive test function names
- **Fixtures**: Reusable test data and setup
- **Mocks**: Mocked external dependencies
- **Assertions**: Clear assertions validating expected behavior
- **Coverage Report**: Test coverage metrics
- **Test Documentation**: Docstrings explaining test purpose

## Best Practices

### 1. Test Organization
- **Structure**: Mirror source code structure in tests/
- **Naming**: `test_{module}.py` for test files, `test_{function_name}` for test functions
- **Grouping**: Group related tests in classes (optional)
- **Isolation**: Each test should be independent

### 2. Test Naming Convention
- Use descriptive names: `test_create_recipe_with_valid_data_returns_recipe`
- Follow pattern: `test_{function}_{scenario}_{expected_result}`
- Be explicit about what is being tested

### 3. AAA Pattern (Arrange-Act-Assert)
- **Arrange**: Set up test data and mocks
- **Act**: Execute the function being tested
- **Assert**: Verify the expected outcome

### 4. Async Testing
- Use `@pytest.mark.asyncio` for async test functions
- Use `pytest-asyncio` plugin
- Await all async operations in tests

### 5. Mocking
- Mock external dependencies (databases, APIs, file I/O)
- Use `pytest-mock` or `unittest.mock`
- Mock at the boundary (service layer, not models)
- Verify mock calls with `assert_called_once_with()`

### 6. Fixtures
- Use fixtures for reusable test data
- Define fixtures in `conftest.py` for sharing across tests
- Use fixture scopes appropriately (function, class, module, session)

### 7. Coverage
- Aim for 80%+ code coverage
- 100% coverage for critical business logic
- Use `pytest-cov` for coverage reports
- Don't chase 100% coverage at the expense of test quality

## Common Mistakes

### ❌ Mistake 1: Testing Implementation Instead of Behavior
```python
# BAD: Testing internal implementation details
def test_create_recipe_calls_insert():
    recipe_data = RecipeCreate(title="Test", ingredients=["a"])
    with patch.object(Recipe, 'insert') as mock_insert:
        RecipeService.create_recipe(recipe_data)
        mock_insert.assert_called_once()  # Testing implementation
```
**Fix**: Test behavior and outcomes
```python
# GOOD: Testing behavior and outcome
@pytest.mark.asyncio
async def test_create_recipe_with_valid_data_returns_recipe():
    recipe_data = RecipeCreate(
        title="Chicken Alfredo",
        ingredients=["chicken", "pasta"],
        instructions="Cook pasta, add chicken",
        prep_time=30,
        cook_time=20,
        servings=4
    )
    recipe = await RecipeService.create_recipe(recipe_data)
    
    assert recipe.title == "Chicken Alfredo"
    assert len(recipe.ingredients) == 2
    assert recipe.id is not None
```

### ❌ Mistake 2: Missing Async Decorator
```python
# BAD: Missing @pytest.mark.asyncio
async def test_get_recipe_by_id():
    recipe = await RecipeService.get_recipe_by_id("123")
    assert recipe is not None
```
**Fix**: Add @pytest.mark.asyncio
```python
# GOOD: Proper async test
@pytest.mark.asyncio
async def test_get_recipe_by_id_returns_recipe():
    recipe = await RecipeService.get_recipe_by_id("123")
    assert recipe is not None
```

### ❌ Mistake 3: Not Testing Edge Cases
```python
# BAD: Only testing happy path
def test_create_recipe():
    recipe_data = RecipeCreate(title="Test", ingredients=["a"])
    recipe = RecipeService.create_recipe(recipe_data)
    assert recipe is not None
```
**Fix**: Test edge cases and error scenarios
```python
# GOOD: Testing edge cases
@pytest.mark.asyncio
async def test_create_recipe_with_empty_title_raises_error():
    recipe_data = RecipeCreate(
        title="",  # Empty title
        ingredients=["a"],
        instructions="test",
        prep_time=30,
        cook_time=20,
        servings=4
    )
    with pytest.raises(ValueError, match="Title cannot be empty"):
        await RecipeService.create_recipe(recipe_data)
```

### ❌ Mistake 4: Shared State Between Tests
```python
# BAD: Shared mutable state
test_recipes = []

def test_add_recipe():
    test_recipes.append(Recipe(title="Test"))
    assert len(test_recipes) == 1

def test_recipe_count():
    # Fails because test_recipes has 1 item from previous test
    assert len(test_recipes) == 0
```
**Fix**: Use fixtures for isolated test data
```python
# GOOD: Isolated test data with fixtures
@pytest.fixture
def test_recipes():
    return []

def test_add_recipe(test_recipes):
    test_recipes.append(Recipe(title="Test"))
    assert len(test_recipes) == 1

def test_recipe_count(test_recipes):
    assert len(test_recipes) == 0  # Passes, fresh fixture
```

### ❌ Mistake 5: Weak Assertions
```python
# BAD: Weak assertion
def test_create_recipe():
    recipe = RecipeService.create_recipe(recipe_data)
    assert recipe  # Only checks truthy value
```
**Fix**: Use specific assertions
```python
# GOOD: Specific assertions
@pytest.mark.asyncio
async def test_create_recipe_returns_recipe_with_correct_data():
    recipe_data = RecipeCreate(
        title="Chicken Alfredo",
        ingredients=["chicken", "pasta"],
        instructions="Cook pasta",
        prep_time=30,
        cook_time=20,
        servings=4
    )
    recipe = await RecipeService.create_recipe(recipe_data)
    
    assert isinstance(recipe, Recipe)
    assert recipe.title == "Chicken Alfredo"
    assert recipe.ingredients == ["chicken", "pasta"]
    assert recipe.prep_time == 30
    assert recipe.id is not None
```

## Examples

### Example 1: Service Layer Unit Tests

```python
# backend/app/tests/unit/test_recipe_service.py
import pytest
from unittest.mock import AsyncMock, patch
from fastapi import HTTPException
from app.services.recipe_service import RecipeService
from app.schemas.recipe import RecipeCreate, RecipeUpdate
from app.models.recipe import Recipe

@pytest.mark.asyncio
async def test_create_recipe_with_valid_data_returns_recipe():
    """Test creating a recipe with valid data returns a recipe object."""
    # Arrange
    recipe_data = RecipeCreate(
        title="Chicken Alfredo",
        ingredients=["chicken", "pasta", "cream"],
        instructions="Cook pasta, add chicken and cream",
        prep_time=15,
        cook_time=30,
        servings=4
    )
    
    # Mock database operations
    with patch.object(Recipe, 'get_by_title', return_value=None):
        with patch.object(Recipe, 'insert', new_callable=AsyncMock) as mock_insert:
            # Act
            recipe = await RecipeService.create_recipe(recipe_data)
            
            # Assert
            assert recipe.title == "Chicken Alfredo"
            assert len(recipe.ingredients) == 3
            assert recipe.prep_time == 15
            mock_insert.assert_called_once()

@pytest.mark.asyncio
async def test_create_recipe_with_duplicate_title_raises_conflict():
    """Test creating a recipe with duplicate title raises HTTPException."""
    # Arrange
    recipe_data = RecipeCreate(
        title="Existing Recipe",
        ingredients=["a"],
        instructions="test",
        prep_time=10,
        cook_time=20,
        servings=2
    )
    
    existing_recipe = Recipe(
        title="Existing Recipe",
        ingredients=["a"],
        instructions="test",
        prep_time=10,
        cook_time=20,
        servings=2
    )
    
    # Mock existing recipe found
    with patch.object(Recipe, 'get_by_title', return_value=existing_recipe):
        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            await RecipeService.create_recipe(recipe_data)
        
        assert exc_info.value.status_code == 409
        assert "already exists" in exc_info.value.detail

@pytest.mark.asyncio
async def test_get_recipe_by_id_with_valid_id_returns_recipe():
    """Test retrieving a recipe by valid ID returns the recipe."""
    # Arrange
    recipe_id = "507f1f77bcf86cd799439011"
    mock_recipe = Recipe(
        id=recipe_id,
        title="Test Recipe",
        ingredients=["a", "b"],
        instructions="test",
        prep_time=10,
        cook_time=20,
        servings=2
    )
    
    # Mock database get
    with patch.object(Recipe, 'get', return_value=mock_recipe):
        # Act
        recipe = await RecipeService.get_recipe_by_id(recipe_id)
        
        # Assert
        assert recipe.id == recipe_id
        assert recipe.title == "Test Recipe"

@pytest.mark.asyncio
async def test_get_recipe_by_id_with_invalid_id_raises_not_found():
    """Test retrieving a recipe with invalid ID raises HTTPException 404."""
    # Arrange
    recipe_id = "nonexistent_id"
    
    # Mock database returns None
    with patch.object(Recipe, 'get', return_value=None):
        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            await RecipeService.get_recipe_by_id(recipe_id)
        
        assert exc_info.value.status_code == 404
        assert recipe_id in exc_info.value.detail

@pytest.mark.asyncio
async def test_delete_recipe_with_valid_id_soft_deletes_recipe():
    """Test deleting a recipe soft deletes it (sets is_deleted=True)."""
    # Arrange
    recipe_id = "507f1f77bcf86cd799439011"
    mock_recipe = Recipe(
        id=recipe_id,
        title="Test Recipe",
        ingredients=["a"],
        instructions="test",
        prep_time=10,
        cook_time=20,
        servings=2,
        is_deleted=False
    )
    
    # Mock database operations
    with patch.object(Recipe, 'get', return_value=mock_recipe):
        with patch.object(mock_recipe, 'soft_delete', new_callable=AsyncMock) as mock_soft_delete:
            # Act
            result = await RecipeService.delete_recipe(recipe_id)
            
            # Assert
            assert result is True
            mock_soft_delete.assert_called_once()
```

### Example 2: API Endpoint Integration Tests

```python
# backend/app/tests/integration/test_recipe_api.py
import pytest
from httpx import AsyncClient
from app.main import app
from app.models.recipe import Recipe

@pytest.mark.asyncio
async def test_create_recipe_endpoint_returns_201():
    """Test POST /api/v1/recipes returns 201 with created recipe."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Arrange
        recipe_data = {
            "title": "Integration Test Recipe",
            "ingredients": ["ingredient1", "ingredient2"],
            "instructions": "Test instructions",
            "prep_time": 30,
            "cook_time": 45,
            "servings": 4
        }
        
        # Act
        response = await client.post("/api/v1/recipes", json=recipe_data)
        
        # Assert
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Integration Test Recipe"
        assert "id" in data
        assert "created_at" in data

@pytest.mark.asyncio
async def test_get_recipe_endpoint_with_invalid_id_returns_404():
    """Test GET /api/v1/recipes/{id} with invalid ID returns 404."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Act
        response = await client.get("/api/v1/recipes/invalid_id")
        
        # Assert
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()
```

### Example 3: Fixtures and Conftest

```python
# backend/app/tests/conftest.py
import pytest
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.recipe import Recipe
from app.models.user import User
from app.config.settings import settings

@pytest.fixture(scope="session")
def event_loop():
    """Create an event loop for async tests."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="function")
async def test_db():
    """Initialize test database with Beanie."""
    client = AsyncIOMotorClient(settings.MONGODB_TEST_URL)
    await init_beanie(
        database=client[settings.TEST_DATABASE_NAME],
        document_models=[Recipe, User]
    )
    yield
    # Cleanup: Drop test database after each test
    await client.drop_database(settings.TEST_DATABASE_NAME)

@pytest.fixture
def sample_recipe_data():
    """Provide sample recipe data for tests."""
    return {
        "title": "Test Recipe",
        "ingredients": ["ingredient1", "ingredient2"],
        "instructions": "Test instructions",
        "prep_time": 30,
        "cook_time": 45,
        "servings": 4
    }

@pytest.fixture
async def created_recipe(test_db, sample_recipe_data):
    """Create a recipe in test database."""
    recipe = Recipe(**sample_recipe_data)
    await recipe.insert()
    return recipe
```

### Example 4: Pydantic Schema Validation Tests

```python
# backend/app/tests/unit/test_recipe_schema.py
import pytest
from pydantic import ValidationError
from app.schemas.recipe import RecipeCreate

def test_recipe_create_with_valid_data_succeeds():
    """Test RecipeCreate with valid data passes validation."""
    # Arrange & Act
    recipe = RecipeCreate(
        title="Valid Recipe",
        ingredients=["a", "b"],
        instructions="Valid instructions",
        prep_time=30,
        cook_time=45,
        servings=4
    )
    
    # Assert
    assert recipe.title == "Valid Recipe"
    assert len(recipe.ingredients) == 2

def test_recipe_create_with_empty_title_raises_validation_error():
    """Test RecipeCreate with empty title raises ValidationError."""
    # Arrange & Act & Assert
    with pytest.raises(ValidationError) as exc_info:
        RecipeCreate(
            title="",  # Empty title
            ingredients=["a"],
            instructions="test",
            prep_time=30,
            cook_time=45,
            servings=4
        )
    
    errors = exc_info.value.errors()
    assert any("title" in str(error) for error in errors)

def test_recipe_create_with_negative_prep_time_raises_validation_error():
    """Test RecipeCreate with negative prep_time raises ValidationError."""
    with pytest.raises(ValidationError) as exc_info:
        RecipeCreate(
            title="Test",
            ingredients=["a"],
            instructions="test",
            prep_time=-10,  # Negative prep time
            cook_time=45,
            servings=4
        )
    
    errors = exc_info.value.errors()
    assert any("prep_time" in str(error) for error in errors)
```

## Related Skills
- **fastapi_api_skill**: For testing API endpoints
- **beanie_model_skill**: For testing model methods and queries
- **pydantic_schema_skill**: For testing schema validation
- **service_layer_skill**: For testing business logic
- **code_review_skill**: For reviewing test quality and coverage
- **documentation_skill**: For documenting test scenarios

---

**Skill Version**: 1.0  
**Last Updated**: 2026-07-24  
**Maintained By**: NutriChef AI Development Team