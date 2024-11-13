import { Box, IconButton, useTheme } from "@mui/material";
import React, { useState, useContext, useEffect, createContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import Clock from '../../components/clock';
import AuthService from '../../services/authService';
import ApiClient from '../../services/apiClient';

// IMAGES
import LogoWhite from "../../images/logo_white.png";

// ICONS
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ColorLensIcon from '@mui/icons-material/ColorLens';

// FORMAT DATE
const formatDate = (date) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
};

// Create a context for the selected date
export const DateContext = createContext();

// CONTEXT FOR PASSING DATES
export const DateProvider = ({ children }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    
    return (
      <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
        {children}
      </DateContext.Provider>
    );
};

const Topbar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const { selectedDate, setSelectedDate } = useContext(DateContext);
    const [loading, setLoading] = useState(true);
    const [totalCovers, setTotalCovers] = useState(0);
    const userInfo = AuthService.getUserInfo();

    // For login date to stay same
    const currentDate = new Date();

    // Navigation handlers
    const nextDayNavi = () => {
        const nextDay = new Date(selectedDate);
        nextDay.setDate(selectedDate.getDate() + 1);
        setSelectedDate(nextDay);
    };

    const prevDayNavi = () => {
        const prevDay = new Date(selectedDate);
        prevDay.setDate(selectedDate.getDate() - 1);
        setSelectedDate(prevDay);
    };

    useEffect(() => {
        const fetchTotalCovers = async () => {
            try {
                setLoading(true);
                
                // Format date to match API expectations (YYYY-MM-DD)
                const formattedDate = selectedDate.toISOString().split('T')[0];
                
                // Fetch reservations for the selected date
                const reservations = await ApiClient.get(`/reservations/date/${formattedDate}`);

                console.log(reservations)
                
                // Calculate total covers by summing numberOfGuests
                const total = reservations.reduce((sum, res) => {
                    // Only count confirmed and seated reservations
                    if (res.status === 'Confirmed' || res.status === 'Seated') {
                        console.log(sum + res.numberOfGuests);
                        return sum + res.numberOfGuests;
                    }
                    return sum;
                }, 0);

                setTotalCovers(total);
            } catch (error) {
                console.error('Error fetching total covers:', error);
                setTotalCovers(0);
            } finally {
                setLoading(false);
            }
        };

        fetchTotalCovers();
    }, [selectedDate]);

    return (
        <Box 
            display="flex" 
            p={1} 
            backgroundColor={colors.pink[500]}
        >
            {/* LOGO */}
            <Box>
                <img src={LogoWhite} alt="Bean Scene Logo" height="50px" />
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
                    <span className="white-override">
                        <b>{loading ? "Loading..." : totalCovers}</b> Covers
                    </span>
                </Box>

                {/* DATE SELECTION */}
                <Box>
                    <IconButton onClick={prevDayNavi} sx={{ p: 1, color: "white" }}>
                        <ChevronLeftIcon sx={{ fontSize: "40px" }}/>
                    </IconButton>
                    <span className="white-override">{formatDate(selectedDate)}</span>
                    <IconButton onClick={nextDayNavi} sx={{ p: 1, color: "white" }}>
                        <ChevronRightIcon sx={{ fontSize: "40px" }}/>
                    </IconButton>
                </Box>

                {/* TIME AND LOGIN DISPLAY */}
                <Box display="flex">
                    <Box padding="0" mt="5px" mr="10px" textAlign="right">
                        <p className="tight white-override">
                            <Clock /> | {formatDate(currentDate)}
                        </p>
                        <p className="tight small white-override">
                            <b>Username:</b> {userInfo.username}
                        </p>
                    </Box>
                    <IconButton 
                        sx={{ p: 1, color: "white" }} 
                        onClick={colorMode.toggleColorMode}
                    >
                        <ColorLensIcon style={{ fontSize: '36px', p: '0px', m: '0px' }} />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default Topbar;