import { Box, Typography } from '@mui/material';
import Header from "../../components/header.jsx";
import Accordian from "@mui/material/Accordion";
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { ExpandMoreOutlined } from '@mui/icons-material';

const Help = () => {
    
    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Help" subtitle="Get help using the Bean Scene App" />
            </Box>
            <Box>

                {/* Question 1 */}
                <Accordian>
                    <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                        <Typography variant="h5">
                            Navigating the application
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            When trying to Navigate the application, it is best to tap the burger menu icon to display the name of each page next to their icons.
                        </Typography>
                    </AccordionDetails>
                </Accordian>

                {/* Question 2 */}
                <Accordian>
                    <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                        <Typography variant="h5">
                            How do I save a Reservation?
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Navigate to the Add a Reservation page (the plus on the navbar), input the necessary fields and then click/tap on the ADD RESERVATION button.
                        </Typography>
                    </AccordionDetails>
                </Accordian>

                {/* Question 3 */}
                <Accordian>
                    <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                        <Typography variant="h5">
                            Viewing Reservations
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            If you would like to view more details of each Reservation, tap/click on the Reservation in the table and a popup should appear with the necessary information.
                        </Typography>
                    </AccordionDetails>
                </Accordian>

                {/* Question 4 */}
                <Accordian>
                    <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                        <Typography variant="h5">
                            Terminology
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            If any of the terminology on this application is confusing this will serve to de-jargon it:  
                        </Typography>
                        <Typography>
                            Covers = Number of Customers currently in the building.
                        </Typography>
                        <Typography>
                            PAX = Number of Customers per Reservation (A PAX of 12 means that there are 12 people for that Reservation).
                        </Typography>
                        <Typography>
                            T# = Table number, the table that the Reservation will be sat at.
                        </Typography>
                    </AccordionDetails>
                </Accordian>

                {/* Question 5 */}
                <Accordian>
                    <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                        <Typography variant="h5">
                            Need further help?
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Contact the support team for this application at: gelossupport@gelosmail.com
                        </Typography>
                    </AccordionDetails>
                </Accordian>
            
            </Box>
        </Box>
    )
}

export default Help;