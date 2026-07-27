import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from "@mui/material";
import { NavLink } from "react-router-dom";
import {
    FaHome,
    FaBoxOpen,
    FaUtensils,
    FaBookOpen,
    FaAppleAlt,
    FaRecycle,
    FaClock,
    FaRobot,
    FaUser,
} from "react-icons/fa";
const drawerWidth = 240;

const navigation = [
    { label: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    { label: "Pantry", path: "/pantry", icon: <FaBoxOpen /> },
    { label: "Recipes", path: "/recipes", icon: <FaUtensils /> },
    { label: "Cooking Guide", path: "/cooking-guide", icon: <FaBookOpen /> },
    { label: "Nutrition", path: "/nutrition", icon: <FaAppleAlt /> },
    { label: "Leftovers", path: "/leftovers", icon: <FaRecycle /> },
    { label: "Expiry", path: "/expiry", icon: <FaClock /> },
    { label: "Assistant", path: "/assistant", icon: <FaRobot /> },
    { label: "Profiles", path: "/profiles", icon: <FaUser /> },
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
                    top: "64px",
                    height: "calc(100vh - 64px)",
                    borderRight: "1px solid #EEF1EC",
                    backgroundColor: "#FFFFFF",
                },
            }}
        >
            <Toolbar />

            <List>
                {navigation.map((item) => (
                    <ListItemButton
                        key={item.path}
                        component={NavLink}
                        to={item.path}
                        sx={{
                            mx: 1,
                            my: 0.5,
                            borderRadius: 3,
                            "&.active": {
                                backgroundColor: "#EEF8CD",
                                color: "#5A6A2A",
                            },
                            "&.active .MuiListItemIcon-root": {
                                color: "#5A6A2A",
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 30,
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>

                        <ListItemText primary={item.label} />
                    </ListItemButton>
                ))}
            </List>
        </Drawer>
    );
};

export default Sidebar;
