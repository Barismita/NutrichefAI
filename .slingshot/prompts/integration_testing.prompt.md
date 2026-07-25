## Objective

Create comprehensive integration tests that validate complete API workflows, including database operations, authentication, and end-to-end scenarios.

## Context

**Tech Stack:**
- FastAPI TestClient for API testing
- Pytest for test framework
- MongoDB for test database
- Beanie ODM for database operations

**Test Location:**
- `backend/app/tests/integration/`

**Test Scope:**
- Complete API request/response cycles
- Database operations
- Authentication/authorization
- Multi-step workflows

## Instructions

### Step 1: Set Up Test Database

**conftest.py:**
```python
import pytest
import asyncio
from fastapi.testclient import TestClient
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.main import app
from app.models.recipe import Recipe
from app.models.user import User
from app.config.settings import settings

@pytest.fixture(scope="session")
def event_loop():
    """Create event loop for async tests."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session")
async def test_db():
    """Initialize test database."""
    client = AsyncIOMotorClient(settings.TEST_MONGODB_URL)
    await init_beanie(
        database=client[settings.TEST_DATABASE_NAME],
        document_models=[Recipe, User]
    )
    yield client
    # Cleanup
    await client.drop_database(settings.TEST_DATABASE_NAME)
    client.close()

@pytest.fixture
async def clean_db(test_db):
    """Clean database before each test."""
    await Recipe.delete_all()
    await User.delete_all()
    yield

@pytest.fixture
def client():
    """FastAPI test client."""
    return TestClient(app)

@pytest.fixture
async def test_user():
    """Create test user."""
    user = User(
        email="test@example.com",
        username="testuser",
        hashed_password="hashed_password_here"
    )
    await user.insert()
    return user

@pytest.fixture
def auth_headers(test_user):
    """Authentication headers for test user."""
    # Generate JWT token for test user
    token = create_access_token(data={"sub": str(test_user.id)})
    return {"Authorization": f"Bearer {token}"}
```

### Step 2: Write API Endpoint Tests

**test_recipe_api.py:**
```python
import pytest
from fastapi import status
from app.models.recipe import Recipe

class TestRecipeAPI:
    """Integration tests for recipe API endpoints."""
    
    @pytest.mark.asyncio
    async def test_create_recipe_success(self, client, auth_headers, clean_db):
        """Test successful recipe creation via API."""
        # Arrange
        recipe_data = {
            "title": "Integration Test Recipe",
            "description": "Test description",
            "ingredients": ["flour", "sugar", "eggs"],
            "instructions": "Mix and bake at 350F",
            "prep_time": 15,
            "cook_time": 30,
            "servings": 4,
            "difficulty": "medium"
        }
        
        # Act
        response = client.post(
            "/api/v1/recipes",
            json=recipe_data,
            headers=auth_headers
        )
        
        # Assert
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["title"] == recipe_data["title"]
        assert "id" in data
        assert "created_at" in data
        
        # Verify in database
        recipe = await Recipe.get(data["id"])
        assert recipe is not None
        assert recipe.title == recipe_data["title"]
    
    @pytest.mark.asyncio
    async def test_create_recipe_without_auth_fails(self, client, clean_db):
        """Test recipe creation fails without authentication."""
        recipe_data = {
            "title": "Test Recipe",
            "ingredients": ["flour"],
            "instructions": "Test",
            "prep_time": 10,
            "cook_time": 20,
            "servings": 4
        }
        
        response = client.post("/api/v1/recipes", json=recipe_data)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    @pytest.mark.asyncio
    async def test_create_recipe_invalid_data_fails(self, client, auth_headers, clean_db):
        """Test recipe creation fails with invalid data."""
        invalid_data = {
            "title": "",  # Empty title
            "ingredients": [],  # Empty ingredients
            "instructions": "Test",
            "prep_time": -10,  # Negative time
            "cook_time": 20,
            "servings": 4
        }
        
        response = client.post(
            "/api/v1/recipes",
            json=invalid_data,
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    @pytest.mark.asyncio
    async def test_get_recipe_by_id_success(self, client, auth_headers, test_user, clean_db):
        """Test retrieving recipe by ID."""
        # Create recipe in database
        recipe = Recipe(
            title="Test Recipe",
            user_id=str(test_user.id),
            ingredients=["flour", "sugar"],
            instructions="Mix and bake",
            prep_time=15,
            cook_time=30,
            servings=4
        )
        await recipe.insert()
        
        # Get recipe via API
        response = client.get(
            f"/api/v1/recipes/{recipe.id}",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == str(recipe.id)
        assert data["title"] == "Test Recipe"
    
    @pytest.mark.asyncio
    async def test_get_recipe_not_found(self, client, auth_headers, clean_db):
        """Test getting non-existent recipe returns 404."""
        response = client.get(
            "/api/v1/recipes/507f1f77bcf86cd799439011",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    @pytest.mark.asyncio
    async def test_list_recipes_with_pagination(self, client, auth_headers, test_user, clean_db):
        """Test listing recipes with pagination."""
        # Create multiple recipes
        for i in range(5):
            recipe = Recipe(
                title=f"Recipe {i}",
                user_id=str(test_user.id),
                ingredients=["ingredient"],
                instructions="Test",
                prep_time=10,
                cook_time=20,
                servings=4
            )
            await recipe.insert()
        
        # Get first page
        response = client.get(
            "/api/v1/recipes?skip=0&limit=3",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 3
    
    @pytest.mark.asyncio
    async def test_update_recipe_success(self, client, auth_headers, test_user, clean_db):
        """Test updating recipe."""
        # Create recipe
        recipe = Recipe(
            title="Original Title",
            user_id=str(test_user.id),
            ingredients=["flour"],
            instructions="Test",
            prep_time=10,
            cook_time=20,
            servings=4
        )
        await recipe.insert()
        
        # Update recipe
        update_data = {"title": "Updated Title"}
        response = client.patch(
            f"/api/v1/recipes/{recipe.id}",
            json=update_data,
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["title"] == "Updated Title"
        
        # Verify in database
        updated_recipe = await Recipe.get(recipe.id)
        assert updated_recipe.title == "Updated Title"
    
    @pytest.mark.asyncio
    async def test_update_other_user_recipe_fails(self, client, auth_headers, clean_db):
        """Test updating another user's recipe fails."""
        # Create recipe owned by different user
        recipe = Recipe(
            title="Test Recipe",
            user_id="different_user_id",
            ingredients=["flour"],
            instructions="Test",
            prep_time=10,
            cook_time=20,
            servings=4
        )
        await recipe.insert()
        
        # Try to update
        update_data = {"title": "Updated Title"}
        response = client.patch(
            f"/api/v1/recipes/{recipe.id}",
            json=update_data,
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    @pytest.mark.asyncio
    async def test_delete_recipe_success(self, client, auth_headers, test_user, clean_db):
        """Test deleting recipe."""
        # Create recipe
        recipe = Recipe(
            title="Test Recipe",
            user_id=str(test_user.id),
            ingredients=["flour"],
            instructions="Test",
            prep_time=10,
            cook_time=20,
            servings=4
        )
        await recipe.insert()
        
        # Delete recipe
        response = client.delete(
            f"/api/v1/recipes/{recipe.id}",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
        # Verify deleted from database
        deleted_recipe = await Recipe.get(recipe.id)
        assert deleted_recipe is None
```

