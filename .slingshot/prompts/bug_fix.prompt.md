## Objective

Systematically identify, analyze, fix, and verify bugs while preventing regressions and documenting the resolution process.

## Context

**Tech Stack:**
- Python 3.11
- FastAPI, Beanie ODM, MongoDB
- Pytest for testing
- Logging for debugging

**Bug Lifecycle:**
1. Reproduce the bug
2. Identify root cause
3. Implement fix
4. Write tests
5. Verify no regressions
6. Document the fix

## Instructions

### Step 1: Reproduce the Bug

**Gather Information:**
- [ ] Read bug report thoroughly
- [ ] Identify affected version/environment
- [ ] Collect error messages and stack traces
- [ ] Note steps to reproduce
- [ ] Identify expected vs actual behavior

**Reproduce Locally:**
- [ ] Set up same environment as bug report
- [ ] Follow exact reproduction steps
- [ ] Confirm bug occurs consistently
- [ ] Document reproduction steps
- [ ] Capture screenshots/logs if applicable

**Create Failing Test:**
```python
import pytest
from app.services.recipe_service import RecipeService
from app.schemas.recipe import RecipeCreate

@pytest.mark.asyncio
async def test_recipe_creation_with_empty_ingredients():
    """Test that reproduces bug: empty ingredients list should be rejected."""
    recipe_data = RecipeCreate(
        title="Test Recipe",
        ingredients=[],  # Bug: empty list should fail validation
        instructions="Test instructions",
        prep_time=10,
        cook_time=20,
        servings=4
    )
    
    with pytest.raises(ValueError, match="At least one ingredient is required"):
        await RecipeService.create_recipe(recipe_data, user_id="test_user")
```

### Step 2: Identify Root Cause

**Add Debug Logging:**
```python
import logging

logger = logging.getLogger(__name__)

async def create_recipe(recipe_data: RecipeCreate, user_id: str):
    logger.debug(f"Creating recipe with data: {recipe_data}")
    logger.debug(f"Ingredients count: {len(recipe_data.ingredients)}")
    # ... rest of function
```

**Analyze Code Flow:**
- [ ] Trace execution path
- [ ] Identify where bug occurs
- [ ] Check variable values at each step
- [ ] Review related code sections
- [ ] Check for edge cases not handled

**Use Debugging Tools:**
- [ ] Use Python debugger (pdb/ipdb)
- [ ] Add breakpoints at critical points
- [ ] Inspect variable states
- [ ] Step through code execution

**Common Root Causes:**
- Missing validation
- Incorrect logic/conditions
- Race conditions in async code
- Null/None handling issues
- Type mismatches
- Off-by-one errors
- Incorrect error handling

### Step 3: Implement Fix

**Fix Example:**
```python
# Before (buggy code)
class RecipeCreate(BaseModel):
    ingredients: List[str]
    
# After (fixed code)
class RecipeCreate(BaseModel):
    ingredients: List[str] = Field(..., min_items=1)
    
    @field_validator("ingredients")
    @classmethod
    def validate_ingredients(cls, v: List[str]) -> List[str]:
        cleaned = [ingredient.strip() for ingredient in v if ingredient.strip()]
        if not cleaned:
            raise ValueError("At least one valid ingredient is required")
        return cleaned
```

**Fix Guidelines:**
- [ ] Make minimal changes to fix the bug
- [ ] Don't introduce new features
- [ ] Maintain code style consistency
- [ ] Add comments explaining the fix
- [ ] Update related documentation

### Step 4: Write Tests

**Test the Fix:**
```python
@pytest.mark.asyncio
async def test_recipe_creation_rejects_empty_ingredients():
    """Verify empty ingredients list is rejected."""
    with pytest.raises(ValueError):
        RecipeCreate(
            title="Test",
            ingredients=[],
            instructions="Test",
            prep_time=10,
            cook_time=20,
            servings=4
        )

@pytest.mark.asyncio
async def test_recipe_creation_accepts_valid_ingredients():
    """Verify valid ingredients are accepted."""
    recipe = RecipeCreate(
        title="Test",
        ingredients=["flour", "sugar"],
        instructions="Test",
        prep_time=10,
        cook_time=20,
        servings=4
    )
    assert len(recipe.ingredients) == 2
```

**Test Coverage:**
- [ ] Test the specific bug scenario
- [ ] Test edge cases
- [ ] Test valid scenarios still work
- [ ] Test error messages are correct

### Step 5: Verify No Regressions

**Run Full Test Suite:**
```bash
pytest backend/app/tests/ -v --cov=backend/app --cov-report=term-missing
```

**Checklist:**
- [ ] All existing tests still pass
- [ ] New tests pass
- [ ] Code coverage maintained or improved
- [ ] No new linting errors
- [ ] Manual testing of related features

### Step 6: Document the Fix

**Update Code Comments:**
```python
@field_validator("ingredients")
@classmethod
def validate_ingredients(cls, v: List[str]) -> List[str]:
    """Validate ingredients list is not empty.
    
    Bug fix: Previously allowed empty lists, causing recipe creation to fail.
    Now validates at schema level and cleans whitespace-only entries.
    """
    cleaned = [ingredient.strip() for ingredient in v if ingredient.strip()]
    if not cleaned:
        raise ValueError("At least one valid ingredient is required")
    return cleaned
```

**Commit Message:**
```
fix(recipe): reject empty ingredients list in recipe creation

Previously, RecipeCreate schema allowed empty ingredients list,
causing validation to fail at service layer. Now validates at
schema level with clear error message.

Fixes #123
```

**Update Documentation:**
- [ ] Update API documentation if behavior changed
- [ ] Add to CHANGELOG.md
- [ ] Update README if necessary
- [ ] Document known limitations if any

## Expected Output

**Deliverables:**
1. Fixed code with minimal changes
2. Test cases covering the bug and edge cases
3. All tests passing (including existing tests)
4. Updated documentation
5. Clear commit message
6. Bug report updated/closed

**Verification:**
- Bug no longer reproducible
- Tests prevent regression
- No new issues introduced
- Code quality maintained

## Constraints

- **MUST** reproduce bug before fixing
- **MUST** write tests for the bug
- **MUST** verify no regressions
- **MUST** document the fix
- **MUST** make minimal changes
- **MUST NOT** introduce new features
- **MUST NOT** refactor unrelated code
- **MUST** maintain backward compatibility unless breaking change is necessary

## Notes

- Consider if bug indicates a larger design issue
- Check if similar bugs exist elsewhere
- Update error messages to be more helpful
- Consider adding validation earlier in the flow
- Review related code for similar issues
- Add logging to help debug future issues
- Consider performance impact of fix
- Plan for hotfix deployment if critical