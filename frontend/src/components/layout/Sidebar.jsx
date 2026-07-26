import { Drawer, List, ListItemButton, ListItemText, Toolbar } from "@mui/material";
import { NavLink } from "react-router-dom";

const drawerWidth = 240;

const navigation = [
    { label: "Dashboard", path: "/" },
    { label: "Pantry", path: "/pantry" },
    { label: "Recipes", path: "/recipes" },
    { label: "Cooking Guide", path: "/cooking-guide" },
    { label: "Nutrition", path: "/nutrition" },
    { label: "Leftovers", path: "/leftovers" },
    { label: "Expiry", path: "/expiry" },
    { label: "Assistant", path: "/assistant" },
    { label: "Profiles", path: "/profiles" },
];

const Sidebar = () => {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                },
            }}
        >
            <Toolbar />

            <List>
                {navigation.map((item) => (
                    <ListItemButton key={item.path} component={NavLink} to={item.path}>
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                ))}
            </List>
        </Drawer>
    );
};

export default Sidebar;
