## Objective

Improve code structure, readability, and maintainability through refactoring without changing external behavior or breaking existing functionality.

## Context

**Tech Stack:**
- Python 3.11
- FastAPI, Beanie ODM, MongoDB
- Clean Architecture

**Refactoring Goals:**
- Improve code readability
- Reduce complexity
- Eliminate duplication
- Apply SOLID principles
- Enhance maintainability

**Constraints:**
- No functionality changes
- All tests must pass
- Backward compatibility maintained

## Instructions

### Step 1: Identify Refactoring Candidates

**Code Smells to Look For:**
- [ ] Long functions (>50 lines)
- [ ] Deep nesting (>3 levels)
- [ ] Duplicate code
- [ ] Large classes (>300 lines)
- [ ] Long parameter lists (>5 parameters)
- [ ] Complex conditionals
- [ ] Magic numbers/strings
- [ ] Poor naming
- [ ] Tight coupling
- [ ] Low cohesion

**Use Static Analysis Tools:**
```bash
# Check complexity
radon cc backend/app/services/ -a -nb

# Check maintainability
radon mi backend/app/services/

# Find duplicates
pylint backend/app/ --disable=all --enable=duplicate-code
```

### Step 2: Ensure Test Coverage

**Before Refactoring:**
```bash
# Run tests and check coverage
pytest backend/app/tests/ -v --cov=backend/app --cov-report=html

# Coverage should be >= 80%
```

- [ ] All tests passing
- [ ] Good test coverage exists
- [ ] Tests are reliable (not flaky)

**If Coverage is Low:**
- Write tests before refactoring
- Focus on critical paths
- Add integration tests

### Step 3: Apply Refactoring Patterns

#### Extract Method
**Before:**
```python
async def create_recipe(recipe_data: RecipeCreate, user_id: str) -> Recipe:
    # Validate ingredients
    for ingredient in recipe_data.ingredients:
        if not ingredient.strip():
            raise ValueError("Empty ingredient not allowed")
    
    # Calculate total time
    total_time = recipe_data.prep_time + recipe_data.cook_time
    if total_time > 480:
        raise ValueError("Total time exceeds 8 hours")
    
    # Create recipe
    recipe = Recipe(**recipe_data.model_dump(), user_id=user_id)
    await recipe.insert()
    return recipe
```

**After:**
```python
async def create_recipe(recipe_data: RecipeCreate, user_id: str) -> Recipe:
    """Create a new recipe."""
    _validate_ingredients(recipe_data.ingredients)
    _validate_cooking_time(recipe_data.prep_time, recipe_data.cook_time)
    
    recipe = Recipe(**recipe_data.model_dump(), user_id=user_id)
    await recipe.insert()
    return recipe

def _validate_ingredients(ingredients: List[str]) -> None:
    """Validate ingredients list."""
    for ingredient in ingredients:
        if not ingredient.strip():
            raise ValueError("Empty ingredient not allowed")

def _validate_cooking_time(prep_time: int, cook_time: int) -> None:
    """Validate total cooking time."""
    total_time = prep_time + cook_time
    if total_time > 480:
        raise ValueError("Total time exceeds 8 hours")
```

#### Extract Class
**Before:**
```python
class RecipeService:
    async def create_recipe(self, data): ...
    async def calculate_nutrition(self, recipe): ...
    async def generate_shopping_list(self, recipe): ...
    async def scale_recipe(self, recipe, servings): ...
```

**After:**
```python
class RecipeService:
    async def create_recipe(self, data): ...

class NutritionCalculator:
    async def calculate_nutrition(self, recipe): ...

class ShoppingListGenerator:
    async def generate_shopping_list(self, recipe): ...

class RecipeScaler:
    async def scale_recipe(self, recipe, servings): ...
```

#### Replace Magic Numbers
**Before:**
```python
if total_time > 480:
    raise ValueError("Total time too long")
```

**After:**
```python
MAX_COOKING_TIME_MINUTES = 480  # 8 hours

if total_time > MAX_COOKING_TIME_MINUTES:
    raise ValueError(f"Total time exceeds {MAX_COOKING_TIME_MINUTES // 60} hours")
```

#### Simplify Conditionals
**Before:**
```python
if recipe.difficulty == "easy" or recipe.difficulty == "medium":
    if recipe.prep_time < 30:
        return True
return False
```

**After:**
```python
EASY_DIFFICULTIES = {"easy", "medium"}
QUICK_PREP_TIME = 30

return recipe.difficulty in EASY_DIFFICULTIES and recipe.prep_time < QUICK_PREP_TIME
```

#### Replace Nested Conditionals with Guard Clauses
**Before:**
```python
async def update_recipe(recipe_id: str, data: RecipeUpdate, user_id: str):
    recipe = await Recipe.get(recipe_id)
    if recipe:
        if recipe.user_id == user_id:
            # Update logic
            pass
        else:
            raise UnauthorizedException()
    else:
        raise RecipeNotFoundException()
```

**After:**
```python
async def update_recipe(recipe_id: str, data: RecipeUpdate, user_id: str):
    recipe = await Recipe.get(recipe_id)
    if not recipe:
        raise RecipeNotFoundException(recipe_id)
    
    if recipe.user_id != user_id:
        raise UnauthorizedException("Cannot update another user's recipe")
    
    # Update logic
    pass
```

### Step 4: Apply SOLID Principles

**Single Responsibility:**
- Each class/function has one reason to change
- Separate concerns into different modules

**Open/Closed:**
- Open for extension, closed for modification
- Use inheritance and composition

**Dependency Inversion:**
- Depend on abstractions, not concretions
- Use dependency injection

### Step 5: Improve Naming

**Before:**
```python
def proc_rec(r, u):
    ...
```

**After:**
```python
async def process_recipe_for_user(recipe: Recipe, user_id: str) -> ProcessedRecipe:
    ...
```

### Step 6: Run Tests After Each Change

```bash
# After each refactoring step
pytest backend/app/tests/ -v

# Verify coverage maintained
pytest backend/app/tests/ --cov=backend/app
```

- [ ] All tests pass
- [ ] Coverage not decreased
- [ ] No new linting errors

### Step 7: Update Documentation

- [ ] Update docstrings
- [ ] Update inline comments
- [ ] Update architecture docs if structure changed
- [ ] Update README if public API changed

## Expected Output

**Improved Code:**
- Reduced complexity
- Better readability
- Eliminated duplication
- Applied SOLID principles
- Improved naming
- Same functionality

**Verification:**
- All tests passing
- Coverage maintained or improved
- Linting passes
- Performance not degraded

## Constraints

- **MUST** maintain existing functionality
- **MUST** keep all tests passing
- **MUST** maintain or improve test coverage
- **MUST** refactor in small, incremental steps
- **MUST** commit after each successful refactoring
- **MUST NOT** change external API behavior
- **MUST NOT** introduce new features
- **MUST NOT** fix bugs (separate from refactoring)

## Notes

- Refactor in small steps
- Commit frequently
- Run tests after each change
- Use version control to revert if needed
- Consider performance implications
- Get code review for large refactorings
- Document significant structural changes
- Plan refactoring during low-traffic periods
- Consider feature flags for risky refactorings
- Measure performance before and after