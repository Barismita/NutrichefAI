import apiClient from "./apiClient";

export const getPantry = async () => {
    const { data } = await apiClient.get("/pantry");
    return data;
};

export const savePantry = async (pantry) => {
    const { data } = await apiClient.post("/pantry", pantry);
    return data;
};

export const deleteIngredient = async (ingredient) => {
    const { data } = await apiClient.delete(`/pantry/${ingredient}`);
    return data;
};

export const updateIngredient = async (ingredientName, ingredient) => {
    const { data } = await apiClient.put(`/pantry/${ingredientName}`, ingredient);
    return data;
};
