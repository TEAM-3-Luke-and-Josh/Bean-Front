import { useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Link } from "react-router-dom";
import { tokens } from '../../theme';

// ICONS
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AddIcon from '@mui/icons-material/Add';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

const AppSidebar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [selected,  setSelected] = useState("Dashboard");

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
                            margin: "10px 0 20px 0",
                            color: "white",
                        }}
                    >
                    {!isCollapsed && (
                        <Box
                            display="flex"
                            justifyContent="space-between"
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
                    <Box >
                        <Item 
                            title="Dashboard"
                            to="/"
                            icon={<HomeOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    </Box>
                    <Box>
                        <Item 
                            title="Reservations"
                            to="/reservations"
                            icon={<LibraryBooksIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    </Box>
                    <Box>
                        <Item 
                            title="Add Reservation"
                            to="/form"
                            icon={<AddIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    </Box>
                    <Box>
                        <Item 
                            title="Help"
                            to="/help"
                            icon={<QuestionMarkIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    </Box>
                    <Box>
                        <Item 
                            title="Settings"
                            to="/settings"
                            icon={<SettingsIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    </Box>
                </Menu>
            </Sidebar>
        </Box>
    )
}

export default AppSidebar;

// MENU ITEM FORMAT
const Item = ({ title, to, icon, selected, setSelected }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Link to={to} style={{ textDecoration: 'none' }}>
            <MenuItem 
                active={selected === title} 
                style={{
                    color: "white",
                    backgroundColor: selected === title ? colors.green[500] : 'transparent',
                }}
                onClick={() => setSelected(title)}
                icon={icon}
            >
                <Typography>{title}</Typography>
            </MenuItem>
        </Link>
    )
}