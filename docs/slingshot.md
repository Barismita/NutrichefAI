# Slingshot

NutriChef AI was developed using an AI-assisted Software Development Life Cycle (AI-SDLC) powered by **Slingshot**.

Rather than using AI solely for code generation, Slingshot was incorporated throughout the software development
lifecycle to assist with planning, implementation, testing, code review, refactoring, and documentation.

---

# AI-SDLC Workflow

The project follows the workflow below.

```text
Requirements
      │
      ▼
Planning
      │
      ▼
Prompt Engineering
      │
      ▼
Implementation
      │
      ▼
Code Review
      │
      ▼
Testing
      │
      ▼
Documentation
      │
      ▼
Deployment
```

Each stage is supported by reusable prompts, AI skills, and project-specific development guidelines.

---

# Slingshot Project Structure

```text
.slingshot/
├── prompts/
├── skills/
├── code-tagging/
├── agentHooks.json
├── memory.json
├── prompts_cache.json
├── skills_cache.json
└── README.md
```

---

# Prompt Library

Location:

```text
.slingshot/prompts/
```

The prompt library contains reusable prompts that guide AI-assisted development.

Typical prompt categories include:

- Feature implementation
- API development
- Database modeling
- UI development
- Testing
- Documentation
- Refactoring
- Code review

Each prompt provides sufficient project context to generate consistent, production-ready code.

---

# Skills Library

Location:

```text
.slingshot/skills/
```

Skills define reusable workflows that automate common development tasks.

Examples include:

- FastAPI development
- React component generation
- Beanie model creation
- API design
- Unit testing
- Documentation generation
- Code review

These skills help maintain consistency across different features.

---

# Code Tagging

Location:

```text
.slingshot/code-tagging/
```

Code tagging provides project context to Slingshot, enabling more accurate code generation and better understanding of
the existing codebase.

It helps the AI identify relationships between files, modules, and application layers.

---

# Memory

Project memory is stored in:

```text
memory.json
```

Memory enables Slingshot to retain important project-specific context between development sessions, reducing repetitive
prompting and improving consistency.

---

# Agent Hooks

Configuration for automated workflows is maintained in:

```text
agentHooks.json
```

Hooks allow predefined actions to execute during different stages of development, helping automate repetitive tasks and
enforce project standards.

---

# Prompt Engineering Strategy

Each prompt follows a structured approach and typically includes:

- Feature requirements
- Project context
- Existing architecture
- Technology stack
- Relevant files
- Coding standards
- Expected output
- Constraints

Providing rich context produces more accurate and maintainable AI-generated code.

---

# Development Principles

The project follows these AI-assisted development principles:

- Clearly define requirements before implementation.
- Generate small, focused changes.
- Review all generated code before merging.
- Maintain consistency with the existing architecture.
- Write or update tests alongside new features.
- Keep prompts reusable and well documented.

---

# Benefits

Using Slingshot throughout the project provides several advantages.

- Faster feature development
- Consistent implementation patterns
- Reduced repetitive work
- Improved documentation quality
- Standardized code reviews
- Reusable development assets
- Better long-term maintainability

---

# AI-Assisted Development Lifecycle

The development process follows these stages.

1. Define feature requirements.
2. Prepare project context.
3. Select or create a reusable prompt.
4. Generate an implementation.
5. Review and refine the generated code.
6. Execute tests.
7. Update documentation.
8. Commit the completed feature.

This iterative workflow ensures that AI-generated code remains aligned with project standards while maintaining
developer oversight throughout the development lifecycle.