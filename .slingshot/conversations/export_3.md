### User:
## Objective
Implement a complete User Profile Management module for the NutriChef AI backend following the existing project architecture and coding standards.
## Project Context
NutriChef AI is a FastAPI application built using:
- Python 3.11
- FastAPI
- MongoDB
- Beanie ODM
- Pydantic v2
- Clean Architecture
- Service Layer pattern
The project already contains Pantry Management and Recipe Management modules. The new User Profile module must follow the same design patterns and project structure.
Search the existing project before generating new code and reuse existing utilities, conventions, and coding patterns wherever appropriate.
---
## Feature Requirements
Create a complete CRUD module for managing user profiles.
Each user profile represents a cooking preference or lifestyle that will later be used for personalized recipe recommendations.
Example profile types:
- Child
- Teen
- Gym Enthusiast
- Working Professional
- Senior Citizen
- Vegetarian
---
## Create
Generate the following files only if they do not already exist.
```
app/
├── api/
│   └── profile.py
├── models/
│   └── profile.py
├── schemas/
│   └── profile.py
└── services/
    └── profile_service.py
```
Do not modify unrelated modules.
---
## Profile Model
Create a Beanie document containing fields similar to:
- user_id
- profile_name
- profile_type
- dietary_preferences
- allergies
- health_goal
- favorite_cuisines
- spice_level
- created_at
- updated_at
Use appropriate validation and default values.
---
## Schemas
Generate:
- CreateProfileRequest
- UpdateProfileRequest
- ProfileResponse
Use Pydantic v2 conventions.
---
## Service Layer
Implement business logic for:
- Create Profile
- Get Profile
- Get All Profiles
- Update Profile
- Delete Profile
Keep API logic out of the service layer.
---
## API Layer
Create REST endpoints:
POST /profiles
GET /profiles
GET /profiles/{profile_id}
PUT /profiles/{profile_id}
DELETE /profiles/{profile_id}
Return proper HTTP status codes.
Use dependency injection and existing project conventions.
---
## Validation
Ensure:
- Required fields are validated.
- Invalid profile types are rejected.
- Duplicate profiles for the same user can be handled appropriately.
- Proper error handling is implemented.
---
## Code Quality
Follow:
- Clean Architecture
- SOLID principles
- Async programming
- Type hints
- PEP 8
- Reusable helper methods
- Clear naming conventions
Do not duplicate existing project code.
---
## Testing
Suggest unit tests covering:
- Profile creation
- Validation failures
- Fetch profile
- Update profile
- Delete profile
- Invalid profile type
- Duplicate profile scenarios
---
## Documentation
Generate concise docstrings for all public classes and methods.
---
## Expected Outcome
Produce a complete, production-ready User Profile Management module that integrates seamlessly with the existing NutriChef AI backend and serves as the foundation for future personalized recipe recommendation features.
### Slingshot:
**What we’ll do:**
1. Implement a production-ready User Profile Management module for NutriChef AI, following Clean Architecture and project conventions.
2. Create new files only if they do not exist: [profile.py](backend/app/api/profile.py), [profile.py](backend/app/models/profile.py), [profile.py](backend/app/schemas/profile.py), [profile_service.py](backend/app/services/profile_service.py).
3. Ensure full CRUD, validation, error handling, and docstrings, ready for integration and future personalization features.

---

### 1. Beanie Model: [profile.py](backend/app/models/profile.py)

