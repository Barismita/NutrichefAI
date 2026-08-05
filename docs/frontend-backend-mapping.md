# Frontend ↔ Backend Mapping

This document maps each frontend page to the backend APIs it consumes.

---

# Dashboard

## Purpose

Provide an overview of the user's kitchen.

### APIs

| Method | Endpoint          | Purpose                   |
|--------|-------------------|---------------------------|
| GET    | `/pantry`         | Load pantry               |
| POST   | `/expiry/analyze` | Show expiring ingredients |
| GET    | `/recipes/`       | Recently created recipes  |

---

# Pantry

## Purpose

Manage pantry inventory.

### APIs

| Method | Endpoint               | Purpose           |
|--------|------------------------|-------------------|
| GET    | `/pantry`              | Load pantry       |
| POST   | `/pantry`              | Add ingredients   |
| DELETE | `/pantry/{ingredient}` | Delete ingredient |

---

# Recipes

## Purpose

Manage saved recipes.

### APIs

| Method | Endpoint               | Purpose       |
|--------|------------------------|---------------|
| GET    | `/recipes/`            | List recipes  |
| POST   | `/recipes/`            | Create recipe |
| GET    | `/recipes/{recipe_id}` | View recipe   |
| PUT    | `/recipes/{recipe_id}` | Update recipe |
| DELETE | `/recipes/{recipe_id}` | Delete recipe |

---

# AI Recipe Generator

## Purpose

Generate recipes using AI.

### APIs

| Method | Endpoint              | Purpose                          |
|--------|-----------------------|----------------------------------|
| POST   | `/recipes/generate`   | Generate recipe                  |
| POST   | `/recipes/substitute` | Suggest ingredient substitutions |

---

# Cooking Guide

## Purpose

Provide step-by-step cooking assistance.

### APIs

| Method | Endpoint                  | Purpose         |
|--------|---------------------------|-----------------|
| POST   | `/cooking-guide/start`    | Start guide     |
| POST   | `/cooking-guide/next`     | Next step       |
| POST   | `/cooking-guide/previous` | Previous step   |
| POST   | `/cooking-guide/repeat`   | Repeat step     |
| POST   | `/cooking-guide/question` | Ask AI question |
| POST   | `/cooking-guide/finish`   | Finish cooking  |

---

# Nutrition

## Purpose

Analyze nutritional information.

### APIs

| Method | Endpoint                          | Purpose                        |
|--------|-----------------------------------|--------------------------------|
| POST   | `/nutrition/analyze`              | Analyze nutrition              |
| POST   | `/nutrition/healthy-alternatives` | Suggest healthier alternatives |

---

# Leftover Recipes

## Purpose

Generate recipes from leftovers.

### APIs

| Method | Endpoint             | Purpose         |
|--------|----------------------|-----------------|
| POST   | `/leftovers/suggest` | Suggest recipes |

---

# Pantry Expiry

## Purpose

Monitor pantry expiry.

### APIs

| Method | Endpoint          | Purpose        |
|--------|-------------------|----------------|
| POST   | `/expiry/analyze` | Analyze expiry |

---

# AI Assistant

## Purpose

Chat with NutriChef AI.

### APIs

| Method | Endpoint          | Purpose         |
|--------|-------------------|-----------------|
| POST   | `/assistant/chat` | AI conversation |

---

# User Profiles

## Purpose

Manage cooking preferences.

### APIs

| Method | Endpoint                 | Purpose        |
|--------|--------------------------|----------------|
| GET    | `/profiles/`             | List profiles  |
| POST   | `/profiles/`             | Create profile |
| GET    | `/profiles/{profile_id}` | View profile   |
| PUT    | `/profiles/{profile_id}` | Update profile |
| DELETE | `/profiles/{profile_id}` | Delete profile |

---

# Shared Components

| Component       | APIs Used         |
|-----------------|-------------------|
| Loading Spinner | All               |
| Error Message   | All               |
| Empty State     | GET endpoints     |
| Confirm Dialog  | DELETE endpoints  |
| Search Bar      | Pantry, Recipes   |
| AI Chat Widget  | `/assistant/chat` |