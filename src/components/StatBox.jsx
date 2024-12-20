import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import ProgressCircle from "./ProgressCircle";

const StatBox = ({ title, subtitle, icon, progress, increase }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box width="100%" m="0 30px">
            <Box display="flex" justifyContent="space-between">
                <Box>
                    {icon}
                    <Typography variant="h4" fontWeight="bold" sx={{ colors: colors.green[200] }}>
                        {title}
                    </Typography>
                </Box>
                <Box>
                    <ProgressCircle progress={progress}></ProgressCircle>
                </Box>
            </Box>
                <Box display="flex" justifyContent="space-between">
                    <Typography variant="h5" sx={{ colors: colors.sand[200] }}>
                        {subtitle}
                    </Typography>
                    <Typography variant="h5" fontWeight="italic" sx={{ colors: colors.brown[200] }}>
                        {increase}
                    </Typography>
                </Box>
        </Box>
    )
}

export default StatBox;