---
name: "Performance Optimization"
description: "Guide performance improvement through database optimization, caching, and async efficiency"
category: "Documentation & Optimization"
tags: ["performance", "optimization", "caching", "database", "async"]
---

## Objective

Identify and resolve performance bottlenecks through database query optimization, efficient caching strategies, and proper async operation implementation.

## Context

**Tech Stack:**
- Python 3.11 with async/await
- FastAPI
- Beanie ODM and MongoDB
- Redis for caching (optional)

**Performance Areas:**
- Database query optimization
- Index strategy
- Caching implementation
- Async operation efficiency
- N+1 query prevention

## Instructions

### Step 1: Identify Performance Bottlenecks

**Profiling Tools:**
```python
import cProfile
import pstats
from fastapi import Request
import time
import logging

logger = logging.getLogger(__name__)

# Middleware for request timing
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    logger.info(f"{request.method} {request.url.path} - {process_time:.3f}s")
    return response
```

**Monitoring Slow Queries:**
```python
import logging
from functools import wraps
import time

def log_slow_queries(threshold_seconds: float = 1.0):
    """Decorator to log slow database queries."""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            start = time.time()
            result = await func(*args, **kwargs)
            duration = time.time() - start
            
            if duration > threshold_seconds:
                logger.warning(
                    f"Slow query detected: {func.__name__} took {duration:.2f}s"
                )
            return result
        return wrapper
    return decorator
```

### Step 2: Database Query Optimization

#### Add Proper Indexes

**Before (Slow):**
```python
class Recipe(Document):
    title: str
    user_id: str
    created_at: datetime
    
    class Settings:
        name = "recipes"
        # No indexes defined
```

**After (Optimized):**
```python
class Recipe(Document):
    title: Indexed(str)  # Index for search
    user_id: Indexed(str)  # Index for user queries
    created_at: datetime
    
    class Settings:
        name = "recipes"
        indexes = [
            "title",
            "user_id",
            [("user_id", 1), ("created_at", -1)],  # Compound index
            [("title", "text"), ("description", "text")],  # Text search
        ]
```

#### Use Projections

**Before (Fetches all fields):**
```python
async def get_recipe_titles(user_id: str) -> List[str]:
    recipes = await Recipe.find(Recipe.user_id == user_id).to_list()
    return [recipe.title for recipe in recipes]
```

**After (Fetches only needed fields):**
```python
async def get_recipe_titles(user_id: str) -> List[str]:
    recipes = await Recipe.find(
        Recipe.user_id == user_id
    ).project(RecipeTitleProjection).to_list()
    return [recipe.title for recipe in recipes]

class RecipeTitleProjection(BaseModel):
    title: str
```

#### Prevent N+1 Queries

**Before (N+1 Problem):**
```python
async def get_recipes_with_user_info(recipe_ids: List[str]):
    recipes = []
    for recipe_id in recipe_ids:
        recipe = await Recipe.get(recipe_id)
        user = await User.get(recipe.user_id)  # N queries!
        recipes.append({"recipe": recipe, "user": user})
    return recipes
```

**After (Optimized):**
```python
async def get_recipes_with_user_info(recipe_ids: List[str]):
    # Fetch all recipes in one query
    recipes = await Recipe.find({"_id": {"$in": recipe_ids}}).to_list()
    
    # Fetch all users in one query
    user_ids = [recipe.user_id for recipe in recipes]
    users = await User.find({"_id": {"$in": user_ids}}).to_list()
    user_map = {str(user.id): user for user in users}
    
    # Combine results
    return [
        {"recipe": recipe, "user": user_map.get(recipe.user_id)}
        for recipe in recipes
    ]
```

### Step 3: Implement Caching

**Redis Cache Setup:**
```python
import redis.asyncio as redis
import json
from typing import Optional

class CacheService:
    """Redis caching service."""
    
    def __init__(self):
        self.redis = redis.from_url(settings.REDIS_URL)
    
    async def get(self, key: str) -> Optional[dict]:
        """Get cached value."""
        value = await self.redis.get(key)
        return json.loads(value) if value else None
    
    async def set(self, key: str, value: dict, ttl: int = 3600):
        """Set cached value with TTL."""
        await self.redis.setex(key, ttl, json.dumps(value))
    
    async def delete(self, key: str):
        """Delete cached value."""
        await self.redis.delete(key)

# Usage in service layer
class RecipeService:
    def __init__(self):
        self.cache = CacheService()
    
    async def get_recipe_by_id(self, recipe_id: str) -> Optional[Recipe]:
        # Try cache first
        cache_key = f"recipe:{recipe_id}"
        cached = await self.cache.get(cache_key)
        if cached:
            return Recipe(**cached)
        
        # Fetch from database
        recipe = await Recipe.get(recipe_id)
        if recipe:
            # Cache for 1 hour
            await self.cache.set(cache_key, recipe.model_dump(), ttl=3600)
        
        return recipe
    
    async def update_recipe(self, recipe_id: str, data: RecipeUpdate) -> Recipe:
        recipe = await Recipe.get(recipe_id)
        # ... update logic ...
        await recipe.save()
        
        # Invalidate cache
        await self.cache.delete(f"recipe:{recipe_id}")
        
        return recipe
```

