## Objective

Implement AI-powered recipe generation that creates personalized recipes based on user's pantry items, dietary preferences, and cooking constraints using external AI APIs.

## Context

**Tech Stack:**
- Python 3.11
- FastAPI for API endpoints
- Beanie ODM for storing generated recipes
- External AI API (OpenAI, Anthropic, or similar)
- Redis for caching (optional)
- Pydantic v2 for validation

**Architecture:**
- API: `backend/app/api/recipe_generation.py`
- Service: `backend/app/services/recipe_generation_service.py`
- External Client: `backend/app/clients/ai_client.py`
- Schema: `backend/app/schemas/recipe_generation.py`

**Integration Points:**
- Pantry service for available ingredients
- Recipe service for saving generated recipes
- User preferences for dietary restrictions

## Instructions

### Step 1: Research Existing Integrations
- Search @Workspace for existing external API clients
- Check for HTTP client utilities (httpx, aiohttp)
- Identify existing error handling patterns

### Step 2: Create AI Client
- Implement `backend/app/clients/ai_client.py`
- Create async client for AI API (OpenAI/Anthropic)
- Methods:
  - `generate_recipe(ingredients: List[str], preferences: dict) -> dict`
  - `parse_recipe_response(response: str) -> RecipeData`
- Handle API errors, timeouts, rate limits
- Implement retry logic with exponential backoff

### Step 3: Define Generation Schemas
- Create `backend/app/schemas/recipe_generation.py`:
  - `RecipeGenerationRequest`: User input (ingredients, preferences, constraints)
  - `RecipeGenerationResponse`: Generated recipe data
  - `GenerationPreferences`: Dietary restrictions, cuisine type, difficulty, time constraints
- Validate ingredient lists are non-empty
- Validate time constraints are positive integers

### Step 4: Implement Generation Service
- Create `backend/app/services/recipe_generation_service.py`:
  - `generate_recipe_from_pantry(user_id: str, preferences: GenerationPreferences) -> Recipe`
  - `generate_recipe_from_ingredients(ingredients: List[str], preferences: GenerationPreferences) -> Recipe`
  - `refine_generated_recipe(recipe_id: str, feedback: str) -> Recipe`
- Fetch user's pantry items
- Build AI prompt with ingredients and preferences
- Call AI client and parse response
- Save generated recipe to database
- Calculate nutritional information

### Step 5: Build API Endpoints
- Create `backend/app/api/recipe_generation.py`:
  - `POST /api/v1/recipes/generate` - Generate from pantry
  - `POST /api/v1/recipes/generate/custom` - Generate from custom ingredients
  - `POST /api/v1/recipes/{recipe_id}/refine` - Refine existing generated recipe
- Include request validation
- Add response caching for identical requests

### Step 6: Implement Caching Strategy
- Cache generated recipes by ingredient hash
- Set TTL (time-to-live) for cache entries
- Invalidate cache when user preferences change
- Use Redis or in-memory cache

### Step 7: Add Error Handling
- Handle AI API failures gracefully
- Provide fallback responses or suggestions
- Log errors for monitoring
- Return user-friendly error messages
- Implement circuit breaker pattern for API resilience

### Step 8: Write Tests
- Mock AI API responses in tests
- Test error scenarios (API down, timeout, invalid response)
- Test caching behavior
- Integration tests for end-to-end flow

## Expected Output

**Files:**
1. `backend/app/clients/ai_client.py` - AI API client
2. `backend/app/schemas/recipe_generation.py` - Request/response schemas
3. `backend/app/services/recipe_generation_service.py` - Generation logic
4. `backend/app/api/recipe_generation.py` - API endpoints
5. `backend/app/config/settings.py` - Add AI API credentials
6. Test files with mocked AI responses

**Features:**
- Generate recipes from pantry items
- Generate recipes from custom ingredient lists
- Apply dietary preferences and constraints
- Cache results for performance
- Refine recipes based on user feedback
- Save generated recipes to database

## Constraints

- **MUST** handle AI API failures gracefully
- **MUST** implement retry logic with exponential backoff
- **MUST** cache responses to reduce API costs
- **MUST** validate AI-generated content before saving
- **MUST** use async HTTP clients (httpx or aiohttp)
- **MUST** store API keys in environment variables
- **MUST NOT** expose API keys in code or logs
- **MUST** implement rate limiting to prevent abuse
- **MUST** add timeout limits for AI API calls (30s max)

## Notes

- Consider implementing streaming responses for real-time generation
- Add cost tracking for AI API usage
- Implement user feedback loop to improve generations
- Consider fine-tuning AI model with user preferences over time
- Add generation history for users
- Implement A/B testing for different AI prompts
- Consider multi-model approach (try multiple AIs)
- Add content moderation for generated recipes
- Plan for scaling: queue-based processing for high load
- Consider adding recipe image generation