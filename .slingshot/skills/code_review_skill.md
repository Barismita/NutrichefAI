# Code Review Skill

## Name
Systematic Code Review for NutriChef AI

## Description
This skill provides a comprehensive framework for conducting thorough code reviews in the NutriChef AI project. It covers code quality, security, performance, maintainability, and adherence to project standards for Python 3.11, FastAPI, Beanie ODM, and Clean Architecture.

## Purpose
To ensure all code contributions meet NutriChef AI quality standards, follow best practices, maintain security, and align with Clean Architecture principles before merging to main branch.

## When to Use
- Reviewing pull requests before merging
- Conducting peer code reviews
- Self-reviewing code before committing
- Auditing existing codebase for quality improvements
- Onboarding new developers to project standards
- Refactoring legacy code
- Validating AI-generated code

## Inputs
- **Code Changes**: Files modified, added, or deleted
- **Pull Request Description**: Context and purpose of changes
- **Related Issues**: User stories, bug reports, or feature requests
- **Test Coverage**: Unit and integration test results
- **Linting Results**: Output from black, flake8, mypy
- **Project Guidelines**: slingshot-guidelines.md reference

## Outputs
- **Review Comments**: Inline comments on specific code lines
- **Approval Status**: Approve, Request Changes, or Comment
- **Quality Score**: Assessment of code quality (optional)
- **Action Items**: List of required changes before approval
- **Best Practice Suggestions**: Recommendations for improvement
- **Security Findings**: Identified security vulnerabilities

## Best Practices

### 1. Review Checklist Approach
- Follow a systematic checklist for consistency
- Review in multiple passes (architecture → logic → style)
- Focus on one aspect at a time
- Document findings clearly with examples

### 2. Constructive Feedback
- Be respectful and professional
- Explain the "why" behind suggestions
- Provide code examples for improvements
- Acknowledge good practices
- Use "we" instead of "you" (collaborative tone)

### 3. Priority Levels
- **Critical**: Security vulnerabilities, data loss risks, breaking changes
- **High**: Performance issues, incorrect business logic, missing error handling
- **Medium**: Code quality, maintainability, missing tests
- **Low**: Style preferences, minor optimizations, documentation

### 4. Focus Areas
- **Correctness**: Does the code do what it's supposed to do?
- **Security**: Are there any security vulnerabilities?
- **Performance**: Are there performance bottlenecks?
- **Maintainability**: Is the code easy to understand and modify?
- **Testability**: Is the code well-tested and testable?
- **Standards**: Does it follow project coding standards?

## Common Mistakes

### ❌ Mistake 1: Focusing Only on Style
```python
# Reviewer focuses on minor style issues
# "Use double quotes instead of single quotes"
# Missing critical logic error
```
**Fix**: Prioritize correctness, security, and logic over style

### ❌ Mistake 2: Vague Feedback
```python
# BAD: "This code is not good"
# No explanation or suggestion
```
**Fix**: Provide specific, actionable feedback
```python
# GOOD: "This function has high cyclomatic complexity (15). 
# Consider extracting the validation logic into a separate 
# method to improve readability and testability."
```

### ❌ Mistake 3: Not Testing the Code
```python
# Approving code without running tests or checking functionality
```
**Fix**: Always run tests and verify functionality locally

### ❌ Mistake 4: Ignoring Security
```python
# Missing SQL injection, XSS, or authentication bypass vulnerabilities
```
**Fix**: Always check for common security vulnerabilities

### ❌ Mistake 5: Rubber Stamping
```python
# Approving without thorough review: "LGTM" (Looks Good To Me)
```
**Fix**: Conduct thorough review even for small changes

## Code Review Checklist

### 1. Architecture & Design
- [ ] Follows Clean Architecture (API → Service → Model layers)
- [ ] Single Responsibility Principle applied
- [ ] Proper separation of concerns
- [ ] No business logic in route handlers
- [ ] Service layer encapsulates business logic
- [ ] Models only contain data and simple validation
- [ ] No circular dependencies

