# NutriChef AI – Leftover Food Rescue Ideas

## Objective

Implement a new backend feature called **Leftover Food Rescue Ideas** for NutriChef AI.

This feature should intelligently suggest recipes that can be prepared using leftover ingredients available with the user. It should also recommend any optional ingredients that could improve the recipe while minimizing food waste.

Follow the existing project architecture and coding standards.

---

# Tech Stack

- Python 3.11
- FastAPI
- MongoDB
- Beanie ODM
- Pydantic v2
- Async APIs
- Existing AIProvider
- Existing Prompt Builder pattern

---

# Existing Project Structure

app/
├── api/
├── schemas/
├── services/
├── utils/
├── models/
└── main.py

Follow the same architecture as:

- Recipe Generation
- Ingredient Substitution
- AI Assistant
- Nutrition Insights

Do not introduce a new architecture.

---

# Files to Create

app/
├── api/
│   └── leftover_api.py
│
├── schemas/
│   └── leftover_schema.py
│
├── services/
│   └── leftover_service.py
│
└── utils/
    └── leftover_prompt_builder.py

---

# Feature Requirements

Create one endpoint.

## POST /leftovers/suggest

The endpoint should suggest recipes that can be prepared primarily using leftover ingredients.

Input

```json
{
    "ingredients": [
        "Rice",
        "Paneer",
        "Capsicum",
        "Onion"
    ]
}
```

---

# Expected Response

```json
{
    "recipes": [
        {
            "title": "Paneer Fried Rice",
            "description": "A quick fried rice made using leftover rice and vegetables.",
            "difficulty": "Easy",
            "estimated_time": 20,
            "required_ingredients": [
                "Rice",
                "Paneer",
                "Capsicum",
                "Onion"
            ],
            "optional_ingredients": [
                "Soy Sauce",
                "Spring Onion"
            ],
            "waste_reduction_tip": "Use leftover cooked rice instead of preparing fresh rice."
        }
    ],
    "general_tips": [
        "Store cooked rice in an airtight container.",
        "Use vegetables nearing spoilage first."
    ]
}
```

---

# AI Behaviour

The AI should

- Suggest recipes using maximum available ingredients.
- Minimize food waste.
- Recommend optional ingredients separately.
- Prefer quick recipes.
- Recommend practical home-cooking recipes.
- Provide food storage or waste reduction tips.
- Never invent unavailable required ingredients.
- Return multiple recipes whenever possible.

---

# AI Provider

Reuse the existing AIProvider.

Do not create another provider.

Call

```python
provider.generate(prompt)
```

exactly as implemented in AI Assistant and Nutrition features.

---

# Prompt Builder

Create

```python
build_leftover_prompt()
```

The prompt must instruct the AI to

- Return ONLY valid JSON.
- Never return markdown.
- Never return explanations outside JSON.
- Never include text before or after the JSON.

---

# JSON Schema

```json
{
    "recipes": [
        {
            "title": "",
            "description": "",
            "difficulty": "",
            "estimated_time": 0,
            "required_ingredients": [],
            "optional_ingredients": [],
            "waste_reduction_tip": ""
        }
    ],
    "general_tips": []
}
```

---

# Validation

Validate that

The response contains

- recipes
- general_tips

Each recipe must contain

- title
- description
- difficulty
- estimated_time
- required_ingredients
- optional_ingredients
- waste_reduction_tip

Validate

- estimated_time is numeric
- required_ingredients is a list
- optional_ingredients is a list
- general_tips is a list

Return HTTP 502 for

- AI provider failures
- Invalid JSON
- Missing required fields
- Invalid schema

---

# Coding Standards

- Follow the existing project architecture.
- Use async functions.
- Use module-level service functions.
- Do not create service classes.
- Keep business logic inside services.
- Keep prompt construction inside utils.
- Keep routers lightweight.
- Use Pydantic response models.
- Follow the same coding style as AI Assistant, Ingredient Substitution and Nutrition Insights.

---

# Deliverables

Generate complete production-ready code for

- leftover_api.py
- leftover_schema.py
- leftover_service.py
- leftover_prompt_builder.py

Finally generate

- test_leftover.py

The test file should contain approximately 8 concise tests covering

- Service success
- AI provider failure
- Invalid JSON
- Missing required fields
- Request schema validation
- Response schema validation
- POST /leftovers/suggest API success
- API validation failure

Ensure all generated code integrates directly with the existing NutriChef AI backend without requiring architectural changes.