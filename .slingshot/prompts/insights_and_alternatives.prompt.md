# NutriChef AI – Nutrition Insights & Healthy Alternatives

## Objective

Implement a new backend feature called **Nutrition Insights & Healthy Alternatives** for NutriChef AI.

This feature should use the existing AI Provider to analyze recipes and provide nutritional information, health insights, dietary suitability, healthier ingredient alternatives, and personalized health tips.

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

Follow the same architecture as Recipe Generation, Ingredient Substitution, and AI Assistant.

---

# Files to Create

app/
├── api/
│   └── nutrition_api.py
│
├── schemas/
│   └── nutrition_schema.py
│
├── services/
│   └── nutrition_service.py
│
└── utils/
    └── nutrition_prompt_builder.py

---

# Feature Requirements

Create two endpoints.

## 1. Analyze Nutrition

POST /nutrition/analyze

Input

{
    "recipe_name": "Grilled Chicken Salad",
    "ingredients": [
        "Chicken Breast",
        "Lettuce",
        "Tomato",
        "Olive Oil"
    ]
}

The AI should return

- calories
- protein
- carbohydrates
- fat
- fibre
- sugar
- sodium

Also return

- health_score (1–10)
- dietary tags
- health summary

Example response

{
    "nutrition": {
        "calories": 430,
        "protein": 38,
        "carbohydrates": 15,
        "fat": 18,
        "fibre": 6,
        "sugar": 4,
        "sodium": 420
    },
    "health_score": 9,
    "dietary_tags": [
        "High Protein",
        "Low Carb",
        "Gluten Free"
    ],
    "summary": "A balanced meal rich in protein and healthy fats."
}

---

## 2. Healthy Alternatives

POST /nutrition/healthy-alternatives

Input

{
    "ingredients": [
        "Butter",
        "White Rice",
        "Sugar"
    ]
}

Expected Output

{
    "alternatives": [
        {
            "ingredient": "Butter",
            "alternative": "Olive Oil",
            "reason": "Lower saturated fat"
        },
        {
            "ingredient": "White Rice",
            "alternative": "Brown Rice",
            "reason": "Higher fibre"
        }
    ],
    "tips": [
        "Reduce processed sugar whenever possible."
    ]
}

---

# AI Provider

Reuse the existing AIProvider.

Do not create another provider.

Call

provider.generate(prompt)

exactly as done in the AI Assistant feature.

---

# Prompt Builder

Create

build_nutrition_prompt()

The prompt must instruct the LLM to

- return ONLY valid JSON
- never return markdown
- never return explanations outside JSON

---

# JSON Schema

Nutrition endpoint

{
    "nutrition": {
        "calories": 0,
        "protein": 0,
        "carbohydrates": 0,
        "fat": 0,
        "fibre": 0,
        "sugar": 0,
        "sodium": 0
    },
    "health_score": 0,
    "dietary_tags": [],
    "summary": ""
}

Healthy Alternatives endpoint

{
    "alternatives": [
        {
            "ingredient": "",
            "alternative": "",
            "reason": ""
        }
    ],
    "tips": []
}

---

# Validation

Validate that

- required fields exist
- nutrition values are numeric
- dietary_tags is a list
- alternatives contains ingredient, alternative and reason
- tips is a list

Return HTTP 502 for malformed AI responses.

---

# Coding Standards

- Follow existing project structure.
- Use async functions.
- Use module-level service functions.
- Do not create service classes.
- Keep business logic inside services.
- Keep prompt construction inside utils.
- Keep routers lightweight.
- Use Pydantic response models.
- Follow the same coding style as AI Assistant and Ingredient Substitution.

---

# Deliverables

Generate complete production-ready code for

- nutrition_api.py
- nutrition_schema.py
- nutrition_service.py
- nutrition_prompt_builder.py

Ensure the generated code integrates directly with the existing NutriChef AI backend without requiring architectural changes.