### 2. Code Quality
- [ ] PEP 8 compliant (checked with flake8)
- [ ] Type hints on all functions and parameters
- [ ] Descriptive variable and function names
- [ ] No code duplication (DRY principle)
- [ ] Functions are focused and single-purpose
- [ ] Cyclomatic complexity is reasonable (<10)
- [ ] No commented-out code
- [ ] No debug print statements

### 3. FastAPI Specific
- [ ] RESTful URL design (plural nouns, proper HTTP methods)
- [ ] Correct HTTP status codes (200, 201, 204, 400, 404, 500)
- [ ] Request validation with Pydantic schemas
- [ ] Response models defined
- [ ] Proper use of async/await
- [ ] Dependency injection used appropriately
- [ ] API versioning (/api/v1/)
- [ ] Route handlers are thin (delegate to services)

### 4. Beanie ODM & MongoDB
- [ ] Indexes defined for queried fields
- [ ] Proper use of async operations (await)
- [ ] No blocking synchronous calls
- [ ] Relationships properly configured (Link, embedded)
- [ ] Collection names follow convention (lowercase, plural)
- [ ] UTC timestamps used
- [ ] Soft deletes implemented where appropriate
- [ ] No N+1 query problems

### 5. Pydantic Schemas
- [ ] Separate schemas for Create, Update, Patch, Response
- [ ] Proper naming convention ({Resource}Create, etc.)
- [ ] Field validation with constraints
- [ ] Custom validators for business rules
- [ ] ConfigDict used (from_attributes=True for ORM)
- [ ] Field descriptions for API docs
- [ ] No ID in Create schemas

### 6. Error Handling
- [ ] Custom exceptions for domain errors
- [ ] HTTPException with proper status codes
- [ ] Clear, actionable error messages
- [ ] Errors logged with appropriate severity
- [ ] No bare except clauses
- [ ] Stack traces preserved (exc_info=True)

### 7. Security
- [ ] No hardcoded secrets or credentials
- [ ] Environment variables for sensitive data
- [ ] Input validation on all user inputs
- [ ] No SQL/NoSQL injection vulnerabilities
- [ ] Authentication/authorization checks
- [ ] No sensitive data in logs
- [ ] CORS configured properly
- [ ] Rate limiting on public endpoints

### 8. Performance
- [ ] Database queries optimized with indexes
- [ ] No N+1 query problems
- [ ] Async/await used for I/O operations
- [ ] No blocking calls in async functions
- [ ] Efficient data structures and algorithms
- [ ] Pagination implemented for list endpoints
- [ ] Caching used where appropriate

### 9. Testing
- [ ] Unit tests for service layer logic
- [ ] Integration tests for API endpoints
- [ ] Test coverage meets minimum (80%)
- [ ] Edge cases covered
- [ ] Error scenarios tested
- [ ] Async tests properly implemented (@pytest.mark.asyncio)
- [ ] Mocking used appropriately
- [ ] Tests are independent and isolated

### 10. Documentation
- [ ] Docstrings for all public functions and classes
- [ ] Google-style docstrings used
- [ ] API endpoints documented
- [ ] Complex logic explained with comments
- [ ] README updated if necessary
- [ ] Commit messages follow conventional format
- [ ] PR description is clear and complete

### 11. Logging
- [ ] Appropriate log levels (DEBUG, INFO, WARNING, ERROR, CRITICAL)
- [ ] Structured logging with context
- [ ] No sensitive data in logs
- [ ] Errors logged with full context
- [ ] Log messages are actionable

### 12. Import Organization
- [ ] Imports organized in three groups (standard → third-party → local)
- [ ] Alphabetically sorted within each group
- [ ] No unused imports
- [ ] No wildcard imports (from x import *)

## Examples

### Example 1: Good Code Review Comment

```markdown
**Priority: High**

**Issue**: Missing error handling for database operation

**Location**: `backend/app/services/recipe_service.py:45`

**Current Code**:
```python
@staticmethod
async def create_recipe(recipe_data: RecipeCreate) -> Recipe:
    recipe = Recipe(**recipe_data.model_dump())
    await recipe.insert()
    return recipe
