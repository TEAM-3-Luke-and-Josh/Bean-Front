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

// FORMAT DATE
const formatDate = (date) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
};

const Topbar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    //FOR DATE SELECTOR
    const [date, setDate] = useState(new Date());
    //FOR LOGIN DATE TO STAY SAME - If I used the above const whenever the state was changed with the selector it would
    //update the date in the login area at the top right and this was undesirable
    const currentDate = new Date();

    //NAVIGATE TO NEXT DAY
    const nextDayNavi = () => {
        const nextDay = new Date(date)
        nextDay.setDate(date.getDate() + 1) //MOVE FORWARD ONE DAY
        setDate(nextDay)
    };
    //NAVIGATE TO PREVIOUS DAY
    const prevDayNavi = () => {
        const prevDay = new Date(date)
        prevDay.setDate(date.getDate() - 1) //MOVE FORWARD ONE DAY
        setDate(prevDay)
    };
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
                    <IconButton onClick={prevDayNavi} sx={{ p: 1, color: "white" }}>
                        <ChevronLeftIcon />
                    </IconButton>
                    <span>{formatDate(date)}</span>
                    <IconButton onClick={nextDayNavi} sx={{ p: 1, color: "white" }}>
                        <ChevronRightIcon />
                    </IconButton>
                </Box>

                {/* TIME AND LOGIN DISPLAY */}
                <Box padding="0">
                    <p className="tight"><Clock /> | {formatDate(currentDate)}</p>
                    <p className="tight small">josh@beanscene.com.au</p>
                </Box>
            </Box>

        </Box>
    )
}

export default Topbar;