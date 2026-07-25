# MongoDB Integration Skill

## Name

MongoDB & Beanie Integration

## Description

This skill defines how MongoDB should be integrated into NutriChef AI using Beanie ODM. It focuses on connection management, document persistence, async operations, and project-wide consistency.

## Purpose

To ensure MongoDB interactions remain clean, asynchronous, and consistent across the backend.

## When to Use

- Creating collections
- Reading documents
- Updating records
- Deleting documents
- Initializing Beanie
- Database refactoring

## Inputs

- Beanie Document
- MongoDB connection
- Request data
- Query parameters

## Outputs

- Async database operations
- Persisted documents
- Query results
- Updated records
- Deleted records

## Best Practices

- Use Beanie for all persistence.
- Keep database logic in services.
- Await every database operation.
- Initialize models during startup.
- Use indexes where appropriate.
- Keep models simple.
- Validate data before persistence.

## Common Mistakes

### ❌ Database logic inside routers

Move database access to services.

### ❌ Blocking database calls

Always use async operations.

### ❌ Duplicate queries

Reuse existing service functions.

### ❌ Missing validation

Validate before inserting.

### ❌ Creating unnecessary collections

Reuse existing models whenever possible.