```python::profile.py::backend/app/models/profile.py
from datetime import datetime
from typing import List, Optional

from beanie import Document, Indexed
from pydantic import Field

PROFILE_TYPES = [
    "Child",
    "Teen",
    "Gym Enthusiast",
    "Working Professional",
    "Senior Citizen",
    "Vegetarian"
]

class Profile(Document):
    """
    Beanie document representing a user profile for personalized recommendations.
    """
    user_id: Indexed(str) = Field(..., min_length=1, description="Owner user ID")
    profile_name: str = Field(..., min_length=1, max_length=50, description="Profile display name")
    profile_type: str = Field(..., description="Profile type/category")
    dietary_preferences: Optional[List[str]] = Field(default_factory=list)
    allergies: Optional[List[str]] = Field(default_factory=list)
    health_goal: Optional[str] = Field(default=None)
    favorite_cuisines: Optional[List[str]] = Field(default_factory=list)
    spice_level: Optional[str] = Field(default=None, description="e.g., Mild, Medium, Hot")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "profiles"
        indexes = [
            "user_id",
            [("user_id", 1), ("profile_name", 1)],
        ]

    class Config:
        schema_extra = {
            "example": {
                "user_id": "user123",
                "profile_name": "Healthy Dad",
                "profile_type": "Weight Loss",
                "dietary_preferences": ["Low Carb", "High Protein"],
                "allergies": ["Peanuts"],
                "health_goal": "Lose 10kg",
                "favorite_cuisines": ["Italian", "Indian"],
                "spice_level": "Medium",
            }
        }
```

---

### 2. Schemas: [profile.py](backend/app/schemas/profile.py)

```python::profile.py::backend/app/schemas/profile.py
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, ConfigDict, field_validator

PROFILE_TYPES = [
    "Child",
    "Teen",
    "Gym Enthusiast",
    "Working Professional",
    "Senior Citizen",
    "Vegetarian",
]

class CreateProfileRequest(BaseModel):
    """
    Schema for creating a new user profile.
    """
    profile_name: str = Field(..., min_length=1, max_length=50)
    profile_type: str = Field(..., description="Profile type/category")
    dietary_preferences: Optional[List[str]] = Field(default_factory=list)
    allergies: Optional[List[str]] = Field(default_factory=list)
    health_goal: Optional[str] = Field(default=None)
    favorite_cuisines: Optional[List[str]] = Field(default_factory=list)
    spice_level: Optional[str] = Field(default=None)

    @field_validator("profile_type")
    @classmethod
    def validate_profile_type(cls, v: str) -> str:
        if v not in PROFILE_TYPES:
            raise ValueError(f"Invalid profile_type: {v}. Must be one of {PROFILE_TYPES}")
        return v

class UpdateProfileRequest(BaseModel):
    """
    Schema for updating an existing user profile.
    """
    profile_name: Optional[str] = Field(default=None, min_length=1, max_length=50)
    profile_type: Optional[str] = Field(default=None)
    dietary_preferences: Optional[List[str]] = Field(default=None)
    allergies: Optional[List[str]] = Field(default=None)
    health_goal: Optional[str] = Field(default=None)
    favorite_cuisines: Optional[List[str]] = Field(default=None)
    spice_level: Optional[str] = Field(default=None)

    @field_validator("profile_type")
    @classmethod
    def validate_profile_type(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in PROFILE_TYPES:
            raise ValueError(f"Invalid profile_type: {v}. Must be one of {PROFILE_TYPES}")
        return v

class ProfileResponse(BaseModel):
    """
    Schema for returning user profile data.
    """
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    profile_name: str
    profile_type: str
    dietary_preferences: List[str]
    allergies: List[str]
    health_goal: Optional[str]
    favorite_cuisines: List[str]
    spice_level: Optional[str]
    created_at: datetime
    updated_at: datetime
```

---

### 3. Service Layer: [profile_service.py](backend/app/services/profile_service.py)

