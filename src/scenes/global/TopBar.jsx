import { Box, IconButton, useTheme } from "@mui/material";
import React, { useState, useContext, useEffect, createContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import Clock from '../../components/clock';

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
    const [resCount, setResCount] = useState(false);

    //FOR LOGIN DATE TO STAY SAME - If I used the above const whenever the state was changed with the selector it would
    //update the date in the login area at the top right and this was undesirable
    const currentDate = new Date();

    //NAVIGATE TO NEXT DAY
    const nextDayNavi = () => {
        const nextDay = new Date(selectedDate)
        nextDay.setDate(selectedDate.getDate() + 1)
        setSelectedDate(nextDay)
    };
    //NAVIGATE TO PREVIOUS DAY
    const prevDayNavi = () => {
        const prevDay = new Date(selectedDate)
        prevDay.setDate(selectedDate.getDate() - 1)
        setSelectedDate(prevDay)
    };

    useEffect(() => {
        const fetchReservationCount = async () => {
            try {
                setLoading(true);

                // Format date to YYYY-MM-DD for API and adjusted for localtimezone.
                const localDate = new Date(selectedDate);
                localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
                const formattedDate = localDate.toISOString().split('T')[0];

                const response = await fetch(`http://localhost:3001/reservation/${formattedDate}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                // Map the data before counting.
                const mappedData = data.map(reservation => ({
                    id: reservation.id,
                    Start: new Date(reservation.Start),
                    name: `${reservation.name}`,
                    phone: reservation.phone,
                    Table: reservation.Table,
                    PAX: reservation.PAX,
                    Special: reservation.Special || "no"
               }));
               
               // Calculate total PAX count, not just reservations.
               let tempResCount = 0;
               mappedData.forEach(reservation => {
                tempResCount += reservation.PAX;
               });

               setResCount(tempResCount);
               
            } catch (error) {
                console.error('Error fetching reservations:', error);
                // Res count is 0 in case of a failed fetch.
                setResCount(0);
            } finally {
                setLoading(false);
            }
        };

        fetchReservationCount();
    }, [selectedDate]);

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
                    <span className="white-override"><b>{loading ? (<span>Loading...</span>
                    ) : (
                        <span>{resCount}</span>
                    )}</b> Covers</span>
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
                        <p className="tight white-override"><Clock /> | {formatDate(currentDate)}</p>
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