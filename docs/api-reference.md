# NutriChef AI API Reference

Base URL

```
http://127.0.0.1:8000
```

---

# Health

## GET /

Returns API status.

---

## GET /health

Health check endpoint.

---

# Pantry

## GET /pantry

Returns the current user's pantry.

Response

- PantryResponse

---

## POST /pantry

Adds a single ingredient to the pantry.

Request

- IngredientRequest

Response

- PantryResponse

---

## DELETE /pantry/{ingredient_name}

Deletes an ingredient by name.

Path Parameter

- ingredient_name

Response

- PantryResponse

# Recipes

## POST /recipes/

Create a recipe.

Request

- RecipeCreate

Response

- RecipeResponse

---

## GET /recipes/

Retrieve all recipes.

Response

- List[RecipeResponse]

---

## GET /recipes/{recipe_id}

Retrieve a recipe.

Path Parameter

- recipe_id

Response

- RecipeResponse

---

## PUT /recipes/{recipe_id}

Update a recipe.

Request

- RecipeUpdate

Response

- RecipeResponse

---

## DELETE /recipes/{recipe_id}

Delete a recipe.

---

## POST /recipes/generate

Generate a recipe using AI.

Request

- RecipeGenerationRequest

Response

- RecipeGenerationResponse

---

## POST /recipes/substitute

Suggest ingredient substitutions.

Request

- IngredientSubstitutionRequest

Response

- IngredientSubstitutionResponse

---

# Profiles

## GET /profiles/

Retrieve all profiles.

---

## POST /profiles/

Create a profile.

Request

- CreateProfileRequest

Response

- ProfileResponse

---

## GET /profiles/{profile_id}

Retrieve a profile.

---

## PUT /profiles/{profile_id}

Update a profile.

Request

- UpdateProfileRequest

---

## DELETE /profiles/{profile_id}

Delete a profile.

---

# AI Assistant

## POST /assistant/chat

Chat with the AI assistant.

Request

- AssistantChatRequest

Response

- AssistantChatResponse

---

# Cooking Guide

## POST /cooking-guide/start

Start a guided cooking session.

Request

- StartCookingRequest

Response

- CookingGuideResponse

---

## POST /cooking-guide/next

Move to the next cooking step.

Request

- StepNavigationRequest

---

## POST /cooking-guide/previous

Move to the previous cooking step.

---

## POST /cooking-guide/repeat

Repeat the current cooking step.

---

## POST /cooking-guide/question

Ask a question during cooking.

Request

- CookingQuestionRequest

Response

- CookingQuestionResponse

---

## POST /cooking-guide/finish

Finish the cooking session.

Response

- CookingFinishResponse

---

# Nutrition

## POST /nutrition/analyze

Analyze nutritional information.

Request

- NutritionAnalysisRequest

Response

- NutritionAnalysisResponse

---

## POST /nutrition/healthy-alternatives

Suggest healthier alternatives.

Request

- HealthyAlternativesRequest

Response

- HealthyAlternativesResponse

---

# Leftovers

## POST /leftovers/suggest

Generate recipes using leftover ingredients.

Request

- LeftoverRecipeRequest

Response

- LeftoverRecipeResponse

---

# Pantry Expiry

## POST /expiry/analyze

Analyze pantry expiry dates.

Request

- ExpiryRequest

Response

- ExpiryResponse