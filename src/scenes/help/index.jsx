import { Box, Typography } from '@mui/material';
import Header from "../../components/header.jsx";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { ExpandMoreOutlined } from '@mui/icons-material';

const Help = () => {
    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Help" subtitle="Comprehensive guide for using the Bean Scene system" />
            </Box>
            <Box>
                {/* Dashboard Overview */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                        <Typography variant="h5">
                            Dashboard Overview
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography paragraph>
                            The dashboard provides key metrics for your restaurant:
                        </Typography>
                        <Typography paragraph>
                            • Total Customers: Shows registered customer count with growth percentage
                        </Typography>
                        <Typography paragraph>
                            • Today's Orders: Current day's order count and trend
                        </Typography>
                        <Typography paragraph>
                            • Today's Reservations: Shows upcoming reservations with capacity indicators
                        </Typography>
                        <Typography>
                            • Revenue Graph: Visual representation of sales performance
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                {/* Reservation Management */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                        <Typography variant="h5">
                            Managing Reservations
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography paragraph>
                            <strong>Adding New Reservations:</strong>
                        </Typography>
                        <Typography paragraph>
                            1. Click the "Add Reservation" icon in the sidebar
                        </Typography>
                        <Typography paragraph>
                            2. Fill in required details: guest information, date, time, number of guests
                        </Typography>
                        <Typography paragraph>
                            3. Select available tables based on party size
                        </Typography>
                        <Typography paragraph>
                            <strong>Viewing & Modifying Reservations:</strong>
                        </Typography>
                        <Typography paragraph>
                            • Use the calendar at the top to navigate dates
                        </Typography>
                        <Typography paragraph>
                            • Click any reservation to view full details or make changes
                        </Typography>
                        <Typography paragraph>
                            • Update status between: Pending, Confirmed, Seated, Completed, or Cancelled
                        </Typography>
                        <Typography>
                            • Add special notes or requirements for the reservation
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                {/* Order System */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                        <Typography variant="h5">
                            Using the Order System
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography paragraph>
                            <strong>Taking Orders:</strong>
                        </Typography>
                        <Typography paragraph>
                            1. Select the table number from the dropdown
                        </Typography>
                        <Typography paragraph>
                            2. Browse menu items by category or use the search
                        </Typography>
                        <Typography paragraph>
                            3. Click items to add to order, specify quantity and any modifications
                        </Typography>
                        <Typography paragraph>
                            4. Review order in the sidebar before submitting
                        </Typography>
                        <Typography paragraph>
                            <strong>Managing Active Orders:</strong>
                        </Typography>
                        <Typography paragraph>
                            • View all orders in the Orders tab
                        </Typography>
                        <Typography paragraph>
                            • Update item status: Pending → In Progress → Ready → Served
                        </Typography>
                        <Typography>
                            • Add special instructions or dietary requirements
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                {/* Table Management */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                        <Typography variant="h5">
                            Table Management
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography paragraph>
                            Tables are organized by three areas:
                        </Typography>
                        <Typography paragraph>
                            • Main (M1-M10): Indoor dining area
                        </Typography>
                        <Typography paragraph>
                            • Outside (O1-O10): Outdoor seating
                        </Typography>
                        <Typography paragraph>
                            • Balcony (B1-B10): Upper level seating
                        </Typography>
                        <Typography>
                            Tables display capacity and current status in the reservation view
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                {/* Common Terms */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                        <Typography variant="h5">
                            Terminology Guide
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography paragraph>
                            <strong>Covers:</strong> Total number of guests currently in the restaurant
                        </Typography>
                        <Typography paragraph>
                            <strong>PAX:</strong> Number of guests in a reservation (e.g., PAX 4 = party of 4)
                        </Typography>
                        <Typography paragraph>
                            <strong>Sitting:</strong> Defined service period (Breakfast, Lunch, or Dinner)
                        </Typography>
                        <Typography>
                            <strong>Table ID:</strong> Location code (e.g., M1 = Main area table 1, O2 = Outside table 2)
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                {/* Support */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                        <Typography variant="h5">
                            Additional Support
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography paragraph>
                            For technical support or system issues, contact:
                        </Typography>
                        <Typography paragraph>
                            Email: itdude@beanscene.com
                        </Typography>
                        <Typography paragraph>
                            Emergency: ckaiser@gelos.com
                        </Typography>
                        <Typography>
                            Phone: (02) 1111 2222
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </Box>
    );
};

export default Help;