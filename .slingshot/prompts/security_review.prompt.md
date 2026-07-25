## Objective

Conduct a thorough security audit and implement hardening measures to protect against common vulnerabilities and ensure secure application operation.

## Context

**Tech Stack:**
- FastAPI for API framework
- MongoDB for data storage
- JWT for authentication
- Pydantic v2 for validation

**Security Areas:**
- Authentication and authorization
- Input validation and sanitization
- NoSQL injection prevention
- Secrets management
- CORS configuration
- Rate limiting

## Instructions

### Step 1: Authentication Security

**JWT Token Implementation:**
```python
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hash password using bcrypt."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash."""
    return pwd_context.verify(plain_password, hashed_password)

# JWT token creation
SECRET_KEY = settings.SECRET_KEY  # From environment variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token."""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Token validation
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """Validate JWT token and return current user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await User.get(user_id)
    if user is None:
        raise credentials_exception
    
    return user
```

### Step 2: Authorization Checks

**Role-Based Access Control:**
```python
from enum import Enum
from fastapi import Depends, HTTPException, status

class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"
    GUEST = "guest"

def require_role(required_role: UserRole):
    """Dependency to check user role."""
    async def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role != required_role and current_user.role != UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        return current_user
    return role_checker

# Usage in endpoints
@router.delete("/api/v1/users/{user_id}")
async def delete_user(
    user_id: str,
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    """Delete user (admin only)."""
    await User.get(user_id).delete()
```

**Resource Ownership Validation:**
```python
async def verify_recipe_ownership(recipe_id: str, user_id: str) -> Recipe:
    """Verify user owns the recipe."""
    recipe = await Recipe.get(recipe_id)
    
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )
    
    if recipe.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to modify this recipe"
        )
    
    return recipe

# Usage
@router.patch("/api/v1/recipes/{recipe_id}")
async def update_recipe(
    recipe_id: str,
    recipe_data: RecipeUpdate,
    current_user: User = Depends(get_current_user)
):
    recipe = await verify_recipe_ownership(recipe_id, str(current_user.id))
    # ... update logic ...
```

### Step 3: Input Validation and Sanitization

**Comprehensive Pydantic Validation:**
```python
from pydantic import BaseModel, Field, field_validator, EmailStr
import re

class UserCreate(BaseModel):
    """User creation schema with security validation."""
    email: EmailStr = Field(..., description="Valid email address")
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8, max_length=128)
    
    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        """Validate username format."""
        # Only alphanumeric and underscores
        if not re.match(r'^[a-zA-Z0-9_]+$', v):
            raise ValueError("Username can only contain letters, numbers, and underscores")
        return v.lower()
    
    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        """Validate password strength."""
        if not re.search(r'[A-Z]', v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r'[a-z]', v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r'[0-9]', v):
            raise ValueError("Password must contain at least one digit")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError("Password must contain at least one special character")
        return v
```

### Step 4: NoSQL Injection Prevention

**Safe Query Patterns:**
```python
# UNSAFE - Vulnerable to injection
async def get_user_by_email_unsafe(email: str):
    # Don't do this!
    user = await User.find_one({"email": email})
    return user

# SAFE - Using Beanie query builders
async def get_user_by_email_safe(email: str):
    """Safe query using Beanie query builder."""
    user = await User.find_one(User.email == email)
    return user

# SAFE - Validate and sanitize input
from pydantic import EmailStr

async def get_user_by_email(email: EmailStr):
    """Email validated by Pydantic before query."""
    user = await User.find_one(User.email == email)
    return user
```

### Step 5: Secrets Management

**Environment Variables:**
```python
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """Application settings from environment variables."""
    
    # Database
    MONGODB_URL: str
    DATABASE_NAME: str
    
    # Security
    SECRET_KEY: str  # For JWT signing
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # External APIs
    OPENAI_API_KEY: Optional[str] = None
    
    # CORS
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()

# Never log or expose secrets
import logging
logger = logging.getLogger(__name__)

# BAD - Don't do this!
logger.info(f"API Key: {settings.OPENAI_API_KEY}")

# GOOD - Mask secrets in logs
logger.info(f"API Key: {'*' * 8}")
```

**.env.example:**
```bash
# Database
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=nutrichef_ai

# Security (generate with: openssl rand -hex 32)
SECRET_KEY=your-secret-key-here

# External APIs
OPENAI_API_KEY=your-openai-key-here

# CORS
ALLOWED_ORIGINS=["http://localhost:3000","https://yourdomain.com"]
```

### Step 6: CORS Configuration

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,  # Specific origins, not "*"
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
    max_age=3600,  # Cache preflight requests for 1 hour
)
```

### Step 7: Rate Limiting

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Apply to endpoints
@router.post("/api/v1/auth/login")
@limiter.limit("5/minute")  # Max 5 login attempts per minute
async def login(request: Request, credentials: LoginCredentials):
    """Login endpoint with rate limiting."""
    # ... login logic ...
```

### Step 8: Security Headers

```python
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.httpsredirect import HTTPSRedirectMiddleware

# Force HTTPS in production
if settings.ENVIRONMENT == "production":
    app.add_middleware(HTTPSRedirectMiddleware)

# Trusted hosts
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS
)

# Security headers
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response
```

### Step 9: Logging and Monitoring

```python
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Log security events
@router.post("/api/v1/auth/login")
async def login(credentials: LoginCredentials):
    user = await authenticate_user(credentials.email, credentials.password)
    
    if not user:
        logger.warning(f"Failed login attempt for email: {credentials.email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    logger.info(f"Successful login for user: {user.id}")
    return {"access_token": create_access_token({"sub": str(user.id)})}
```

## Expected Output

**Security Improvements:**
- Secure authentication with JWT
- Role-based authorization
- Input validation and sanitization
- NoSQL injection prevention
- Secrets properly managed
- CORS configured correctly
- Rate limiting implemented
- Security headers added

**Security Checklist:**
- [ ] Passwords hashed with bcrypt
- [ ] JWT tokens properly validated
- [ ] Authorization checks on all protected endpoints
- [ ] Input validation with Pydantic
- [ ] NoSQL injection prevented
- [ ] Secrets in environment variables
- [ ] CORS configured (not "*")
- [ ] Rate limiting on sensitive endpoints
- [ ] Security headers implemented
- [ ] HTTPS enforced in production
- [ ] Security events logged

## Constraints

- **MUST** hash passwords with bcrypt
- **MUST** validate JWT tokens
- **MUST** check authorization before operations
- **MUST** validate all user inputs
- **MUST** use Beanie query builders (prevent injection)
- **MUST** store secrets in environment variables
- **MUST** configure CORS properly
- **MUST NOT** expose secrets in logs or errors
- **MUST NOT** use "*" for CORS origins in production
- **MUST** implement rate limiting

## Notes

- Regular security audits
- Keep dependencies updated
- Use security scanning tools (bandit, safety)
- Implement account lockout after failed attempts
- Add two-factor authentication for sensitive operations
- Encrypt sensitive data at rest
- Use HTTPS in production
- Implement audit logging
- Regular penetration testing
- Security training for team members