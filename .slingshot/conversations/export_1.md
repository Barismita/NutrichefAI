### User:
attached the promt file
### Slingshot:
**Summary:**
- You provided the requirements for Recipe Management in NutriChef AI.
- I will generate all required files: model, schema, service, API, tests, and update DB and main registration.
- All code will follow clean architecture, async, FastAPI/Beanie/Pydantic v2 best practices, and your validation/error handling rules.

---

### 1. Recipe Model  
```python::recipe_model.py::backend/app/models/recipe_model.py
from datetime import datetime
from typing import List, Optional

from beanie import Document
from pydantic import BaseModel, Field

class Nutrition(BaseModel):
    calories: float = Field(..., ge=0)
    protein: float = Field(..., ge=0)
    carbohydrates: float = Field(..., ge=0)
    fat: float = Field(..., ge=0)

class Recipe(Document):
    title: str = Field(..., min_length=1)
    description: Optional[str] = None
    ingredients: List[str] = Field(..., min_items=1)
    instructions: List[str] = Field(..., min_items=1)
    cooking_time_minutes: int = Field(..., gt=0)
    servings: int = Field(..., gt=0)
    difficulty: str
    cuisine: str
    dietary_tags: List[str] = []
    nutrition: Nutrition
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "recipes"
```

---

### 2. Recipe Schemas  
```python::recipe_schema.py::backend/app/schemas/recipe_schema.py
from typing import List, Optional
from pydantic import BaseModel, Field

class NutritionSchema(BaseModel):
    calories: float = Field(..., ge=0)
    protein: float = Field(..., ge=0)
    carbohydrates: float = Field(..., ge=0)
    fat: float = Field(..., ge=0)

class RecipeBase(BaseModel):
    title: str = Field(..., min_length=1)
    description: Optional[str] = None
    ingredients: List[str] = Field(..., min_items=1)
    instructions: List[str] = Field(..., min_items=1)
    cooking_time_minutes: int = Field(..., gt=0)
    servings: int = Field(..., gt=0)
    difficulty: str
    cuisine: str
    dietary_tags: List[str] = []
    nutrition: NutritionSchema
    image_url: Optional[str] = None

class RecipeCreate(RecipeBase):
    pass

class RecipeUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1)
    description: Optional[str] = None
    ingredients: Optional[List[str]] = None
    instructions: Optional[List[str]] = None
    cooking_time_minutes: Optional[int] = Field(None, gt=0)
    servings: Optional[int] = Field(None, gt=0)
    difficulty: Optional[str] = None
    cuisine: Optional[str] = None
    dietary_tags: Optional[List[str]] = None
    nutrition: Optional[NutritionSchema] = None
    image_url: Optional[str] = None

class RecipeResponse(RecipeBase):
    id: str
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True
```

---

