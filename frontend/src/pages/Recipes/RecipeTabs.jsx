import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { FaHeart, FaHistory } from "react-icons/fa";
import { LuCookingPot } from "react-icons/lu";

export default function RecipeTabs({ value, onChange }) {
    return (
        <ToggleButtonGroup
            exclusive
            value={value}
            onChange={(e, newValue) => {
                if (newValue !== null) onChange(newValue);
            }}
            sx={{
                display: "flex",
                justifyContent: "center",
                gap: 3,
                mb: 5,

                "& .MuiToggleButton-root": {
                    flex: 1,
                    maxWidth: 320,
                    height: 58,
                    borderRadius: "999px !important",
                    border: "1px solid #D7E8DD",
                    background: "#FFFFFF",
                    color: "#5F6F65",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: 17,
                    transition: "all .2s ease",
                },

                "& .MuiToggleButton-root:hover": {
                    background: "#F6FFF9",
                },

                "& .Mui-selected": {
                    background: "#E9FFF0 !important",
                    color: "#15803D !important",
                    border: "2px solid #22C55E !important",
                    boxShadow: "none",
                },
            }}
        >
            <ToggleButton value={0}>
                <LuCookingPot size={22} style={{ marginRight: 10 }} />
                Generate Recipes
            </ToggleButton>

            <ToggleButton value={1}>
                <FaHeart size={20} style={{ marginRight: 10 }} />
                Saved Recipes
            </ToggleButton>

            <ToggleButton value={2}>
                <FaHistory size={20} style={{ marginRight: 10 }} />
                History
            </ToggleButton>
        </ToggleButtonGroup>
    );
}
