# Debugging Skill

## Purpose

Systematically identify, investigate, and resolve software defects while preserving existing functionality and
maintaining the quality of the NutriChef AI codebase.

---

## Scope

This skill applies to:

- Backend services
- Frontend components
- API integrations
- Database operations
- AI feature workflows
- Build and deployment issues

---

## Debugging Workflow

Always follow this process:

1. Reproduce the issue.
2. Gather relevant information.
3. Identify the root cause.
4. Implement the smallest effective fix.
5. Verify the fix.
6. Check for regressions.
7. Update tests if necessary.

---

## Investigation

Review all relevant information before making changes.

Possible sources include:

- Application logs
- Stack traces
- Browser console
- Network requests
- API responses
- Database records
- Git history
- Recent commits
- Configuration files

Do not make assumptions without evidence.

---

## Root Cause Analysis

Determine whether the issue originates from:

- Business logic
- API implementation
- Database interactions
- Validation
- State management
- User interface
- Configuration
- Third-party services

Fix the root cause rather than masking symptoms.

---

## Implementation Guidelines

When applying a fix:

- Make the smallest necessary change.
- Preserve the existing architecture.
- Avoid unrelated refactoring.
- Follow project coding standards.
- Keep changes easy to review.

---

## Validation

After implementing a fix:

- Verify the original issue is resolved.
- Test related functionality.
- Confirm existing features still work.
- Run automated tests where applicable.

---

## Regression Prevention

Whenever appropriate:

- Add or update automated tests.
- Document any important behaviour changes.
- Ensure similar issues cannot recur.

---

## Best Practices

- Reproduce before fixing.
- Understand before modifying.
- Prefer simple solutions.
- Keep fixes isolated.
- Leave the codebase cleaner than before.

---

## Success Criteria

A debugging task is complete when:

- The root cause has been resolved.
- No regressions are introduced.
- Relevant tests pass.
- Code quality is maintained.
- Documentation is updated if behaviour changes.