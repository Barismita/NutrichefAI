import { FaTrashAlt } from "react-icons/fa";
import {
    Chip,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";

const categoryColor = (category) => {
    switch (category?.toLowerCase()) {
        case "vegetables":
            return "success";

        case "fruits":
            return "warning";

        case "dairy":
            return "primary";

        case "meat":
            return "error";

        case "seafood":
            return "info";

        case "grains":
            return "secondary";

        default:
            return "default";
    }
};

export default function PantryTable({ ingredients, onDelete }) {
    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{
                borderRadius: 3,
                border: "1px solid #E5E7EB",
                overflow: "hidden",
            }}
        >
            <Table>
                <TableHead>
                    <TableRow
                        sx={{
                            backgroundColor: "#F4F8F4",
                        }}
                    >
                        <TableCell sx={{ fontWeight: 700 }}>Ingredient</TableCell>

                        <TableCell align="center" sx={{ fontWeight: 700 }}>
                            Quantity
                        </TableCell>

                        <TableCell align="center" sx={{ fontWeight: 700 }}>
                            Category
                        </TableCell>

                        <TableCell align="center" sx={{ fontWeight: 700 }}>
                            Expiry Date
                        </TableCell>

                        <TableCell align="center" sx={{ fontWeight: 700 }}>
                            Action
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {ingredients.map((ingredient) => (
                        <TableRow
                            key={ingredient.name}
                            hover
                            sx={{
                                transition: "0.2s",

                                "&:hover": {
                                    backgroundColor: "#F8FFF8",
                                },

                                "& td": {
                                    borderBottom: "1px solid #ECECEC",
                                },
                            }}
                        >
                            <TableCell>
                                <Typography fontWeight={600}>{ingredient.name}</Typography>
                            </TableCell>

                            <TableCell align="center">
                                {ingredient.quantity} {ingredient.unit}
                            </TableCell>

                            <TableCell align="center">
                                <Chip
                                    label={ingredient.category}
                                    color={categoryColor(ingredient.category)}
                                    size="small"
                                />
                            </TableCell>

                            <TableCell align="center">
                                {ingredient.expiry_date
                                    ? new Date(ingredient.expiry_date).toLocaleDateString("en-GB", {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                      })
                                    : "-"}
                            </TableCell>

                            <TableCell align="center">
                                <Tooltip title="Delete ingredient">
                                    <IconButton color="error" onClick={() => onDelete(ingredient)}>
                                        <FaTrashAlt />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
