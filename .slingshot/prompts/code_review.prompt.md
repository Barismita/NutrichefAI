---
name: "Comprehensive Code Review"
description: "Guide systematic code review process covering quality, security, performance, and maintainability"
category: "Code Quality"
tags: ["code-review", "quality", "security", "best-practices"]
---

## Objective

Perform a comprehensive code review that evaluates code quality, security vulnerabilities, performance issues, maintainability, and adherence to project standards.

## Context

**Tech Stack:**
- Python 3.11
- FastAPI, Beanie ODM, MongoDB
- Pydantic v2
- Clean Architecture

**Review Areas:**
- Code quality and standards
- Security vulnerabilities
- Performance optimization
- Test coverage
- Documentation completeness

## Instructions

### Step 1: Code Quality Review

**PEP 8 Compliance:**
- [ ] Check line length (max 100 characters)
- [ ] Verify proper indentation (4 spaces)
- [ ] Check naming conventions (snake_case, PascalCase, UPPER_CASE)
- [ ] Verify import ordering (standard → third-party → local)
- [ ] Check for trailing whitespace

**Type Hints:**
- [ ] All function parameters have type hints
- [ ] All function return types are specified
- [ ] Complex types use proper typing imports (List, Dict, Optional)
- [ ] No use of `Any` without justification

**Docstrings:**
- [ ] All public functions have docstrings
- [ ] Docstrings follow Google style
- [ ] Parameters and return values documented
- [ ] Exceptions documented

**Code Structure:**
- [ ] Functions are focused and single-purpose
- [ ] No code duplication (DRY principle)
- [ ] Proper separation of concerns
- [ ] Appropriate use of classes vs functions
- [ ] No overly complex functions (cyclomatic complexity < 10)

### Step 2: Security Review

**Input Validation:**
- [ ] All user inputs validated with Pydantic schemas
- [ ] SQL/NoSQL injection prevention (using Beanie query builders)
- [ ] No eval() or exec() usage
- [ ] File upload validation (if applicable)
- [ ] URL validation for external requests

**Authentication & Authorization:**
- [ ] Protected endpoints require authentication
- [ ] User permissions checked before operations
- [ ] No hardcoded credentials or API keys
- [ ] Proper JWT token validation
- [ ] Session management is secure

**Data Protection:**
- [ ] Sensitive data not logged
- [ ] Passwords hashed (never stored in plain text)
- [ ] Personal data handling complies with regulations
- [ ] No sensitive data in error messages

**Dependencies:**
- [ ] No known vulnerabilities in dependencies
- [ ] Dependencies are up-to-date
- [ ] Minimal dependency footprint

### Step 3: Performance Review

**Database Operations:**
- [ ] Proper indexes defined for queries
- [ ] No N+1 query problems
- [ ] Efficient use of projections (fetch only needed fields)
- [ ] Aggregation pipelines optimized
- [ ] Connection pooling configured

**Async Operations:**
- [ ] All I/O operations use async/await
- [ ] No blocking calls in async functions
- [ ] Proper use of asyncio.gather() for concurrent operations
- [ ] No unnecessary await calls

**Caching:**
- [ ] Frequently accessed data is cached
- [ ] Cache invalidation strategy in place
- [ ] Appropriate TTL for cached data

**Resource Usage:**
- [ ] No memory leaks (proper cleanup)
- [ ] Efficient data structures
- [ ] Large datasets handled with pagination
- [ ] File handles properly closed

### Step 4: Error Handling Review

- [ ] All exceptions properly caught and handled
- [ ] Custom exceptions for business logic errors
- [ ] Meaningful error messages
- [ ] Proper HTTP status codes in API responses
- [ ] Errors logged with appropriate context
- [ ] No bare except clauses
- [ ] Graceful degradation for external service failures

### Step 5: Testing Review

**Test Coverage:**
- [ ] Unit tests for all business logic
- [ ] Integration tests for API endpoints
- [ ] Test coverage >= 80%
- [ ] Edge cases covered
- [ ] Error scenarios tested

**Test Quality:**
- [ ] Tests are independent and isolated
- [ ] Proper use of fixtures and mocks
- [ ] Test names are descriptive
- [ ] No flaky tests
- [ ] Tests run quickly

### Step 6: Architecture Review

**Clean Architecture:**
- [ ] Clear layer separation (API, Service, Model)
- [ ] No business logic in API layer
- [ ] Services are stateless
- [ ] Proper dependency injection
- [ ] Models only in model layer

**SOLID Principles:**
- [ ] Single Responsibility Principle followed
- [ ] Open/Closed Principle applied
- [ ] Dependency Inversion used appropriately

### Step 7: Documentation Review

- [ ] README updated if necessary
- [ ] API endpoints documented (FastAPI auto-docs)
- [ ] Complex algorithms explained
- [ ] Configuration options documented
- [ ] Deployment instructions current

### Step 8: Git & Commit Review

- [ ] Commit messages follow conventional commits
- [ ] Commits are atomic and logical
- [ ] No sensitive data in commits
- [ ] Branch naming follows conventions
- [ ] No merge conflicts

## Expected Output

**Review Report:**
- List of issues found (categorized by severity)
- Specific line numbers and file paths
- Suggested fixes for each issue
- Overall code quality score
- Approval or request for changes

**Issue Categories:**
- **Critical**: Security vulnerabilities, data loss risks
- **High**: Performance issues, broken functionality
- **Medium**: Code quality, maintainability concerns
- **Low**: Style issues, minor improvements

## Constraints

- **MUST** review all changed files
- **MUST** check for security vulnerabilities
- **MUST** verify test coverage
- **MUST** ensure PEP 8 compliance
- **MUST** validate Clean Architecture adherence
- **MUST** provide actionable feedback
- **MUST NOT** approve code with critical issues
- **MUST NOT** be overly pedantic on minor style issues

## Notes

- Use automated tools: black, flake8, mypy, bandit
- Run pytest with coverage report
- Check for TODO/FIXME comments
- Verify no commented-out code
- Look for code smells (long functions, deep nesting)
- Consider using SonarQube for static analysis
- Review PR description for context
- Check for breaking changes
- Verify backward compatibility if needed