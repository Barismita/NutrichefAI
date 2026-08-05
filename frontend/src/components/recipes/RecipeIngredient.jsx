import { Paper, Typography, Box } from "@mui/material";
import { FaCheckCircle } from "react-icons/fa";
export default function RecipeIngredient({ ingredient }) {
    const text =
        typeof ingredient === "string"
            ? ingredient
            : `${ingredient.name}${ingredient.quantity ? ` - ${ingredient.quantity}` : ""}`;

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid #E5E7EB",
                display: "flex",
                alignItems: "center",
                gap: 2,
            }}
        >
            <FaCheckCircle size={20} color="#2E7D32" />

            <Typography>{text}</Typography>
        </Paper>
    );
}
