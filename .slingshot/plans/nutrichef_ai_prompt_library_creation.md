---
name: "NutriChef AI Prompt Library Creation"
overview: "Create a comprehensive reusable prompt library with 15 production-ready\
  \ .prompt.md files tailored for NutriChef AI's tech stack and Clean Architecture"
todos:
- id: 1
  content: "Create .slingshot/prompts directory structure"
  title: "Create .slingshot/prompts directory structure"
  description: null
  status: "done"
- id: 2
  content: "Create pantry_management.prompt.md"
  title: "Create pantry_management.prompt.md"
  description: null
  status: "done"
- id: 3
  content: "Create recipe_management.prompt.md"
  title: "Create recipe_management.prompt.md"
  description: null
  status: "done"
- id: 4
  content: "Create recipe_generation.prompt.md"
  title: "Create recipe_generation.prompt.md"
  description: null
  status: "done"
- id: 5
  content: "Create api_design.prompt.md"
  title: "Create api_design.prompt.md"
  description: null
  status: "done"
- id: 6
  content: "Create database_model.prompt.md"
  title: "Create database_model.prompt.md"
  description: null
  status: "done"
- id: 7
  content: "Create service_layer.prompt.md"
  title: "Create service_layer.prompt.md"
  description: null
  status: "done"
- id: 8
  content: "Create schema_generation.prompt.md"
  title: "Create schema_generation.prompt.md"
  description: null
  status: "done"
- id: 9
  content: "Create code_review.prompt.md"
  title: "Create code_review.prompt.md"
  description: null
  status: "done"
- id: 10
  content: "Create bug_fix.prompt.md"
  title: "Create bug_fix.prompt.md"
  description: null
  status: "done"
- id: 11
  content: "Create refactoring.prompt.md"
  title: "Create refactoring.prompt.md"
  description: null
  status: "done"
- id: 12
  content: "Create unit_testing.prompt.md"
  title: "Create unit_testing.prompt.md"
  description: null
  status: "done"
- id: 13
  content: "Create integration_testing.prompt.md"
  title: "Create integration_testing.prompt.md"
  description: null
  status: "done"
- id: 14
  content: "Create documentation.prompt.md"
  title: "Create documentation.prompt.md"
  description: null
  status: "done"
- id: 15
  content: "Create performance_optimization.prompt.md"
  title: "Create performance_optimization.prompt.md"
  description: null
  status: "done"
- id: 16
  content: "Create security_review.prompt.md"
  title: "Create security_review.prompt.md"
  description: null
  status: "done"
userQuery: "Create a reusable Prompt Library for the NutriChef AI project with 15\
  \ production-ready prompt files saved as individual `.prompt.md` files in `.slingshot/prompts/`\
  \ directory. Each prompt must have YAML frontmatter (name, description, category,\
  \ tags) and structured content (Objective, Context, Instructions, Expected Output,\
  \ Constraints, Notes). The prompts must be tailored specifically for NutriChef AI's\
  \ tech stack (Python 3.11, FastAPI, Beanie ODM, PyMongo Async, MongoDB, Pydantic\
  \ v2, React) and Clean Architecture. Generate prompts for: pantry_management, recipe_management,\
  \ recipe_generation, api_design, database_model, service_layer, schema_generation,\
  \ code_review, bug_fix, refactoring, unit_testing, integration_testing, documentation,\
  \ performance_optimization, and security_review. All prompts should encourage code\
  \ reuse, prefer async implementations, preserve existing project structure, and\
  \ avoid replacing existing infrastructure unless explicitly requested."
correlationId: "6af10a2d-a630-484a-b983-eeffdaa4311b"

---

# NutriChef AI Prompt Library Implementation Plan

## Overview

This plan outlines the creation of a comprehensive, production-ready prompt library for the NutriChef AI project. The library will consist of 15 specialized `.prompt.md` files stored in `.slingshot/prompts/`, each designed to guide AI-assisted development while adhering to the project's tech stack (Python 3.11, FastAPI, Beanie ODM, PyMongo Async, MongoDB, Pydantic v2, React) and Clean Architecture principles.

## Architecture & Design

### Prompt Structure Standard

Each prompt file will follow this standardized structure:

```markdown
---
name: "Prompt Name"
description: "Brief description of the prompt's purpose"
category: "Category (e.g., Feature Development, Code Quality, Testing)"
tags: ["tag1", "tag2", "tag3"]
---

## Objective
Clear statement of what this prompt helps achieve

## Context
- Tech stack details
- Architecture layer information
- Related files and dependencies
- Project-specific constraints

## Instructions
Step-by-step guidance for the AI agent

## Expected Output
- File paths and names
- Code structure requirements
- Documentation requirements

## Constraints
- Must preserve existing infrastructure
- Must use async implementations
- Must follow Clean Architecture
- Must reuse existing code where possible

## Notes
Additional considerations and best practices
```

