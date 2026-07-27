import { FaTrashAlt } from "react-icons/fa";
import dayjs from "dayjs";

import {
    Box,
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
                width: "100%",
                maxHeight: 460,
                overflowY: "auto",
                overflowX: "hidden",

                border: "1px solid #E5E7EB",
                borderRadius: 2,

                // This prevents the scrollbar from overlapping the content
                scrollbarGutter: "stable",

                overflow: "hidden auto",

                "&::-webkit-scrollbar": {
                    width: 8,
                },
                "&::-webkit-scrollbar-track": {
                    marginTop: 56,
                    marginBottom: 4,
                    borderRadius: 999,
                },
                "&::-webkit-scrollbar-thumb": {
                    borderRadius: 999,
                },
            }}
        >
            <Table
                stickyHeader
                sx={{
                    width: "100%",
                    tableLayout: "fixed",
                }}
            >
                <TableHead
                    sx={{
                        backgroundColor: "#F7FAF7",
                    }}
                >
                    <TableRow>
                        <TableCell
                            sx={{
                                fontWeight: 700,
                                fontSize: 17,
                                borderBottom: "1px solid #E5E7EB",
                            }}
                        >
                            Ingredient
                        </TableCell>

                        <TableCell
                            align="center"
                            sx={{
                                fontWeight: 700,
                                width: "16%",
                            }}
                        >
                            Quantity
                        </TableCell>

                        <TableCell
                            align="center"
                            sx={{
                                fontWeight: 700,
                                width: "20%",
                            }}
                        >
                            Category
                        </TableCell>

                        <TableCell
                            align="center"
                            sx={{
                                fontWeight: 700,
                                width: "24%",
                            }}
                        >
                            Expiry Date
                        </TableCell>

                        <TableCell
                            align="center"
                            sx={{
                                fontWeight: 700,
                                width: "12%",
                            }}
                        >
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
                                height: 66,
                                transition: "0.2s",

                                "&:hover": {
                                    backgroundColor: "#F8FFF8",
                                },

                                "& td": {
                                    borderBottom: "1px solid #ECECEC",
                                    py: 1.2,
                                    verticalAlign: "middle",
                                },
                            }}
                        >
                            <TableCell>
                                <Typography fontWeight={600} fontSize={18}>
                                    {ingredient.name}
                                </Typography>
                            </TableCell>

                            <TableCell align="center">
                                {ingredient.quantity} {ingredient.unit}
                            </TableCell>

                            <TableCell align="center">
                                <Chip
                                    label={ingredient.category}
                                    color={categoryColor(ingredient.category)}
                                    size="small"
                                    sx={{
                                        height: 26,
                                        fontSize: 13,
                                        px: 0.5,
                                        fontWeight: 500,
                                    }}
                                />
                            </TableCell>

                            <TableCell
                                align="center"
                                sx={{
                                    width: "22%",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 150,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1.2,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 12,
                                                height: 12,
                                                borderRadius: "50%",
                                                flexShrink: 0,
                                                bgcolor: (() => {
                                                    if (!ingredient.expiry_date) return "#BDBDBD";

                                                    const today = dayjs().startOf("day");
                                                    const expiry = dayjs(
                                                        ingredient.expiry_date
                                                    ).startOf("day");
                                                    const daysLeft = expiry.diff(today, "day");

                                                    if (daysLeft <= 0) return "#E53935";
                                                    if (daysLeft <= 7) return "#FBC02D";
                                                    return "#43A047";
                                                })(),
                                            }}
                                        />

                                        <Typography
                                            sx={{
                                                fontWeight: 500,
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {ingredient.expiry_date
                                                ? dayjs(ingredient.expiry_date).format("D MMM YYYY")
                                                : "-"}
                                        </Typography>
                                    </Box>
                                </Box>
                            </TableCell>

                            <TableCell align="center">
                                <Tooltip title="Delete ingredient">
                                    <IconButton
                                        color="error"
                                        size="small"
                                        sx={{ p: 0.8 }}
                                        onClick={() => onDelete(ingredient)}
                                    >
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
