import { Box } from "@mui/material";

const PageContainer = ({ children }) => {
    return (
        <Box
            component="main"
            sx={{
                flex: 1,
            }}
        >
            {children}
        </Box>
    );
};

export default PageContainer;