### 3. Recipe Service  
```python::recipe_service.py::backend/app/services/recipe_service.py
from typing import List, Optional
from fastapi import HTTPException, status
from beanie import PydanticObjectId
from app.models.recipe_model import Recipe
from app.schemas.recipe_schema import RecipeCreate, RecipeUpdate

async def create_recipe(data: RecipeCreate) -> Recipe:
    _validate_recipe_data(data)
    recipe = Recipe(**data.model_dump())
    await recipe.insert()
    return recipe

async def get_recipes(
    cuisine: Optional[str] = None,
    difficulty: Optional[str] = None,
    dietary_tag: Optional[str] = None
) -> List[Recipe]:
    query = {}
    if cuisine:
        query["cuisine"] = cuisine
    if difficulty:
        query["difficulty"] = difficulty
    if dietary_tag:
        query["dietary_tags"] = dietary_tag
    return await Recipe.find(query).to_list()

async def get_recipe(recipe_id: str) -> Recipe:
    recipe = await Recipe.get(recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe

async def update_recipe(recipe_id: str, data: RecipeUpdate) -> Recipe:
    recipe = await get_recipe(recipe_id)
    update_data = data.model_dump(exclude_unset=True)
    if update_data:
        _validate_recipe_data_partial(update_data)
        for field, value in update_data.items():
            setattr(recipe, field, value)
        recipe.updated_at = recipe.updated_at.now()
        await recipe.save()
    return recipe

async def delete_recipe(recipe_id: str) -> None:
    recipe = await get_recipe(recipe_id)
    await recipe.delete()

def _validate_recipe_data(data):
    if not data.title.strip():
        raise HTTPException(status_code=400, detail="Title cannot be empty")
    if not data.ingredients or not all(i.strip() for i in data.ingredients):
        raise HTTPException(status_code=400, detail="Ingredients cannot be empty")
    if not data.instructions or not all(i.strip() for i in data.instructions):
        raise HTTPException(status_code=400, detail="Instructions cannot be empty")
    if data.cooking_time_minutes <= 0:
        raise HTTPException(status_code=400, detail="Cooking time must be positive")
    if data.servings <= 0:
        raise HTTPException(status_code=400, detail="Servings must be positive")

def _validate_recipe_data_partial(data):
    if "title" in data and not data["title"].strip():
        raise HTTPException(status_code=400, detail="Title cannot be empty")
    if "ingredients" in data and (not data["ingredients"] or not all(i.strip() for i in data["ingredients"])):
        raise HTTPException(status_code=400, detail="Ingredients cannot be empty")
    if "instructions" in data and (not data["instructions"] or not all(i.strip() for i in data["instructions"])):
        raise HTTPException(status_code=400, detail="Instructions cannot be empty")
    if "cooking_time_minutes" in data and data["cooking_time_minutes"] <= 0:
        raise HTTPException(status_code=400, detail="Cooking time must be positive")
    if "servings" in data and data["servings"] <= 0:
        raise HTTPException(status_code=400, detail="Servings must be positive")
```

---

### 4. Recipe API  
```python::recipe_api.py::backend/app/api/recipe_api.py
from fastapi import APIRouter, Query, status
from typing import List, Optional

from app.schemas.recipe_schema import RecipeCreate, RecipeUpdate, RecipeResponse
from app.services.recipe_service import (
    create_recipe, get_recipes, get_recipe, update_recipe, delete_recipe
)

router = APIRouter(prefix="/recipes", tags=["recipes"])

@router.post("/", response_model=RecipeResponse, status_code=status.HTTP_201_CREATED)
async def create_recipe_endpoint(recipe: RecipeCreate):
    created = await create_recipe(recipe)
    return RecipeResponse.model_validate(created)

@router.get("/", response_model=List[RecipeResponse])
async def list_recipes(
    cuisine: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    dietary_tag: Optional[str] = Query(None)
):
    recipes = await get_recipes(cuisine, difficulty, dietary_tag)
    return [RecipeResponse.model_validate(r) for r in recipes]

@router.get("/{recipe_id}", response_model=RecipeResponse)
async def get_recipe_endpoint(recipe_id: str):
    recipe = await get_recipe(recipe_id)
    return RecipeResponse.model_validate(recipe)

@router.put("/{recipe_id}", response_model=RecipeResponse)
async def update_recipe_endpoint(recipe_id: str, data: RecipeUpdate):
    updated = await update_recipe(recipe_id, data)
    return RecipeResponse.model_validate(updated)

@router.delete("/{recipe_id}", status_code=status.HTTP_200_OK)
async def delete_recipe_endpoint(recipe_id: str):
    await delete_recipe(recipe_id)
    return {"message": "Recipe deleted successfully"}
```

---

### 5. Update MongoDB Registration  
```python::mongodb.py::backend/app/database/mongodb.py
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from app.models.recipe_model import Recipe

async def init_db():
    client = AsyncIOMotorClient("mongodb+srv://<your-connection-string>")
    await init_beanie(
        database=client.get_default_database(),
        document_models=[Recipe]
    )
```

---

