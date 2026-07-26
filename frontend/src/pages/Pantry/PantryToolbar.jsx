import { Box, Button } from "@mui/material";
import { SearchBar } from "../../components/common";

export default function PantryToolbar({ search, setSearch, onAdd }) {
    return (
        <Box
            sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                mb: 3,
            }}
        >
            <Box sx={{ flex: 1 }}>
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Search ingredients..."
                />
            </Box>

            <Button
                variant="contained"
                onClick={onAdd}
                sx={{
                    whiteSpace: "nowrap",
                    px: 3,
                }}
            >
                Add Ingredient
            </Button>
        </Box>
    );
}