### Directory Structure

```
.slingshot/
└── prompts/
    ├── pantry_management.prompt.md
    ├── recipe_management.prompt.md
    ├── recipe_generation.prompt.md
    ├── api_design.prompt.md
    ├── database_model.prompt.md
    ├── service_layer.prompt.md
    ├── schema_generation.prompt.md
    ├── code_review.prompt.md
    ├── bug_fix.prompt.md
    ├── refactoring.prompt.md
    ├── unit_testing.prompt.md
    ├── integration_testing.prompt.md
    ├── documentation.prompt.md
    ├── performance_optimization.prompt.md
    └── security_review.prompt.md
```

## Implementation Details

### 1. Feature Development Prompts

#### Pantry Management Prompt
- **Purpose**: Guide creation of pantry tracking features
- **Scope**: API endpoints, service layer, database models, schemas
- **Key Requirements**: 
  - Async MongoDB operations with Beanie ODM
  - RESTful API design with FastAPI
  - Pydantic v2 validation schemas
  - Clean Architecture layer separation

#### Recipe Management Prompt
- **Purpose**: Guide CRUD operations for recipes
- **Scope**: Complete feature implementation across all layers
- **Key Requirements**:
  - Search and filter capabilities
  - Ingredient relationship management
  - Nutritional data integration

#### Recipe Generation Prompt
- **Purpose**: Guide AI-powered recipe generation features
- **Scope**: Service layer integration with AI APIs
- **Key Requirements**:
  - External API integration patterns
  - Error handling for AI service failures
  - Response caching strategies

### 2. Architecture & Design Prompts

#### API Design Prompt
- **Purpose**: Guide creation of RESTful FastAPI endpoints
- **Key Elements**:
  - HTTP method selection (GET, POST, PUT, PATCH, DELETE)
  - URL structure conventions (`/api/v1/{resource}`)
  - Status code standards (200, 201, 204, 400, 404, 500)
  - Request/response schema integration

#### Database Model Prompt
- **Purpose**: Guide Beanie ODM document model creation
- **Key Elements**:
  - Index strategy for query optimization
  - Field type selection and validation
  - Collection naming conventions
  - Relationship modeling

#### Service Layer Prompt
- **Purpose**: Guide business logic implementation
- **Key Elements**:
  - Service class structure
  - Dependency injection patterns
  - Transaction management
  - External service integration

#### Schema Generation Prompt
- **Purpose**: Guide Pydantic v2 schema creation
- **Key Elements**:
  - Create/Update/Response schema separation
  - Field validation rules
  - Custom validators
  - ConfigDict usage for Pydantic v2

### 3. Code Quality Prompts

#### Code Review Prompt
- **Purpose**: Guide systematic code review process
- **Review Checklist**:
  - PEP 8 compliance
  - Type hint coverage
  - Docstring completeness
  - Security vulnerabilities
  - Performance considerations
  - Test coverage

#### Bug Fix Prompt
- **Purpose**: Guide structured bug resolution
- **Process Steps**:
  1. Reproduce the bug
  2. Identify root cause
  3. Implement fix with tests
  4. Verify no regressions
  5. Document the fix

#### Refactoring Prompt
- **Purpose**: Guide code improvement without changing functionality
- **Focus Areas**:
  - DRY principle application
  - SOLID principles adherence
  - Code complexity reduction
  - Performance optimization

### 4. Testing Prompts

#### Unit Testing Prompt
- **Purpose**: Guide pytest unit test creation
- **Requirements**:
  - Test organization in `backend/app/tests/unit/`
  - Fixture usage for test data
  - Async test patterns with `@pytest.mark.asyncio`
  - Mocking external dependencies
  - 80%+ code coverage target

#### Integration Testing Prompt
- **Purpose**: Guide API integration test creation
- **Requirements**:
  - Test organization in `backend/app/tests/integration/`
  - TestClient usage for FastAPI
  - Database setup/teardown
  - End-to-end workflow testing

### 5. Documentation & Optimization Prompts

#### Documentation Prompt
- **Purpose**: Guide comprehensive documentation creation
- **Scope**:
  - API endpoint documentation
  - Code comments for complex logic
  - README updates
  - Architecture decision records (ADRs)

#### Performance Optimization Prompt
- **Purpose**: Guide performance improvement efforts
- **Focus Areas**:
  - Database query optimization
  - Index strategy review
  - Async operation efficiency
  - Caching implementation
  - N+1 query prevention