```

**Problem**: If the database insert fails (e.g., connection error, validation error), the exception will propagate to the route handler without proper logging or user-friendly error message.

**Suggestion**:
```python
@staticmethod
async def create_recipe(recipe_data: RecipeCreate) -> Recipe:
    logger.info(f"Creating recipe: {recipe_data.title}")
    try:
        recipe = Recipe(**recipe_data.model_dump())
        await recipe.insert()
        logger.info(f"Recipe created successfully: {recipe.id}")
        return recipe
    except Exception as e:
        logger.error(f"Failed to create recipe: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create recipe"
        )
```

**References**: See slingshot-guidelines.md Section 13 (Error Handling)
```

### Example 2: Security Review Finding

```markdown
**Priority: Critical**

**Issue**: Potential NoSQL injection vulnerability

**Location**: `backend/app/services/recipe_service.py:78`

**Current Code**:
```python
@staticmethod
async def search_recipes(query: str) -> List[Recipe]:
    # Direct string interpolation in query
    return await Recipe.find({"title": {"$regex": query}}).to_list()
```

**Problem**: User input is directly used in regex query without sanitization. An attacker could inject malicious regex patterns causing ReDoS (Regular Expression Denial of Service) or bypassing filters.

**Suggestion**:
```python
import re

@staticmethod
async def search_recipes(query: str) -> List[Recipe]:
    # Escape special regex characters
    sanitized_query = re.escape(query)
    return await Recipe.find(
        Recipe.title.regex(sanitized_query, "i")
    ).to_list()
```

**Alternative**: Use Beanie's query builder instead of raw queries for better safety.

**References**: OWASP NoSQL Injection Prevention Cheat Sheet
```

### Example 3: Performance Review Comment

```markdown
**Priority: Medium**

**Issue**: N+1 query problem

**Location**: `backend/app/api/meal_plan.py:34`

**Current Code**:
```python
@router.get("/meal-plans/{plan_id}")
async def get_meal_plan(plan_id: str) -> MealPlanResponse:
    meal_plan = await MealPlan.get(plan_id)
    # N+1: Fetching each recipe individually
    for meal in meal_plan.meals:
        meal.recipe = await Recipe.get(meal.recipe_id)
    return meal_plan
```

**Problem**: If a meal plan has 20 meals, this will execute 21 database queries (1 for meal plan + 20 for recipes). This is inefficient and will cause performance issues.

**Suggestion**:
```python
import asyncio

@router.get("/meal-plans/{plan_id}")
async def get_meal_plan(plan_id: str) -> MealPlanResponse:
    meal_plan = await MealPlan.get(plan_id, fetch_links=True)
    
    # Fetch all recipes concurrently
    recipe_ids = [meal.recipe_id for meal in meal_plan.meals]
    recipe_tasks = [Recipe.get(recipe_id) for recipe_id in recipe_ids]
    recipes = await asyncio.gather(*recipe_tasks)
    
    # Map recipes to meals
    recipe_map = {r.id: r for r in recipes if r}
    for meal in meal_plan.meals:
        meal.recipe = recipe_map.get(meal.recipe_id)
    
    return meal_plan
```

**Performance Impact**: Reduces 21 sequential queries to 2 concurrent batches.
```

### Example 4: Positive Feedback

```markdown
**Great Work! 👍**

**Location**: `backend/app/services/recipe_service.py:120-145`

Excellent implementation of the search functionality:

✅ Proper use of Beanie's query builder (safe from NoSQL injection)  
✅ Pagination implemented correctly  
✅ Multiple filter criteria supported  
✅ Clear docstring with examples  
✅ Type hints on all parameters  
✅ Logging for debugging  
✅ Error handling with custom exceptions  

This is a great example of Clean Architecture service layer implementation. Consider adding this to our internal documentation as a reference.
```

## Related Skills
- **fastapi_api_skill**: For reviewing API endpoint implementations
- **beanie_model_skill**: For reviewing database model design
- **pydantic_schema_skill**: For reviewing schema validation
- **service_layer_skill**: For reviewing business logic
- **unit_testing_skill**: For reviewing test coverage and quality
- **documentation_skill**: For reviewing documentation standards

---

**Skill Version**: 1.0  
**Last Updated**: 2026-07-24  
**Maintained By**: NutriChef AI Development Team