```python::profile_service.py::backend/app/services/profile_service.py
from typing import List, Optional

from beanie import PydanticObjectId
from fastapi import HTTPException, status

from app.models.profile import Profile, PROFILE_TYPES
from app.schemas.profile import (
    CreateProfileRequest,
    UpdateProfileRequest,
    ProfileResponse,
)

class ProfileService:
    """
    Business logic for user profile management.
    """

    @staticmethod
    async def create_profile(user_id: str, data: CreateProfileRequest) -> Profile:
        """
        Create a new user profile, ensuring no duplicate profile_name for the same user.
        """
        existing = await Profile.find_one(
            Profile.user_id == user_id, Profile.profile_name == data.profile_name
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Profile with name '{data.profile_name}' already exists for this user.",
            )
        profile = Profile(
            user_id=user_id,
            profile_name=data.profile_name,
            profile_type=data.profile_type,
            dietary_preferences=data.dietary_preferences,
            allergies=data.allergies,
            health_goal=data.health_goal,
            favorite_cuisines=data.favorite_cuisines,
            spice_level=data.spice_level,
        )
        await profile.insert()
        return profile

    @staticmethod
    async def get_profile(profile_id: str, user_id: str) -> Optional[Profile]:
        """
        Retrieve a profile by ID and user ID.
        """
        profile = await Profile.get(profile_id)
        if not profile or profile.user_id != user_id:
            return None
        return profile

    @staticmethod
    async def get_all_profiles(user_id: str) -> List[Profile]:
        """
        Retrieve all profiles for a user.
        """
        return await Profile.find(Profile.user_id == user_id).sort("-created_at").to_list()

    @staticmethod
    async def update_profile(
        profile_id: str, user_id: str, data: UpdateProfileRequest
    ) -> Optional[Profile]:
        """
        Update an existing profile, ensuring no duplicate profile_name for the same user.
        """
        profile = await Profile.get(profile_id)
        if not profile or profile.user_id != user_id:
            return None

        if data.profile_name and data.profile_name != profile.profile_name:
            # Check for duplicate profile_name
            existing = await Profile.find_one(
                Profile.user_id == user_id, Profile.profile_name == data.profile_name
            )
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Profile with name '{data.profile_name}' already exists for this user.",
                )

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(profile, field, value)
        profile.updated_at = profile.updated_at.now()
        await profile.save()
        return profile

    @staticmethod
    async def delete_profile(profile_id: str, user_id: str) -> bool:
        """
        Delete a profile by ID and user ID.
        """
        profile = await Profile.get(profile_id)
        if not profile or profile.user_id != user_id:
            return False
        await profile.delete()
        return True
```

---

### 4. API Layer: [profile.py](backend/app/api/profile.py)

```python::profile.py::backend/app/api/profile.py
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.schemas.profile import (
    CreateProfileRequest,
    UpdateProfileRequest,
    ProfileResponse,
)
from app.services.profile_service import ProfileService

router = APIRouter(prefix="/profiles", tags=["profiles"])

# Placeholder for user authentication dependency
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user_id(token: str = Depends(oauth2_scheme)) -> str:
    """
    Dummy user authentication. Replace with real JWT/user extraction.
    """
    # In production, decode the JWT and extract user_id
    # For now, return a fixed user_id for demonstration
    return "user123"

@router.post(
    "/",
    response_model=ProfileResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new user profile",
)
async def create_profile(
    data: CreateProfileRequest,
    user_id: str = Depends(get_current_user_id),
):
    """
    Create a new user profile for the authenticated user.
    """
    profile = await ProfileService.create_profile(user_id, data)
    return ProfileResponse.model_validate(profile)

@router.get(
    "/",
    response_model=List[ProfileResponse],
    summary="Get all user profiles",
)
async def get_profiles(user_id: str = Depends(get_current_user_id)):
    """
    Retrieve all profiles for the authenticated user.
    """
    profiles = await ProfileService.get_all_profiles(user_id)
    return [ProfileResponse.model_validate(p) for p in profiles]

@router.get(
    "/{profile_id}",
    response_model=ProfileResponse,
    summary="Get a user profile by ID",
)
async def get_profile(
    profile_id: str,
    user_id: str = Depends(get_current_user_id),
):
    """
    Retrieve a specific profile by ID for the authenticated user.
    """
    profile = await ProfileService.get_profile(profile_id, user_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found.",
        )
    return ProfileResponse.model_validate(profile)

@router.put(
    "/{profile_id}",
    response_model=ProfileResponse,
    summary="Update a user profile",
)
async def update_profile(
    profile_id: str,
    data: UpdateProfileRequest,
    user_id: str = Depends(get_current_user_id),
):
    """
    Update an existing user profile for the authenticated user.
    """
    profile = await ProfileService.update_profile(profile_id, user_id, data)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found.",
        )
    return ProfileResponse.model_validate(profile)

@router.delete(
    "/{profile_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a user profile",
)
async def delete_profile(
    profile_id: str,
    user_id: str = Depends(get_current_user_id),
):
    """
    Delete a user profile by ID for the authenticated user.
    """
    deleted = await ProfileService.delete_profile(profile_id, user_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found.",
        )
```

