import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { FaRegClock, FaRegCalendarAlt } from "react-icons/fa";

export default function DateTime() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 4,
                pb: 2,
                borderBottom: "1px solid #E5E7EB",
            }}
        >
            {/* Date */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                <FaRegCalendarAlt size={18} color="#2E7D32" />

                <Typography variant="body1" fontWeight={600} color="text.secondary">
                    {now.toLocaleDateString("en-IN", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })}
                </Typography>
            </Box>

            {/* Time */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                <FaRegClock size={20} color="#2E7D32" />

                <Typography variant="h6" fontWeight={300}>
                    {now
                        .toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                        })
                        .toUpperCase()}
                </Typography>
            </Box>
        </Box>
    );
}