#### Security Review Prompt
- **Purpose**: Guide security audit and hardening
- **Review Areas**:
  - Input validation completeness
  - Authentication/authorization checks
  - NoSQL injection prevention
  - Secrets management
  - CORS configuration
  - Rate limiting

## Prompt Content Guidelines

### Common Elements Across All Prompts

1. **Tech Stack Reference**
   - Python 3.11
   - FastAPI
   - Beanie ODM
   - PyMongo Async
   - MongoDB
   - Pydantic v2
   - React (for frontend prompts)

2. **Architecture Constraints**
   - Clean Architecture layer separation
   - API Layer: `backend/app/api/`
   - Service Layer: `backend/app/services/`
   - Model Layer: `backend/app/models/`
   - Schema Layer: `backend/app/schemas/`

3. **Code Quality Standards**
   - PEP 8 compliance
   - Type hints required
   - Google-style docstrings
   - Async/await for I/O operations
   - Maximum 100 characters per line

4. **Reusability Principles**
   - Search existing code with @Workspace before creating new
   - Reuse existing models, services, schemas
   - Extend existing modules over creating new ones
   - Preserve existing project structure

5. **Validation Requirements**
   - Pydantic v2 field validators
   - Custom validation logic where needed
   - Clear error messages
   - Input sanitization

## File Creation Strategy

### Batch 1: Core Feature Development (5 prompts)
1. [pantry_management.prompt.md](.slingshot/prompts/pantry_management.prompt.md)
2. [recipe_management.prompt.md](.slingshot/prompts/recipe_management.prompt.md)
3. [recipe_generation.prompt.md](.slingshot/prompts/recipe_generation.prompt.md)
4. [api_design.prompt.md](.slingshot/prompts/api_design.prompt.md)
5. [database_model.prompt.md](.slingshot/prompts/database_model.prompt.md)

### Batch 2: Architecture & Services (2 prompts)
6. [service_layer.prompt.md](.slingshot/prompts/service_layer.prompt.md)
7. [schema_generation.prompt.md](.slingshot/prompts/schema_generation.prompt.md)

### Batch 3: Code Quality (3 prompts)
8. [code_review.prompt.md](.slingshot/prompts/code_review.prompt.md)
9. [bug_fix.prompt.md](.slingshot/prompts/bug_fix.prompt.md)
10. [refactoring.prompt.md](.slingshot/prompts/refactoring.prompt.md)

### Batch 4: Testing (2 prompts)
11. [unit_testing.prompt.md](.slingshot/prompts/unit_testing.prompt.md)
12. [integration_testing.prompt.md](.slingshot/prompts/integration_testing.prompt.md)

### Batch 5: Documentation & Optimization (3 prompts)
13. [documentation.prompt.md](.slingshot/prompts/documentation.prompt.md)
14. [performance_optimization.prompt.md](.slingshot/prompts/performance_optimization.prompt.md)
15. [security_review.prompt.md](.slingshot/prompts/security_review.prompt.md)

## Expected Outcomes

### Immediate Benefits
- Consistent AI-assisted development across the team
- Reduced time to implement new features
- Standardized code quality and architecture adherence
- Reusable knowledge base for common development tasks

### Long-term Benefits
- Faster onboarding for new developers
- Reduced technical debt through consistent patterns
- Improved code maintainability
- Enhanced security and performance through standardized reviews

## Usage Guidelines

### When to Use Each Prompt

- **Feature Development Prompts**: When implementing new features or modules
- **Architecture Prompts**: When designing new components or refactoring existing ones
- **Code Quality Prompts**: During code reviews or when improving existing code
- **Testing Prompts**: When writing tests for new or existing code
- **Documentation Prompts**: When documenting APIs, architecture, or complex logic
- **Optimization Prompts**: When addressing performance or security concerns

### Integration with Slingshot Workflow

1. **Plan & Execute Mode**: Use feature development prompts for comprehensive planning
2. **Smart Chat Mode**: Use specific prompts for targeted implementations
3. **@Workspace Search**: Always search before using prompts to avoid duplication
4. **Prompt Refinement**: Update prompts based on learnings from actual usage

## Maintenance Strategy

- **Version Control**: Track prompt changes in Git
- **Regular Reviews**: Quarterly review and update based on project evolution
- **Team Feedback**: Collect feedback on prompt effectiveness
- **Continuous Improvement**: Refine prompts based on actual usage patterns

---

**Implementation Priority**: High  
**Estimated Effort**: 4-6 hours for initial creation, ongoing refinement  
**Dependencies**: None - can be implemented immediately  
**Success Criteria**: All 15 prompts created, validated, and successfully used in at least one development task each