---

## 5. **Testing Suggestions**

Unit tests should cover:
- Successful profile creation (valid data)
- Validation failures (invalid profile_type, missing required fields)
- Fetching single and all profiles (including not found)
- Updating profile (valid, duplicate name, invalid type)
- Deleting profile (existing and non-existing)
- Duplicate profile name for same user

**Example test cases:**
- `test_create_profile_success`
- `test_create_profile_invalid_type`
- `test_create_profile_duplicate_name`
- `test_get_profile_not_found`
- `test_update_profile_duplicate_name`
- `test_delete_profile_success`
- `test_delete_profile_not_found`

Use pytest and async test patterns, with dependency injection/mocking for authentication and DB.

---

## **Key Choices & Notes**

- **Validation:** Profile type is strictly validated; duplicate profile names per user are prevented.
- **Separation:** API is thin; all business logic is in the service layer.
- **Async:** All DB operations are async.
- **Extensibility:** Easy to add new profile types or fields.
- **Security:** User ID is extracted via dependency (replace with real JWT extraction in production).

---

**This module is ready for integration and future personalization features.**  
Let me know if you need example unit tests or integration with authentication!




 

 <summary><span class='reference'> Sources-Repos/Files: </span> </summary>
  
 - Selected context
### User:
The Profile model, schemas, and service layer have already been implemented.
Generate only the FastAPI API layer.
use:
app/api/profile_api.py
Requirements:
- Reuse the existing ProfileService.
- Do not regenerate models, schemas, or services.
- Follow the same coding style as the existing Pantry and Recipe APIs.
- Use APIRouter.
- Generate the following endpoints:
POST /profiles
GET /profiles
GET /profiles/{profile_id}
PUT /profiles/{profile_id}
DELETE /profiles/{profile_id}
Use proper HTTP status codes.
Return ProfileResponse models.
Include exception handling.
Use dependency injection where appropriate.
After generating the API, indicate any changes required in:
- app/main.py
- database initialization (Beanie models)
Do not modify unrelated files.
### Slingshot:
**What we’ll do:**
- Implement only the FastAPI API layer for user profiles in [profile_api.py](backend/app/api/profile_api.py), following Pantry/Recipe API style.
- Use APIRouter, dependency injection, proper status codes, and exception handling.
- Indicate minimal changes needed in [main.py](backend/app/main.py) and Beanie model registration for integration.

---

```python::profile_api.py::backend/app/api/profile_api.py
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.schemas.profile import (
    CreateProfileRequest,
    UpdateProfileRequest,
    ProfileResponse,
)
from app.services.profile_service import ProfileService

router = APIRouter(prefix="/profiles", tags=["profiles"])

# Placeholder for user authentication dependency
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user_id(token: str = Depends(oauth2_scheme)) -> str:
    """
    Dummy user authentication. Replace with real JWT/user extraction.
    """
    # In production, decode the JWT and extract user_id
    # For now, return a fixed user_id for demonstration
    return "user123"

@router.post(
    "/",
    response_model=ProfileResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new user profile",
)
async def create_profile(
    data: CreateProfileRequest,
    user_id: str = Depends(get_current_user_id),
):
    """
    Create a new user profile for the authenticated user.
    """
    try:
        profile = await ProfileService.create_profile(user_id, data)
        return ProfileResponse.model_validate(profile)
    except HTTPException as exc:
        raise exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create profile.",
        ) from exc

@router.get(
    "/",
    response_model=List[ProfileResponse],
    summary="Get all user profiles",
)
async def get_profiles(user_id: str = Depends(get_current_user_id)):
    """
    Retrieve all profiles for the authenticated user.
    """
    try:
        profiles = await ProfileService.get_all_profiles(user_id)
        return [ProfileResponse.model_validate(p) for p in profiles]
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve profiles.",
        ) from exc

@router.get(
    "/{profile_id}",
    response_model=ProfileResponse,
    summary="Get a user profile by ID",
)
async def get_profile(
    profile_id: str,
    user_id: str = Depends(get_current_user_id),
):
    """
    Retrieve a specific profile by ID for the authenticated user.
    """
    try:
        profile = await ProfileService.get_profile(profile_id, user_id)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found.",
            )
        return ProfileResponse.model_validate(profile)
    except HTTPException as exc:
        raise exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve profile.",
        ) from exc

@router.put(
    "/{profile_id}",
    response_model=ProfileResponse,
    summary="Update a user profile",
)
async def update_profile(
    profile_id: str,
    data: UpdateProfileRequest,
    user_id: str = Depends(get_current_user_id),
):
    """
    Update an existing user profile for the authenticated user.
    """
    try:
        profile = await ProfileService.update_profile(profile_id, user_id, data)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found.",
            )
        return ProfileResponse.model_validate(profile)
    except HTTPException as exc:
        raise exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update profile.",
        ) from exc

@router.delete(
    "/{profile_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a user profile",
)
async def delete_profile(
    profile_id: str,
    user_id: str = Depends(get_current_user_id),
):
    """
    Delete a user profile by ID for the authenticated user.
    """
    try:
        deleted = await ProfileService.delete_profile(profile_id, user_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found.",
            )
    except HTTPException as exc:
        raise exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete profile.",
        ) from exc
```

