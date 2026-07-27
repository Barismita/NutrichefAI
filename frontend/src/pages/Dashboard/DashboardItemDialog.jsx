import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    IconButton,
    Chip,
    Box,
    Paper,
} from "@mui/material";

import { FaTimes } from "react-icons/fa";
import { FaGlassWater, FaCarrot, FaAppleWhole, FaWheatAwn, FaBottleWater } from "react-icons/fa6";
import { GiSaltShaker, GiMeat, GiCardboardBox } from "react-icons/gi";

dayjs.extend(relativeTime);

const categoryIcons = {
    Dairy: <FaGlassWater />,
    Vegetables: <FaCarrot />,
    Fruits: <FaAppleWhole />,
    Grains: <FaWheatAwn />,
    Spices: <GiSaltShaker />,
    Meat: <GiMeat />,
    Beverages: <FaBottleWater />,
    Other: <GiCardboardBox />,
};

export default function DashboardItemDialog({ open, title, items, onClose }) {
    const getChip = (item) => {
        if (!item.expiry_date) return null;

        const today = dayjs().startOf("day");
        const expiry = dayjs(item.expiry_date).startOf("day");
        const days = expiry.diff(today, "day");

        if (days < 0) {
            return <Chip label="Expired" color="error" size="small" />;
        }

        if (days === 0) {
            return <Chip label="Today" color="error" size="small" />;
        }

        if (days === 1) {
            return <Chip label="Tomorrow" color="warning" size="small" />;
        }

        return (
            <Chip
                label={`In ${days} days`}
                sx={{
                    bgcolor: "#FFF3E0",
                    color: "#E65100",
                    fontWeight: 600,
                }}
                size="small"
            />
        );
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: 4,
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 2.5,
                    px: 3.5,
                    borderBottom: "1px solid #ECEFF1",
                }}
            >
                <Typography variant="h5" fontWeight={700}>
                    {title} ({items.length})
                </Typography>

                <IconButton
                    onClick={onClose}
                    sx={{
                        bgcolor: "#F5F5F5",
                        "&:hover": {
                            bgcolor: "#EEEEEE",
                        },
                    }}
                >
                    <FaTimes size={15} />
                </IconButton>
            </DialogTitle>

            <DialogContent
                sx={{
                    p: 3,
                    bgcolor: "#FAFAFA",
                }}
            >
                {items.length === 0 ? (
                    <Box py={8} textAlign="center">
                        <Typography variant="h6" gutterBottom>
                            🎉 Nothing here
                        </Typography>

                        <Typography color="text.secondary">No ingredients found.</Typography>
                    </Box>
                ) : (
                    <Box display="flex" flexDirection="column" gap={2}>
                        {items.map((item) => (
                            <Paper
                                key={item.id ?? item.name}
                                elevation={0}
                                sx={{
                                    p: 2.5,
                                    borderRadius: 3,
                                    border: "1px solid #E8ECEF",
                                    transition: "0.2s",
                                    "&:hover": {
                                        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                                    },
                                }}
                            >
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="flex-start"
                                >
                                    <Box display="flex" gap={2}>
                                        <Box
                                            sx={{
                                                width: 46,
                                                height: 46,
                                                borderRadius: "50%",
                                                bgcolor: "#E8F5E9",
                                                color: "#2E7D32",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                fontSize: 22,
                                                flexShrink: 0,
                                            }}
                                        >
                                            {categoryIcons[item.category] ?? <GiCardboardBox />}
                                        </Box>

                                        <Box>
                                            <Typography fontWeight={700} fontSize={18}>
                                                {item.name}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                mt={0.5}
                                            >
                                                {item.quantity} {item.unit}
                                                {item.category && ` • ${item.category}`}
                                            </Typography>

                                            {item.expiry_date && (
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    display="block"
                                                    mt={0.75}
                                                >
                                                    Expires{" "}
                                                    {dayjs(item.expiry_date).format("DD MMM YYYY")}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>

                                    {getChip(item)}
                                </Box>
                            </Paper>
                        ))}
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}