### Step 4: Optimize Async Operations

**Use asyncio.gather() for Concurrent Operations:**

**Before (Sequential):**
```python
async def get_user_dashboard(user_id: str):
    recipes = await get_user_recipes(user_id)
    pantry = await get_user_pantry(user_id)
    meal_plans = await get_user_meal_plans(user_id)
    # Total time = sum of all queries
    return {"recipes": recipes, "pantry": pantry, "meal_plans": meal_plans}
```

**After (Concurrent):**
```python
import asyncio

async def get_user_dashboard(user_id: str):
    # Run all queries concurrently
    recipes, pantry, meal_plans = await asyncio.gather(
        get_user_recipes(user_id),
        get_user_pantry(user_id),
        get_user_meal_plans(user_id)
    )
    # Total time ≈ slowest query
    return {"recipes": recipes, "pantry": pantry, "meal_plans": meal_plans}
```

### Step 5: Database Aggregation Optimization

**Efficient Aggregation Pipeline:**
```python
async def get_recipe_statistics(user_id: str):
    """Get recipe statistics using aggregation pipeline."""
    pipeline = [
        {"$match": {"user_id": user_id}},
        {
            "$group": {
                "_id": "$difficulty",
                "count": {"$sum": 1},
                "avg_prep_time": {"$avg": "$prep_time"},
                "avg_cook_time": {"$avg": "$cook_time"}
            }
        },
        {"$sort": {"count": -1}}
    ]
    
    results = await Recipe.aggregate(pipeline).to_list()
    return results
```

### Step 6: Pagination for Large Datasets

```python
from typing import List, Optional
from pydantic import BaseModel

class PaginatedResponse(BaseModel):
    items: List[Recipe]
    total: int
    page: int
    page_size: int
    has_next: bool

async def get_recipes_paginated(
    skip: int = 0,
    limit: int = 20
) -> PaginatedResponse:
    """Get paginated recipes."""
    # Get total count (cached)
    total = await Recipe.count()
    
    # Fetch page of results
    recipes = await Recipe.find().skip(skip).limit(limit).to_list()
    
    return PaginatedResponse(
        items=recipes,
        total=total,
        page=skip // limit + 1,
        page_size=limit,
        has_next=(skip + limit) < total
    )
```

### Step 7: Monitor and Measure

**Performance Metrics:**
```python
import time
from prometheus_client import Histogram, Counter

# Define metrics
request_duration = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration',
    ['method', 'endpoint']
)

db_query_duration = Histogram(
    'db_query_duration_seconds',
    'Database query duration',
    ['operation']
)

# Use in code
async def get_recipe_by_id(recipe_id: str):
    with db_query_duration.labels(operation='get_recipe').time():
        return await Recipe.get(recipe_id)
```

## Expected Output

**Performance Improvements:**
- Reduced query response times
- Lower database load
- Improved API response times
- Better resource utilization
- Scalability for more users

**Metrics:**
- Query time reduction (target: 50%+)
- Cache hit rate (target: 70%+)
- API response time (target: <200ms for most endpoints)

## Constraints

- **MUST** measure performance before and after
- **MUST** add indexes for frequently queried fields
- **MUST** use projections to fetch only needed data
- **MUST** implement caching for read-heavy operations
- **MUST** use asyncio.gather() for concurrent operations
- **MUST NOT** over-index (impacts write performance)
- **MUST NOT** cache sensitive data without encryption
- **MUST** implement cache invalidation strategy

## Notes

- Profile before optimizing
- Focus on high-impact optimizations first
- Monitor production performance
- Use connection pooling
- Consider read replicas for scaling
- Implement query result caching
- Use CDN for static assets
- Optimize serialization/deserialization
- Consider database sharding for massive scale