---

### **Integration Steps**

**1. [main.py](backend/app/main.py):**
- Import and include the new router:
  ```python
  from app.api.profile_api import router as profile_router

  app.include_router(profile_router)
  ```

**2. Database Initialization (Beanie Models):**
- Ensure the Profile model is registered in your Beanie initialization (usually in [mongodb.py](backend/app/database/mongodb.py) or similar):
  ```python
  from app.models.profile import Profile

  await init_beanie(
      database=client[settings.DATABASE_NAME],
      document_models=[..., Profile],  # Add Profile to the list
  )
  ```

---

**Key Choices & Notes:**
- API layer is thin, delegates all business logic to the service layer.
- Consistent with Pantry/Recipe API style: uses APIRouter, dependency injection, and proper status codes.
- Exception handling ensures correct HTTP responses and hides internal errors.
- Replace `get_current_user_id` with real authentication logic in production.

_No unrelated files were modified._




 

 <summary><span class='reference'> Sources-Repos/Files: </span> </summary>
  
 - Selected context
### User:
Refactor the existing User Profile Management implementation based on the following changes.
Do not regenerate the feature from scratch. Modify only the existing Profile module.
Required changes:
1. Remove all authentication-related code.
   - Remove OAuth2PasswordBearer.
   - Remove get_current_user_id().
   - Remove all Depends(user_id) dependencies.
   - Do not introduce JWT or authentication.
2. NutriChef AI is a single-user application.
   - Remove user_id from the Profile model.
   - Remove all user_id checks from the service layer.
   - Remove user_id parameters from all service methods.
3. Rename fields:
   - profile_name → name
   - profile_type → category
4. Update CRUD operations accordingly.
   - POST /profiles
   - GET /profiles
   - GET /profiles/{profile_id}
   - PUT /profiles/{profile_id}
   - DELETE /profiles/{profile_id}
5. Keep duplicate name validation.
   Two cooking profiles should not have the same name.
6. The Profile represents a Cooking Profile, not a user account.
   Example categories:
   - Child
   - Teen
   - Gym Enthusiast
   - Working Professional
   - Senior Citizen
   - Vegetarian
7. Follow the existing Pantry and Recipe API style and keep the implementation consistent with the rest of the project.
8. Use timezone-aware timestamps and Pydantic v2 best practices wherever necessary.
Generate only the files that require modification. Do not modify unrelated modules.
### Slingshot:
**Summary of changes:**
- Remove all authentication and user_id logic (single-user app).
- Rename `profile_name` → `name`, `profile_type` → `category` everywhere.
- Update all CRUD endpoints and service calls accordingly.
- Preserve duplicate name validation.
- Ensure timezone-aware timestamps and Pydantic v2 best practices.
- Only modify files in the Profile module.

---

### 1. [profile.py](backend/app/models/profile.py)