### 6. Register Router in main.py  
```python::main.py::backend/app/main.py
from fastapi import FastAPI
from app.api.recipe_api import router as recipe_router
from app.database.mongodb import init_db

app = FastAPI()

@app.on_event("startup")
async def on_startup():
    await init_db()

app.include_router(recipe_router)
```

---

### 7. Basic API Tests  
```python::test_recipe_api.py::backend/app/tests/test_recipe_api.py
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_create_recipe():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        payload = {
            "title": "Test Recipe",
            "description": "Test Desc",
            "ingredients": ["Egg", "Salt"],
            "instructions": ["Mix", "Cook"],
            "cooking_time_minutes": 10,
            "servings": 2,
            "difficulty": "Easy",
            "cuisine": "French",
            "dietary_tags": ["vegetarian"],
            "nutrition": {"calories": 100, "protein": 5, "carbohydrates": 10, "fat": 2},
            "image_url": None
        }
        resp = await ac.post("/recipes/", json=payload)
        assert resp.status_code == 201
        data = resp.json()
        assert data["title"] == "Test Recipe"
        assert data["servings"] == 2

@pytest.mark.asyncio
async def test_get_recipe_not_found():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.get("/recipes/invalidid")
        assert resp.status_code == 404

# Additional tests for update, delete, and retrieval can be added similarly.
```

---

### 8. requirements.txt (additions)
```Code::requirements.txt::backend/requirements.txt
fastapi==0.110.0
beanie==1.23.6
pydantic==2.7.1
motor==3.4.0
pytest==8.2.1
httpx==0.27.0
```

---

**Explanation:**  
- Models and schemas are strictly separated to avoid leaking Beanie internals.
- All business logic and validation are in the service layer, not in routes.
- Async/await is used everywhere; error handling follows requirements.
- Tests use httpx and pytest-asyncio for async FastAPI endpoints.
- MongoDB and router registration are minimal and production-ready.
- For production, secure your MongoDB connection string and consider more granular error logging.

Let me know if you want full test coverage or further enhancements!




 

 <summary><span class='reference'> Sources-Repos/Files: </span> </summary>
  
 - Selected context
### User:
next prompt attached
### Slingshot:
**Summary:**
- Implements AI-powered recipe generation as per requirements in [recipe_generation.md](Desktop/nutrichefai/.slingshot/prompts/recipe_generation.md).
- Adds new API, schemas, service, utility, and tests; updates main.py for router registration.
- Follows clean architecture, async, Pydantic v2, and FastAPI best practices.

---

```python::recipe_generation_schema.py::backend/app/schemas/recipe_generation_schema.py
from typing import List, Optional
from pydantic import BaseModel, Field

class RecipeGenerationRequest(BaseModel):
    ingredients: List[str] = Field(..., min_items=1)
    cuisine: Optional[str] = None
    diet: Optional[str] = None
    max_cooking_time: Optional[int] = Field(None, gt=0)
    servings: Optional[int] = Field(None, gt=0)
    additional_instructions: Optional[str] = None

class NutritionSchema(BaseModel):
    calories: float = Field(..., ge=0)
    protein: float = Field(..., ge=0)
    carbohydrates: float = Field(..., ge=0)
    fat: float = Field(..., ge=0)

class RecipeGenerationResponse(BaseModel):
    title: str
    description: Optional[str] = None
    ingredients: List[str]
    instructions: List[str]
    cooking_time_minutes: int
    servings: int
    difficulty: str
    cuisine: Optional[str] = None
    dietary_tags: List[str] = []
    nutrition: NutritionSchema
    image_prompt: Optional[str] = None
```

---

