import { Box, Typography } from "@mui/material";

const PageHeader = ({ title, subtitle, action }) => {
    return (
        <Box
            mb={3}
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <Box>
                <Typography variant="h4" fontWeight={700}>
                    {title}
                </Typography>

                {subtitle && <Typography color="text.secondary">{subtitle}</Typography>}
            </Box>

            {action}
        </Box>
    );
};

export default PageHeader;