```python::profile.py::backend/app/models/profile.py
from datetime import datetime, timezone
from typing import List, Optional

from beanie import Document
from pydantic import Field

PROFILE_CATEGORIES = [
    "Child",
    "Teen",
    "Gym Enthusiast",
    "Working Professional",
    "Senior Citizen",
    "Vegetarian",
]

class Profile(Document):
    """
    Beanie document representing a cooking profile for personalized recommendations.
    """
    name: str = Field(..., min_length=1, max_length=50, description="Profile display name")
    category: str = Field(..., description="Profile category")
    dietary_preferences: Optional[List[str]] = Field(default_factory=list)
    allergies: Optional[List[str]] = Field(default_factory=list)
    health_goal: Optional[str] = Field(default=None)
    favorite_cuisines: Optional[List[str]] = Field(default_factory=list)
    spice_level: Optional[str] = Field(default=None, description="e.g., Mild, Medium, Hot")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "profiles"
        indexes = [
            "name",  # For duplicate name validation
        ]

    class Config:
        schema_extra = {
            "example": {
                "name": "Healthy Dad",
                "category": "Working Professional",
                "dietary_preferences": ["Low Carb", "High Protein"],
                "allergies": ["Peanuts"],
                "health_goal": "Lose 10kg",
                "favorite_cuisines": ["Italian", "Indian"],
                "spice_level": "Medium",
            }
        }
```

---

### 2. [profile.py](backend/app/schemas/profile.py)

```python::profile.py::backend/app/schemas/profile.py
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, ConfigDict, field_validator

PROFILE_CATEGORIES = [
    "Child",
    "Teen",
    "Gym Enthusiast",
    "Working Professional",
    "Senior Citizen",
    "Vegetarian",
]

class CreateProfileRequest(BaseModel):
    """
    Schema for creating a new cooking profile.
    """
    name: str = Field(..., min_length=1, max_length=50)
    category: str = Field(..., description="Profile category")
    dietary_preferences: Optional[List[str]] = Field(default_factory=list)
    allergies: Optional[List[str]] = Field(default_factory=list)
    health_goal: Optional[str] = Field(default=None)
    favorite_cuisines: Optional[List[str]] = Field(default_factory=list)
    spice_level: Optional[str] = Field(default=None)

    @field_validator("category")
    @classmethod
    def validate_category(cls, v: str) -> str:
        if v not in PROFILE_CATEGORIES:
            raise ValueError(f"Invalid category: {v}. Must be one of {PROFILE_CATEGORIES}")
        return v

class UpdateProfileRequest(BaseModel):
    """
    Schema for updating an existing cooking profile.
    """
    name: Optional[str] = Field(default=None, min_length=1, max_length=50)
    category: Optional[str] = Field(default=None)
    dietary_preferences: Optional[List[str]] = Field(default=None)
    allergies: Optional[List[str]] = Field(default=None)
    health_goal: Optional[str] = Field(default=None)
    favorite_cuisines: Optional[List[str]] = Field(default=None)
    spice_level: Optional[str] = Field(default=None)

    @field_validator("category")
    @classmethod
    def validate_category(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in PROFILE_CATEGORIES:
            raise ValueError(f"Invalid category: {v}. Must be one of {PROFILE_CATEGORIES}")
        return v

class ProfileResponse(BaseModel):
    """
    Schema for returning cooking profile data.
    """
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    category: str
    dietary_preferences: List[str]
    allergies: List[str]
    health_goal: Optional[str]
    favorite_cuisines: List[str]
    spice_level: Optional[str]
    created_at: datetime
    updated_at: datetime
```

---

### 3. [profile_service.py](backend/app/services/profile_service.py)