```python::prompt_builder.py::backend/app/utils/prompt_builder.py
from typing import List, Optional

def build_recipe_generation_prompt(
    ingredients: List[str],
    cuisine: Optional[str] = None,
    diet: Optional[str] = None,
    max_cooking_time: Optional[int] = None,
    servings: Optional[int] = None,
    additional_instructions: Optional[str] = None,
) -> str:
    prompt = (
        "You are a professional chef AI. Generate a realistic, detailed recipe in JSON format. "
        "Use only the provided ingredients. Avoid hallucinated or unavailable items. "
        "Output must be valid JSON with these fields: "
        "title, description, ingredients, instructions, cooking_time_minutes, servings, difficulty, "
        "cuisine, dietary_tags, nutrition (with calories, protein, carbohydrates, fat), image_prompt (optional)."
    )
    prompt += f"\nIngredients: {', '.join(ingredients)}."
    if cuisine:
        prompt += f"\nCuisine: {cuisine}."
    if diet:
        prompt += f"\nDiet: {diet}."
    if max_cooking_time:
        prompt += f"\nMax cooking time: {max_cooking_time} minutes."
    if servings:
        prompt += f"\nServings: {servings}."
    if additional_instructions:
        prompt += f"\nAdditional instructions: {additional_instructions}."
    prompt += (
        "\nRespond ONLY with the JSON object. Do not include explanations or extra text."
        "\nEnsure the recipe is practical and the nutrition fields are realistic."
    )
    return prompt
```

---

```python::recipe_generation_service.py::backend/app/services/recipe_generation_service.py
import json
from typing import Any, Dict
from fastapi import HTTPException, status
from app.schemas.recipe_generation_schema import (
    RecipeGenerationRequest,
    RecipeGenerationResponse,
)
from app.utils.prompt_builder import build_recipe_generation_prompt

# Placeholder for AI provider call; replace with actual provider logic
async def call_ai_provider(prompt: str) -> str:
    # Example: Replace with OpenAI, Gemini, Claude, etc.
    raise NotImplementedError("AI provider integration not implemented.")

async def generate_recipe(request: RecipeGenerationRequest) -> RecipeGenerationResponse:
    if not request.ingredients or not all(i.strip() for i in request.ingredients):
        raise HTTPException(status_code=400, detail="Ingredients list cannot be empty.")

    prompt = build_recipe_generation_prompt(
        ingredients=request.ingredients,
        cuisine=request.cuisine,
        diet=request.diet,
        max_cooking_time=request.max_cooking_time,
        servings=request.servings,
        additional_instructions=request.additional_instructions,
    )

    try:
        ai_response = await call_ai_provider(prompt)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI provider error: {str(e)}")

    try:
        recipe_data = json.loads(ai_response)
    except Exception:
        raise HTTPException(status_code=502, detail="Malformed AI response (not valid JSON).")

    # Validate required fields
    required_fields = [
        "title", "ingredients", "instructions", "cooking_time_minutes",
        "servings", "difficulty", "nutrition"
    ]
    for field in required_fields:
        if field not in recipe_data or not recipe_data[field]:
            raise HTTPException(status_code=502, detail=f"Missing or empty field in AI response: {field}")

    # Validate nutrition
    nutrition = recipe_data["nutrition"]
    for n_field in ["calories", "protein", "carbohydrates", "fat"]:
        if n_field not in nutrition:
            raise HTTPException(status_code=502, detail=f"Missing nutrition field: {n_field}")

    # Validate positive numbers
    if recipe_data["cooking_time_minutes"] <= 0 or recipe_data["servings"] <= 0:
        raise HTTPException(status_code=502, detail="Cooking time and servings must be positive.")

    # Final schema validation
    try:
        return RecipeGenerationResponse.model_validate(recipe_data)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Invalid recipe structure: {str(e)}")
```

---

```python::recipe_generation_api.py::backend/app/api/recipe_generation_api.py
from fastapi import APIRouter, status
from app.schemas.recipe_generation_schema import (
    RecipeGenerationRequest,
    RecipeGenerationResponse,
)
from app.services.recipe_generation_service import generate_recipe

router = APIRouter(prefix="/recipes/generate", tags=["ai-recipe-generation"])

@router.post(
    "/",
    response_model=RecipeGenerationResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate a recipe using AI based on user preferences and ingredients.",
)
async def generate_recipe_endpoint(request: RecipeGenerationRequest):
    return await generate_recipe(request)
```

---

