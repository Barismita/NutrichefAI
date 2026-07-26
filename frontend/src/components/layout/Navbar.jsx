import { AppBar, Toolbar, Typography } from "@mui/material";

const Navbar = () => {
    return (
        <AppBar position="static" elevation={1}>
            <Toolbar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    NutriChef AI
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