```python::profile_service.py::backend/app/services/profile_service.py
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import HTTPException, status

from app.models.profile import Profile, PROFILE_CATEGORIES
from app.schemas.profile import (
    CreateProfileRequest,
    UpdateProfileRequest,
)

class ProfileService:
    """
    Business logic for cooking profile management (single-user).
    """

    @staticmethod
    async def create_profile(data: CreateProfileRequest) -> Profile:
        """
        Create a new cooking profile, ensuring no duplicate name.
        """
        existing = await Profile.find_one(Profile.name == data.name)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Profile with name '{data.name}' already exists.",
            )
        profile = Profile(
            name=data.name,
            category=data.category,
            dietary_preferences=data.dietary_preferences,
            allergies=data.allergies,
            health_goal=data.health_goal,
            favorite_cuisines=data.favorite_cuisines,
            spice_level=data.spice_level,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        await profile.insert()
        return profile

    @staticmethod
    async def get_profile(profile_id: str) -> Optional[Profile]:
        """
        Retrieve a profile by ID.
        """
        return await Profile.get(profile_id)

    @staticmethod
    async def get_all_profiles() -> List[Profile]:
        """
        Retrieve all cooking profiles.
        """
        return await Profile.find_all().sort("-created_at").to_list()

    @staticmethod
    async def update_profile(
        profile_id: str, data: UpdateProfileRequest
    ) -> Optional[Profile]:
        """
        Update an existing profile, ensuring no duplicate name.
        """
        profile = await Profile.get(profile_id)
        if not profile:
            return None

        if data.name and data.name != profile.name:
            # Check for duplicate name
            existing = await Profile.find_one(Profile.name == data.name)
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Profile with name '{data.name}' already exists.",
                )

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(profile, field, value)
        profile.updated_at = datetime.now(timezone.utc)
        await profile.save()
        return profile

    @staticmethod
    async def delete_profile(profile_id: str) -> bool:
        """
        Delete a profile by ID.
        """
        profile = await Profile.get(profile_id)
        if not profile:
            return False
        await profile.delete()
        return True
```

---

### 4. [profile_api.py](backend/app/api/profile_api.py)

```python::profile_api.py::backend/app/api/profile_api.py
from typing import List

from fastapi import APIRouter, HTTPException, status

from app.schemas.profile import (
    CreateProfileRequest,
    UpdateProfileRequest,
    ProfileResponse,
)
from app.services.profile_service import ProfileService

router = APIRouter(prefix="/profiles", tags=["profiles"])

@router.post(
    "/",
    response_model=ProfileResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new cooking profile",
)
async def create_profile(
    data: CreateProfileRequest,
):
    """
    Create a new cooking profile.
    """
    try:
        profile = await ProfileService.create_profile(data)
        return ProfileResponse.model_validate(profile)
    except HTTPException as exc:
        raise exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create profile.",
        ) from exc

@router.get(
    "/",
    response_model=List[ProfileResponse],
    summary="Get all cooking profiles",
)
async def get_profiles():
    """
    Retrieve all cooking profiles.
    """
    try:
        profiles = await ProfileService.get_all_profiles()
        return [ProfileResponse.model_validate(p) for p in profiles]
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve profiles.",
        ) from exc

@router.get(
    "/{profile_id}",
    response_model=ProfileResponse,
    summary="Get a cooking profile by ID",
)
async def get_profile(
    profile_id: str,
):
    """
    Retrieve a specific cooking profile by ID.
    """
    try:
        profile = await ProfileService.get_profile(profile_id)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found.",
            )
        return ProfileResponse.model_validate(profile)
    except HTTPException as exc:
        raise exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve profile.",
        ) from exc

@router.put(
    "/{profile_id}",
    response_model=ProfileResponse,
    summary="Update a cooking profile",
)
async def update_profile(
    profile_id: str,
    data: UpdateProfileRequest,
):
    """
    Update an existing cooking profile.
    """
    try:
        profile = await ProfileService.update_profile(profile_id, data)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found.",
            )
        return ProfileResponse.model_validate(profile)
    except HTTPException as exc:
        raise exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update profile.",
        ) from exc

@router.delete(
    "/{profile_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a cooking profile",
)
async def delete_profile(
    profile_id: str,
):
    """
    Delete a cooking profile by ID.
    """
    try:
        deleted = await ProfileService.delete_profile(profile_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found.",
            )
    except HTTPException as exc:
        raise exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete profile.",
        ) from exc
```

---

## Key Refactor Notes

