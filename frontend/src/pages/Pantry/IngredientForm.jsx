import { useMemo, useState } from "react";

import { Box, Button, MenuItem, Stack, TextField, Typography } from "@mui/material";

const UNITS = ["pcs", "g", "kg", "ml", "L", "tbsp", "tsp", "cup"];

const CATEGORIES = [
    "Vegetables",
    "Fruits",
    "Dairy",
    "Meat",
    "Seafood",
    "Grains",
    "Spices",
    "Beverages",
    "Other",
];

const defaultValues = {
    name: "",
    quantity: "",
    unit: "",
    category: "",
    expiry_date: "",
    notes: "",
};

export default function IngredientForm({ initialValues, onSubmit }) {
    const initialForm = useMemo(
        () => ({
            ...defaultValues,
            ...(initialValues || {}),
        }),
        [initialValues]
    );

    const [formData, setFormData] = useState(initialForm);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!formData.name.trim()) {
            alert("Ingredient name is required.");
            return;
        }

        onSubmit({
            ...formData,
            quantity: Number(formData.quantity),
        });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Stack spacing={2.5} sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Typography sx={{ width: 150, fontWeight: 600 }}>Ingredient Name</Typography>

                    <TextField
                        fullWidth
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Typography sx={{ width: 150, fontWeight: 600 }}>Quantity</Typography>

                    <TextField
                        fullWidth
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                    />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Typography sx={{ width: 150, fontWeight: 600 }}>Unit</Typography>

                    <TextField
                        select
                        fullWidth
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                    >
                        {UNITS.map((unit) => (
                            <MenuItem key={unit} value={unit}>
                                {unit}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Typography sx={{ width: 150, fontWeight: 600 }}>Category</Typography>

                    <TextField
                        select
                        fullWidth
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        {CATEGORIES.map((category) => (
                            <MenuItem key={category} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Typography sx={{ width: 150, fontWeight: 600 }}>Expiry Date</Typography>

                    <TextField
                        fullWidth
                        type="date"
                        name="expiry_date"
                        value={formData.expiry_date}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                    />
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
                    <Typography sx={{ width: 150, fontWeight: 600, mt: 1 }}>Notes</Typography>

                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                    />
                </Box>

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{
                        mt: 2,
                        alignSelf: "flex-end",
                        px: 5,
                    }}
                >
                    Save Ingredient
                </Button>
            </Stack>
        </Box>
    );
}
