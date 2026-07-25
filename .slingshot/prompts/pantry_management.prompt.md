## Objective

Implement a complete pantry management feature for NutriChef AI that allows users to track food items, quantities, expiration dates, and locations. The implementation must follow Clean Architecture principles with proper layer separation.

## Context

**Tech Stack:**
- Python 3.11
- FastAPI for RESTful API endpoints
- Beanie ODM for MongoDB document modeling
- PyMongo Async for database operations
- Pydantic v2 for request/response schemas
- MongoDB for data persistence

**Architecture Layers:**
- API Layer: `backend/app/api/pantry.py`
- Service Layer: `backend/app/services/pantry_service.py`
- Model Layer: `backend/app/models/pantry.py`
- Schema Layer: `backend/app/schemas/pantry.py`

**Related Files:**
- Database configuration: `backend/app/database/mongodb.py`
- Application settings: `backend/app/config/settings.py`

## Instructions

### Step 1: Search Existing Codebase
- Use @Workspace to search for existing pantry-related implementations
- Check for reusable patterns in other feature modules (recipes, users, meal plans)
- Identify existing database connection and configuration code

### Step 2: Create Database Model
- Define Beanie Document model in `backend/app/models/pantry.py`
- Include fields: item_name, quantity, unit, category, location, purchase_date, expiration_date, user_id
- Add indexes on user_id, expiration_date, and item_name for query optimization
- Use `datetime.utcnow()` for timestamp defaults

### Step 3: Create Pydantic Schemas
- Define schemas in `backend/app/schemas/pantry.py`:
  - `PantryItemCreate`: For creating new items
  - `PantryItemUpdate`: For partial updates
  - `PantryItemResponse`: For API responses
- Use Pydantic v2 field validators for quantity > 0, valid dates, non-empty strings
- Include `ConfigDict(from_attributes=True)` for response schemas

### Step 4: Implement Service Layer
- Create `backend/app/services/pantry_service.py` with async methods:
  - `create_pantry_item(item_data: PantryItemCreate) -> PantryItem`
  - `get_user_pantry_items(user_id: str) -> List[PantryItem]`
  - `update_pantry_item(item_id: str, item_data: PantryItemUpdate) -> PantryItem`
  - `delete_pantry_item(item_id: str) -> None`
  - `get_expiring_items(user_id: str, days: int) -> List[PantryItem]`
- Include proper error handling with custom exceptions

### Step 5: Create API Endpoints
- Define FastAPI router in `backend/app/api/pantry.py`
- Implement RESTful endpoints:
  - `POST /api/v1/pantry` - Create item (201 Created)
  - `GET /api/v1/pantry` - List user's items (200 OK)
  - `GET /api/v1/pantry/{item_id}` - Get single item (200 OK)
  - `PATCH /api/v1/pantry/{item_id}` - Update item (200 OK)
  - `DELETE /api/v1/pantry/{item_id}` - Delete item (204 No Content)
  - `GET /api/v1/pantry/expiring` - Get expiring items (200 OK)
- Use dependency injection for service layer
- Add proper HTTP status codes and error responses

### Step 6: Add Validation and Error Handling
- Validate user_id matches authenticated user
- Check item ownership before update/delete operations
- Return 404 for non-existent items
- Return 400 for invalid input data

### Step 7: Write Tests
- Create unit tests in `backend/app/tests/unit/test_pantry_service.py`
- Create integration tests in `backend/app/tests/integration/test_pantry_api.py`
- Test all CRUD operations, edge cases, and error scenarios
- Aim for 80%+ code coverage

## Expected Output

**Files Created:**
1. `backend/app/models/pantry.py` - Beanie Document model with indexes
2. `backend/app/schemas/pantry.py` - Pydantic v2 schemas (Create, Update, Response)
3. `backend/app/services/pantry_service.py` - Business logic layer
4. `backend/app/api/pantry.py` - FastAPI router with endpoints
5. `backend/app/tests/unit/test_pantry_service.py` - Unit tests
6. `backend/app/tests/integration/test_pantry_api.py` - Integration tests

**Code Quality:**
- PEP 8 compliant
- Type hints for all functions
- Google-style docstrings
- Async/await for all I/O operations
- Maximum 100 characters per line

**Documentation:**
- FastAPI auto-generated docs at `/docs`
- Inline comments for complex business logic
- README updates if necessary

## Constraints

- **MUST** preserve existing project structure and infrastructure
- **MUST** use async/await for all database operations
- **MUST** follow Clean Architecture with clear layer separation
- **MUST** reuse existing database connection and configuration
- **MUST NOT** create duplicate code - search @Workspace first
- **MUST NOT** replace existing working code unless explicitly requested
- **MUST** use Pydantic v2 syntax (ConfigDict, field_validator)
- **MUST** include proper error handling and validation

## Notes

- Consider adding search/filter functionality for pantry items
- Implement pagination for large pantry inventories
- Add sorting options (by expiration date, name, category)
- Consider barcode scanning integration for future enhancement
- Ensure proper timezone handling for dates (use UTC)
- Add logging for debugging and monitoring
- Consider implementing soft deletes instead of hard deletes
- Plan for future features: shopping list generation from low stock items