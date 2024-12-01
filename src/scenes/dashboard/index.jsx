import { Box, useTheme, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { tokens } from "../../theme";
import Header from "../../components/header.jsx"
import StatBox from "../../components/StatBox";
import { useState, useEffect } from 'react';
import ApiClient from '../../services/apiClient';
import RevenueChart from "../../components/RevChart";

// ICONS
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const Dashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [stats, setStats] = useState({
        customers: { total: 0, growth: 0 },
        reservations: { total: 0, growth: 0 }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                // Fetch guests data
                const guestsResponse = await ApiClient.get('/guests');
                const totalCustomers = guestsResponse.length;
                
                // Fetch today's reservations
                const today = new Date().toISOString().split('T')[0];
                const reservationsResponse = await ApiClient.get(`/reservations/date/${today}`);
                const totalReservations = reservationsResponse.length;
                
                // Would typically compare with previous period.
                // This is mocked for now but could be calculated from historical data
                setStats({
                    customers: {
                        total: totalCustomers,
                        growth: 14 // Mock growth rate
                    },
                    reservations: {
                        total: totalReservations,
                        growth: -12 // Mock growth rate
                    }
                });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);
    
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
                        title={loading ? "..." : stats.customers.total.toString()}
                        subtitle="Total Customers"
                        progress="0.75"
                        increase={`${stats.customers.growth}%`}
                        icon={<EmojiPeopleIcon sx={{ fontSize: "26px" }}/>}
                    />
                </Box>
                <Box gridColumn="span 4" backgroundColor={colors.brown[100]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title="125"
                        subtitle="Todays Orders"
                        progress="0.89"
                        increase="+28%"
                        icon={<RestaurantIcon sx={{ fontSize: "26px" }}/>}
                    />
                </Box>
                <Box gridColumn="span 4" backgroundColor={colors.brown[100]} display="flex" alignItems="center" justifyContent="center">
                    <Button
                        component={Link} 
                        to="/reservations"
                        sx={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 0, // Needed so that the button is blocky for the theme change (otherwise there are small corner pixels that are off colour)
                            color: 'inherit',
                            backgroundColor: colors.brown[100],
                            '&:hover': {
                                backgroundColor: colors.yellow[200], // Add a hover color for feedback
                            },
                        }}
                    >
                    <StatBox
                        title={loading ? "..." : stats.reservations.total.toString()}
                        subtitle="Todays Reservations"
                        progress="0.44"
                        increase={`${stats.reservations.growth}%`}
                        icon={<LibraryBooksIcon sx={{ fontSize: "26px" }}/>}
                    />
                    </Button>
                </Box>
                
                {/* ROW 2 */}
                <RevenueChart />

            </Box>
        </Box>
    )
}

export default Dashboard;