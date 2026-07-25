# NutriChefAI – Step-by-Step Cooking Assistance

## Objective

Implement the **Step-by-Step Cooking Assistance** feature for the NutriChefAI backend.

## Tech Stack

- Python
- FastAPI
- MongoDB
- Beanie ODM
- Pydantic v2
- Existing AIProvider for all AI interactions

Follow the existing architecture and coding style used throughout the project.

---

## Project Structure

Create the following files:

```text
app/
├── api/
│   └── cooking_guide_api.py
├── schemas/
│   └── cooking_guide_schema.py
├── services/
│   └── cooking_guide_service.py
├── utils/
│   └── cooking_guide_prompt_builder.py
```

Do **not** create a MongoDB model. This feature must remain stateless.

---

## API Endpoints

Implement the following endpoints:

- `POST /cooking-guide/start`
- `POST /cooking-guide/next`
- `POST /cooking-guide/previous`
- `POST /cooking-guide/repeat`
- `POST /cooking-guide/question`
- `POST /cooking-guide/finish`

---

## Functional Requirements

### Start Cooking
- Accept a recipe containing:
  - title
  - ingredients
  - instructions
- Return the first cooking step.
- Include 1–2 practical cooking tips.

### Next Step
- Accept the recipe and current step.
- Return the next instruction and tips.
- Handle the final step gracefully.

### Previous Step
- Return the previous instruction.
- Prevent navigating before step one.

### Repeat Step
- Return the current instruction with additional clarification.

### Ask a Question
- Accept:
  - recipe
  - current step
  - user question
- Use the existing AIProvider.
- Answer only within the context of the supplied recipe and current step.
- Return valid JSON only.

### Finish Cooking
- Return a completion message.

---

## Prompt Builder

Create `cooking_guide_prompt_builder.py`.

The prompt should instruct the AI to:

- Explain only the requested cooking step.
- Never invent recipe steps.
- Answer only from the supplied recipe.
- Suggest substitutions only if relevant to the current step.
- Provide concise cooking tips.
- Always return valid JSON.

---

## Schemas

Create appropriate request and response schemas.

Examples include:

- StartCookingRequest
- NextStepRequest
- PreviousStepRequest
- RepeatStepRequest
- CookingQuestionRequest

Responses:

- CookingGuideResponse
- CookingQuestionResponse
- CookingFinishResponse

Use Pydantic v2 conventions and validation.

---

## Service Layer

- Use module-level async functions.
- Do not create service classes.
- Reuse the existing AIProvider exactly as used by `recipe_generation_service.py`.
- Validate all inputs.
- Raise `HTTPException` for invalid requests.
- Return responses using `Response.model_validate()`.

---

## API Layer

- Create an `APIRouter` with prefix `/cooking-guide`.
- Import service functions directly.
- Follow the same coding style as the existing Recipe Generation feature.

---

## Coding Standards

- Production-ready code.
- Fully typed.
- Modular and reusable.
- Async throughout.
- Consistent with the existing project architecture.

Generate complete implementations for all files. Do not generate placeholders or pseudocode.