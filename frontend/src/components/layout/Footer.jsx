import { Box, Typography } from "@mui/material";

const Footer = () => {
    return (
        <Box
            sx={{
                py: 2,
                textAlign: "center",
                borderTop: 1,
                borderColor: "divider",
            }}
        >
            <Typography variant="body2" color="text.secondary">
                NutriChef AI • Version 1.0.0
            </Typography>
        </Box>
    );
};

export default Footer;
