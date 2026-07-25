# AI Provider Integration Skill

## Name

Shared AI Provider Integration

## Description

This skill provides guidance for integrating AI-powered features into NutriChef AI using the shared AIProvider abstraction. It ensures all AI features follow a consistent implementation pattern for prompt generation, response validation, error handling, and service integration.

## Purpose

To standardize AI integrations across NutriChef AI while maximizing code reuse and maintaining a consistent architecture.

## When to Use

- Creating a new AI-powered feature
- Extending an existing AI feature
- Integrating prompt builders
- Consuming AI responses
- Refactoring AI implementations
- Adding AI-powered recommendations

## Inputs

- Request schema
- Prompt builder
- AIProvider
- Expected JSON schema
- Response model

## Outputs

- Prompt generation
- AIProvider invocation
- JSON parsing
- Response validation
- Typed Pydantic response
- Consistent error handling

## Best Practices

- Reuse the existing AIProvider.
- Keep prompt generation inside utils/.
- Call AI only from the service layer.
- Require JSON-only responses.
- Validate every AI response using Pydantic.
- Return HTTP 502 for malformed AI responses.
- Keep routers lightweight.
- Avoid feature-specific AI clients.

## Common Mistakes

### ❌ Creating a new AI client

Reuse AIProvider instead.

### ❌ Parsing responses inside routers

Parse responses inside services.

### ❌ Returning raw AI output

Always validate using response schemas.

### ❌ Duplicating prompt logic

Centralize prompts inside prompt builders.

### ❌ Skipping validation

Never trust AI responses without validation.