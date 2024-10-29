import { Box, IconButton, useTheme } from "@mui/material";
import React, { useState, useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import Clock from '../../components/clock';

// IMAGES
import LogoWhite from "../../images/logo_white.png";

// ICONS
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ColorLensIcon from '@mui/icons-material/ColorLens';

// GET CURRENT DATE FOR DISPLAY
function getDate() {
    const today = new Date();
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit' };
    const formattedDate = today.toLocaleDateString('en-US', options);
    return formattedDate;
}

const Topbar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const [currentDate] = useState(getDate());

    return (
        <Box 
        display="flex" 
        p={1} 
        backgroundColor={colors.pink[500]}
        >
            {/* LOGO */}
            <Box>
                <img src={LogoWhite} alt="Bean Scene Logo" height="50px"></img>
            </Box>

            {/* RIGHT ELEMENTS */}
            <Box 
                display="flex" 
                width="100%" 
                justifyContent="space-between" 
                alignItems="center"
                marginLeft="50px"
            >

                {/* TOTAL COVERS */}
                <Box>
                    <IconButton sx={{ p: 1, color: "white" }}>
                        <TableRestaurantIcon />
                    </IconButton>
                    <span className="white-override"><b>27</b> Covers</span>
                </Box>

                {/* DATE SELECTION */}
                <Box>
                    <IconButton sx={{ p: 1, color: "white" }}>
                        <ChevronLeftIcon />
                    </IconButton>
                    <span className="white-override">{currentDate}</span>
                    <IconButton sx={{ p: 1, color: "white" }}>
                        <ChevronRightIcon />
                    </IconButton>
                </Box>

                {/* TIME AND LOGIN DISPLAY */}
                <Box display="flex">
                    <Box padding="0" mt="5px" mr="10px" textAlign="right">
                        <p className="tight white-override"><Clock /> | {currentDate}</p>
                        <p className="tight small white-override">josh@beanscene.com.au</p>
                    </Box>
                    <IconButton sx={{ p: 1, color: "white" }} onClick={colorMode.toggleColorMode}>
                        <ColorLensIcon style={{ fontSize: '36px', p: '0px', m: '0px' }} />
                    </IconButton>
                </Box>
            </Box>

        </Box>
    )
}

export default Topbar;