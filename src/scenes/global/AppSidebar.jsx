import { createContext, useContext, useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Link } from "react-router-dom";
import { tokens } from '../../theme';
import AuthService from '../../services/authService';

// ICONS
import LibraryBooksIcon from '@mui/icons-material/TableRestaurant';
import AddIcon from '@mui/icons-material/Add';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import KitchenIcon from '@mui/icons-material/Kitchen';

/**Now takes a param for the current path and uses it for the styling and track current path */
const AppSidebar = ({currentPath}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(true);
    // [selected, setSelected] removed to solely use the useLocation() import in App.js to track current path

    const handleLogout = () => {
        AuthService.logout();
    };

    return (
        <Box sx={{
            "& .ps-sidebar-root": {
                height: '100%',
                border: 'none',
            },
            "& .ps-sidebar-container": {
                background: `#626262 !important`,
                height: '100%',
            },
            "& .ps-menu-icon": {
                backgroundColor: "transparent !important"
            },
            "& .ps-menu-button": {
                padding: "5px 35px 5px 20px !important"
            },
            "& .ps-menu-button:hover": {
                color: "#868dfb !important",
                backgroundColor: "transparent !important"
            },
        }}>
            <Sidebar collapsed={isCollapsed}>
                <Menu iconShape="square">
                    {/* COLLAPSABLE BUTTON */}
                    <MenuItem
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        icon={isCollapsed ? <MenuOutlinedIcon style={{ color: 'white' }} /> : undefined }
                        style={{
                            margin: "10px 0 0 0",
                            color: "white",
                        }}
                    >
                    {!isCollapsed && (
                        <Box
                            display="flex"
                            alignItems="center"
                        >
                        <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                            <MenuOutlinedIcon style={{ color: 'white' }} />
                        </IconButton>
                        <Typography variant="h3" color={colors.brown[100]}>
                            Bean Scene
                        </Typography>
                        </Box>
                    )}
                    </MenuItem>

                    {/* MENU ITEMS */}
                    <Box>
                        <Item
                            active={currentPath === "/"} 
                            title="Dashboard"
                            to="/"
                            icon={<HomeOutlinedIcon />}
                        />
                    </Box>
                    <Box>
                        <Item 
                            active={currentPath === "/form"} 
                            title="Add Reservation"
                            to="/form"
                            icon={<AddIcon />}
                        />
                    </Box>
                    <Box>
                        <Item
                            active={currentPath === "/reservations"} 
                            title="Reservations"
                            to="/reservations"
                            icon={<LibraryBooksIcon />}
                        />
                    </Box>
                    <Box>
                        <Item
                            active={currentPath === "/ordering"}  
                            title="Place Order"
                            to="/ordering"
                            icon={<RestaurantMenuIcon />}
                        />
                    </Box>
                    <Box>
                        <Item 
                            active={currentPath === "/orders"}
                            title="View Orders"
                            to="/orders"
                            icon={<KitchenIcon />}
                        />
                    </Box>
                    <Box>
                        <Item 
                            active={currentPath === "/help"}
                            title="Help"
                            to="/help"
                            icon={<QuestionMarkIcon />}
                        />
                    </Box>
                    <Box>
                        <Item 
                            active={currentPath === "/settings"}
                            title="Settings"
                            to="/settings"
                            icon={<SettingsIcon />}
                        />
                    </Box>
                    <Box mt="auto" mb={2}>
                        <Item
                            title="Logout"
                            icon={<LogoutIcon />}
                            onClick={handleLogout}
                            isLogout={true}
                        />
                    </Box>
                </Menu>
            </Sidebar>
        </Box>
    )
}

export default AppSidebar;

// MENU ITEM FORMAT
const Item = ({ title, to, icon, active, setSelected, onClick, isLogout }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    const menuItem = (
        <MenuItem
            active={active}  // Changed from selected === title to just active
            style={{
                color: "white",
                backgroundColor: isLogout ? colors.pink[500] : 
                    active ? colors.green[500] : 'transparent',
            }}
            onClick={() => {
                if (onClick) {
                    onClick();
                }
                if (setSelected) {
                    setSelected(title);
                }
            }}
            icon={icon}
        >
            <Typography>{title}</Typography>
        </MenuItem>
    );

    return to ? (
        <Link to={to} style={{ textDecoration: 'none' }}>
            {menuItem}
        </Link>
    ) : menuItem;
};