### Step 3: Test Multi-Step Workflows

```python
@pytest.mark.asyncio
async def test_complete_recipe_workflow(self, client, auth_headers, clean_db):
    """Test complete recipe lifecycle: create, read, update, delete."""
    # Create
    create_data = {
        "title": "Workflow Test Recipe",
        "ingredients": ["flour", "sugar"],
        "instructions": "Mix and bake",
        "prep_time": 15,
        "cook_time": 30,
        "servings": 4
    }
    create_response = client.post(
        "/api/v1/recipes",
        json=create_data,
        headers=auth_headers
    )
    assert create_response.status_code == status.HTTP_201_CREATED
    recipe_id = create_response.json()["id"]
    
    # Read
    get_response = client.get(
        f"/api/v1/recipes/{recipe_id}",
        headers=auth_headers
    )
    assert get_response.status_code == status.HTTP_200_OK
    
    # Update
    update_response = client.patch(
        f"/api/v1/recipes/{recipe_id}",
        json={"title": "Updated Workflow Recipe"},
        headers=auth_headers
    )
    assert update_response.status_code == status.HTTP_200_OK
    
    # Delete
    delete_response = client.delete(
        f"/api/v1/recipes/{recipe_id}",
        headers=auth_headers
    )
    assert delete_response.status_code == status.HTTP_204_NO_CONTENT
```

### Step 4: Run Integration Tests

```bash
# Run all integration tests
pytest backend/app/tests/integration/ -v

# Run with coverage
pytest backend/app/tests/integration/ --cov=backend/app/api --cov-report=html

# Run specific test file
pytest backend/app/tests/integration/test_ingredient_substitution_api.py -v
```

## Expected Output

**Test Files:**
- `backend/app/tests/integration/test_{resource}_api.py`
- `backend/app/tests/conftest.py` with database fixtures

**Test Coverage:**
- All API endpoints tested
- Success and error scenarios covered
- Authentication/authorization tested
- Database operations verified
- Multi-step workflows validated

## Constraints

- **MUST** use separate test database
- **MUST** clean database between tests
- **MUST** test authentication/authorization
- **MUST** verify database state after operations
- **MUST** test error scenarios (400, 401, 403, 404)
- **MUST** use FastAPI TestClient
- **MUST NOT** use production database
- **MUST NOT** leave test data in database
- **MUST** test complete request/response cycles

## Notes

- Use fixtures for database setup/teardown
- Test both success and failure paths
- Verify HTTP status codes
- Validate response schemas
- Test pagination and filtering
- Test concurrent requests if applicable
- Use descriptive test names
- Keep tests independent
- Run integration tests in CI/CD pipeline