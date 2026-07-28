import apiClient from "./apiClient";

export const getRecipes = async () => {
    const response = await apiClient.get("/recipes/");
    return response.data;
};

export const getRecipe = async (recipeId) => {
    const response = await apiClient.get(`/recipes/${recipeId}`);
    return response.data;
};

export const createRecipe = async (recipe) => {
    const response = await apiClient.post("/recipes/", recipe);
    return response.data;
};

export const updateRecipe = async (recipeId, recipe) => {
    const response = await apiClient.put(`/recipes/${recipeId}`, recipe);
    return response.data;
};

export const deleteRecipe = async (recipeId) => {
    const response = await apiClient.delete(`/recipes/${recipeId}`);
    return response.data;
};

export const generateRecipe = async (payload) => {
    const response = await apiClient.post("/recipes/generate", payload);
    return response.data;
};

export const suggestSubstitutions = async (payload) => {
    const response = await apiClient.post("/recipes/substitute", payload);
    return response.data;
};
