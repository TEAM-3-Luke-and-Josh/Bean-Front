import { Box, Typography, useTheme } from '@mui/material';
import { tokens } from "../../theme";
import Header from "../../components/header.jsx"
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";

// ICONS
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const Dashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="DASHBOARD" subtitle="Welcome to your Dashboard" />
            </Box>

            {/* GRID FOR LAYOUT */}
            <Box 
                display="grid" 
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="120px"
                gap="20px">

                {/* ROW 1 */}
                <Box gridColumn="span 4" backgroundColor={colors.brown[100]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title="85"
                        subtitle="Customers"
                        progress="0.75"
                        increase="+14%"
                        icon={<EmojiPeopleIcon sx={{ fontSize: "26px" }}/>}
                        >

                    </StatBox>
                </Box>
                <Box gridColumn="span 4" backgroundColor={colors.brown[100]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title="125"
                        subtitle="Orders"
                        progress="0.89"
                        increase="+28%"
                        icon={<RestaurantIcon sx={{ fontSize: "26px" }}/>}
                        >

                    </StatBox>
                </Box>
                <Box gridColumn="span 4" backgroundColor={colors.brown[100]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title="12"
                        subtitle="Reservations"
                        progress="0.44"
                        increase="-12%"
                        icon={<LibraryBooksIcon sx={{ fontSize: "26px" }}/>}
                        >

                    </StatBox>
                </Box>
                
                {/* ROW 2 */}
                <Box
                    gridColumn="span 8"
                    gridRow="span 2"
                    backgroundColor={colors.brown[100]}
                >
                    <Box
                        mt="25px"
                        p="0 30px"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Box>
                            <Typography variant="h5" fontWeight="600">
                                Revenue Generated
                            </Typography>
                            <Typography variant="h3" fontWeight="500">
                                $59,342.00
                            </Typography>
                        </Box>

                        <Box>
                            <BarChart></BarChart>
                        </Box>
                    </Box>
                </Box>

            </Box>
        </Box>
    )
}

export default Dashboard;