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
                            An Important Question!
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel commodi voluptas error quos molestiae tempora, veritatis ipsum quod a, laborum ut eos at nihil magni omnis quidem deserunt. Deleniti, iste!
                        </Typography>
                    </AccordionDetails>
                </Accordian>

                {/* Question 2 */}
                <Accordian>
                    <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                        <Typography variant="h5">
                            An even MORE important question.
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel commodi voluptas error quos molestiae tempora, veritatis ipsum quod a, laborum ut eos at nihil magni omnis quidem deserunt. Deleniti, iste!
                        </Typography>
                    </AccordionDetails>
                </Accordian>

                {/* Question 3 */}
                <Accordian>
                    <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                        <Typography variant="h5">
                            Something less important.
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel commodi voluptas error quos molestiae tempora, veritatis ipsum quod a, laborum ut eos at nihil magni omnis quidem deserunt. Deleniti, iste!
                        </Typography>
                    </AccordionDetails>
                </Accordian>

                {/* Question 4 */}
                <Accordian>
                    <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                        <Typography variant="h5">
                            Something dumb we don't want you to do.
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel commodi voluptas error quos molestiae tempora, veritatis ipsum quod a, laborum ut eos at nihil magni omnis quidem deserunt. Deleniti, iste!
                        </Typography>
                    </AccordionDetails>
                </Accordian>

                {/* Question 5 */}
                <Accordian>
                    <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                        <Typography variant="h5">
                            The last question.
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel commodi voluptas error quos molestiae tempora, veritatis ipsum quod a, laborum ut eos at nihil magni omnis quidem deserunt. Deleniti, iste!
                        </Typography>
                    </AccordionDetails>
                </Accordian>
            
            </Box>
        </Box>
    )
}

export default Help;