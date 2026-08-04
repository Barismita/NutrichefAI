import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function suggestLeftoverRecipes(ingredients) {
    const response = await axios.post(`${API_BASE_URL}/leftovers/suggest`, {
        ingredients,
    });

    return response.data;
}
