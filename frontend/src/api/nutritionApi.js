import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function analyzeNutrition(recipeName, ingredients) {
    const response = await axios.post(`${API_BASE_URL}/nutrition/analyze`, {
        recipe_name: recipeName,
        ingredients,
    });

    return response.data;
}

export async function getHealthyAlternatives(ingredients) {
    const response = await axios.post(`${API_BASE_URL}/nutrition/healthy-alternatives`, {
        ingredients,
    });

    return response.data;
}