- **Authentication/user_id**: All removed; single-user logic only.
- **Field renaming**: `profile_name` → `name`, `profile_type` → `category` everywhere.
- **Duplicate name validation**: Still enforced at service layer.
- **Timestamps**: Now timezone-aware (`datetime.now(timezone.utc)`).
- **API/Service/Model**: All updated for new field names and single-user logic.
- **Consistency**: API style matches Pantry/Recipe modules.

---

**No design pattern introduced beyond standard service separation.  
No architectural changes—local refactor only.  
No unrelated files modified.**

---

**If you need test updates or integration notes for [main.py](backend/app/main.py) or Beanie model registration, let me know!**




 

 <summary><span class='reference'> Sources-Repos/Files: </span> </summary>
  
 - Selected context
### User:
keeep in mind the nomenclature i am using profile_api or profile_schema, recreate ans
### Slingshot:
**What we’ll do:**
- Recreate the API layer using your requested nomenclature: `profile_api` for the API module and `profile_schema` for Pydantic schemas.
- Use only the API layer ([profile_api.py](backend/app/api/profile_api.py)), reusing the existing `ProfileService` and following project conventions.
- Ensure all references, imports, and docstrings use the correct names.

---

```python::profile_api.py::backend/app/api/profile_api.py
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.profile_schema import (
    CreateProfileRequest,
    UpdateProfileRequest,
    ProfileResponse,
)
from app.services.profile_service import ProfileService

router = APIRouter(prefix="/profiles", tags=["profiles"])

@router.post(
    "/",
    response_model=ProfileResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new cooking profile",
)
async def create_profile(
    data: CreateProfileRequest,
):
    """
    Create a new cooking profile.
    """
    try:
        profile = await ProfileService.create_profile(data)
        return ProfileResponse.model_validate(profile)
    except HTTPException as exc:
        raise exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create profile.",
        ) from exc

@router.get(
    "/",
    response_model=List[ProfileResponse],
    summary="Get all cooking profiles",
)
async def get_profiles():
    """
    Retrieve all cooking profiles.
    """
    try:
        profiles = await ProfileService.get_all_profiles()
        return [ProfileResponse.model_validate(p) for p in profiles]
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve profiles.",
        ) from exc

@router.get(
    "/{profile_id}",
    response_model=ProfileResponse,
    summary="Get a cooking profile by ID",
)
async def get_profile(
    profile_id: str,
):
    """
    Retrieve a specific cooking profile by ID.
    """
    try:
        profile = await ProfileService.get_profile(profile_id)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found.",
            )
        return ProfileResponse.model_validate(profile)
    except HTTPException as exc:
        raise exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve profile.",
        ) from exc

@router.put(
    "/{profile_id}",
    response_model=ProfileResponse,
    summary="Update a cooking profile",
)
async def update_profile(
    profile_id: str,
    data: UpdateProfileRequest,
):
    """
    Update an existing cooking profile.
    """
    try:
        profile = await ProfileService.update_profile(profile_id, data)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found.",
            )
        return ProfileResponse.model_validate(profile)
    except HTTPException as exc:
        raise exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update profile.",
        ) from exc

@router.delete(
    "/{profile_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a cooking profile",
)
async def delete_profile(
    profile_id: str,
):
    """
    Delete a cooking profile by ID.
    """
    try:
        deleted = await ProfileService.delete_profile(profile_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found.",
            )
    except HTTPException as exc:
        raise exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete profile.",
        ) from exc
```

---

### **Integration Notes**

- In [main.py](backend/app/main.py), import and include the router:
  ```python
  from app.api.profile_api import router as profile_router
  app.include_router(profile_router)
  ```
- Ensure your Beanie initialization includes the Profile model (typically in [mongodb.py](backend/app/database/mongodb.py)):
  ```python
  from app.models.profile import Profile
  await init_beanie(
      database=client[settings.DATABASE_NAME],
      document_models=[..., Profile],
  )
  ```

---

**Key choices:**
- All schema imports use `profile_schema`.
- API module is named `profile_api`.
- Style, error handling, and return types match project conventions.
- No unrelated files were modified.

Let me know if you need the `profile_schema` or further integration help!




 

 <summary><span class='reference'> Sources-Repos/Files: </span> </summary>
  
 - Selected context
