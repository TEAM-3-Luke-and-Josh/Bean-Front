import { Box, IconButton, useTheme } from "@mui/material";
import React, { useState } from "react";
import { tokens } from "../../theme";
import Clock from '../../components/clock';

// IMAGES
import LogoWhite from "../../images/logo_white.png";

// ICONS
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

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
                marginRight="50px"
            >

                {/* TOTAL COVERS */}
                <Box>
                    <IconButton sx={{ p: 1, color: "white" }}>
                        <TableRestaurantIcon />
                    </IconButton>
                    <span><b>27</b> Covers</span>
                </Box>

                {/* DATE SELECTION */}
                <Box>
                    <IconButton sx={{ p: 1, color: "white" }}>
                        <ChevronLeftIcon />
                    </IconButton>
                    <span>{currentDate}</span>
                    <IconButton sx={{ p: 1, color: "white" }}>
                        <ChevronRightIcon />
                    </IconButton>
                </Box>

                {/* TIME AND LOGIN DISPLAY */}
                <Box padding="0">
                    <p className="tight"><Clock /> | {currentDate}</p>
                    <p className="tight small">josh@beanscene.com.au</p>
                </Box>
            </Box>

        </Box>
    )
}

export default Topbar;