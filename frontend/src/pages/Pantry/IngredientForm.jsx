import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

import {
    Box,
    Grid,
    InputAdornment,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { FaBalanceScale, FaCarrot, FaLayerGroup, FaStickyNote } from "react-icons/fa";

const UNITS = ["pcs", "g", "kg", "ml", "L", "tbsp", "tsp", "cup"];

const CATEGORIES = [
    {
        value: "Vegetables",
        icon: "🥬",
    },
    {
        value: "Fruits",
        icon: "🍎",
    },
    {
        value: "Dairy",
        icon: "🥛",
    },
    {
        value: "Meat",
        icon: "🍖",
    },
    {
        value: "Grains",
        icon: "🌾",
    },
    {
        value: "Spices",
        icon: "🌶️",
    },
    {
        value: "Beverages",
        icon: "🥤",
    },
    {
        value: "Other",
        icon: "📦",
    },
];

const defaultValues = {
    name: "",
    quantity: "",
    unit: "",
    category: "",
    expiry_date: null,
    notes: "",
};

export default function IngredientForm({ initialValues, onSubmit }) {
    const initialForm = useMemo(
        () => ({
            ...defaultValues,
            ...(initialValues || {}),
            expiry_date: initialValues?.expiry_date ? dayjs(initialValues.expiry_date) : null,
        }),
        [initialValues]
    );

    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        setFormData(initialForm);
    }, [initialForm]);

    const [calendarOpen, setCalendarOpen] = useState(false);

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
            expiry_date: formData.expiry_date ? formData.expiry_date.format("YYYY-MM-DD") : "",
        });
    };

    return (
        <Box component="form" id="ingredient-form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
                <Paper
                    elevation={0}
                    variant="outlined"
                    sx={{
                        p: 4,
                        borderRadius: 4,
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{
                            mb: 3,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        🥕 Ingredient Details
                    </Typography>

                    <Grid container spacing={2.5}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                required
                                label="Ingredient Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FaCarrot />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid
                            size={{
                                xs: 12,
                                md: 6,
                            }}
                        >
                            <TextField
                                fullWidth
                                type="number"
                                label="Quantity"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FaBalanceScale />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid
                            size={{
                                xs: 12,
                                md: 6,
                            }}
                        >
                            <TextField
                                select
                                fullWidth
                                label="Unit"
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
                        </Grid>
                        <Grid
                            size={{
                                xs: 12,
                                md: 6,
                            }}
                        >
                            <TextField
                                select
                                fullWidth
                                label="Category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FaLayerGroup />
                                        </InputAdornment>
                                    ),
                                }}
                            >
                                {CATEGORIES.map((category) => (
                                    <MenuItem key={category.value} value={category.value}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >
                                            <span>{category.icon}</span>
                                            <span>{category.value}</span>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid
                            size={{
                                xs: 12,
                                md: 6,
                            }}
                        >
                            <DatePicker
                                label="Expiry Date"
                                value={formData.expiry_date}
                                minDate={dayjs().add(1, "day")}
                                onChange={(value) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        expiry_date: value,
                                    }))
                                }
                                format="DD MMM YYYY"
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        onClick: () => setCalendarOpen(true),
                                        placeholder: "",
                                        inputProps: {
                                            placeholder: "",
                                        },
                                    },
                                }}
                                open={calendarOpen}
                                onOpen={() => setCalendarOpen(true)}
                                onClose={() => setCalendarOpen(false)}
                            />
                        </Grid>

                        <Grid
                            size={{
                                xs: 12,
                            }}
                        >
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Optional notes about this ingredient..."
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment
                                            position="start"
                                            sx={{
                                                alignSelf: "flex-start",
                                                mt: 1.5,
                                            }}
                                        >
                                            <FaStickyNote />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                </Paper>
                <Box
                    sx={{
                        mt: 1,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                    }}
                >
                    {formData.category && (
                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                Selected Category
                            </Typography>

                            <Box sx={{ mt: 0.5 }}>
                                <Typography
                                    sx={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 1,
                                        px: 2,
                                        py: 0.7,
                                        borderRadius: 5,
                                        bgcolor: "#E8F5E9",
                                        color: "#2E7D32",
                                        fontWeight: 600,
                                        fontSize: 14,
                                    }}
                                >
                                    {CATEGORIES.find((c) => c.value === formData.category)?.icon}

                                    {formData.category}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Stack>
        </Box>
    );
}
