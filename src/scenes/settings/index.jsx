import { Box } from '@mui/material';
import Header from "../../components/header.jsx"

const Settings = () => {

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Settings" subtitle="Set some settings brah." />
            </Box>
        </Box>
    );
}

export default Settings;