```python::test_recipe_generation_api.py::backend/app/tests/test_recipe_generation_api.py
import pytest
from httpx import AsyncClient
from fastapi import FastAPI
from app.api.recipe_generation_api import router as ai_router

app = FastAPI()
app.include_router(ai_router)

@pytest.mark.asyncio
async def test_generate_recipe_success(monkeypatch):
    async def mock_call_ai_provider(prompt):
        return '''
        {
            "title": "Test AI Recipe",
            "description": "A test recipe generated by AI.",
            "ingredients": ["Egg", "Salt"],
            "instructions": ["Mix", "Cook"],
            "cooking_time_minutes": 10,
            "servings": 2,
            "difficulty": "Easy",
            "cuisine": "French",
            "dietary_tags": ["vegetarian"],
            "nutrition": {"calories": 100, "protein": 5, "carbohydrates": 10, "fat": 2},
            "image_prompt": "Eggs and salt on a plate"
        }
        '''
    from app.services import recipe_generation_service
    monkeypatch.setattr(recipe_generation_service, "call_ai_provider", mock_call_ai_provider)

    async with AsyncClient(app=app, base_url="http://test") as ac:
        payload = {
            "ingredients": ["Egg", "Salt"],
            "cuisine": "French",
            "diet": "vegetarian",
            "max_cooking_time": 15,
            "servings": 2,
            "additional_instructions": "Make it simple"
        }
        resp = await ac.post("/recipes/generate/", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert data["title"] == "Test AI Recipe"
        assert data["servings"] == 2

@pytest.mark.asyncio
async def test_generate_recipe_invalid_request():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        payload = {
            "ingredients": []
        }
        resp = await ac.post("/recipes/generate/", json=payload)
        assert resp.status_code == 422  # Pydantic validation error

@pytest.mark.asyncio
async def test_generate_recipe_provider_failure(monkeypatch):
    async def mock_call_ai_provider(prompt):
        raise Exception("Provider down")
    from app.services import recipe_generation_service
    monkeypatch.setattr(recipe_generation_service, "call_ai_provider", mock_call_ai_provider)

    async with AsyncClient(app=app, base_url="http://test") as ac:
        payload = {
            "ingredients": ["Egg"]
        }
        resp = await ac.post("/recipes/generate/", json=payload)
        assert resp.status_code == 502
        assert "AI provider error" in resp.json()["detail"]

@pytest.mark.asyncio
async def test_generate_recipe_malformed_response(monkeypatch):
    async def mock_call_ai_provider(prompt):
        return "not a json"
    from app.services import recipe_generation_service
    monkeypatch.setattr(recipe_generation_service, "call_ai_provider", mock_call_ai_provider)

    async with AsyncClient(app=app, base_url="http://test") as ac:
        payload = {
            "ingredients": ["Egg"]
        }
        resp = await ac.post("/recipes/generate/", json=payload)
        assert resp.status_code == 502
        assert "Malformed AI response" in resp.json()["detail"]
```

---

```python::main.py::backend/app/main.py
from fastapi import FastAPI
from app.api.recipe_api import router as recipe_router
from app.api.recipe_generation_api import router as ai_recipe_router
from app.database.mongodb import init_db

app = FastAPI()

@app.on_event("startup")
async def on_startup():
    await init_db()

app.include_router(recipe_router)
app.include_router(ai_recipe_router)
```

---

```Code::requirements.txt::backend/requirements.txt
fastapi==0.110.0
beanie==1.23.6
pydantic==2.7.1
motor==3.4.0
pytest==8.2.1
httpx==0.27.0
```

---

**Explanation:**  
- All business logic is in the service layer; API routes are thin and async.
- Prompt builder is isolated for future extensibility and provider swap.
- Tests cover success, invalid input, provider failure, and malformed response.
- AI provider call is abstracted for easy replacement (implement as needed).
- No persistence of generated recipes, as required.

Let me know if you want a sample AI provider implementation or further enhancements!




 

 <summary><span class='reference'> Sources-Repos/Files: </span> </summary>
  
 - Selected context
