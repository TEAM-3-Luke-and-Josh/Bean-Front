import { Typography, Box } from "@mui/material";

const Header = ({ title, subtitle }) => {
    // const theme = useTheme();
    // const colors = tokens(theme.palette.mode);
    return  <Box mb="30px">
                <Typography variant="h2" color="black">{title}</Typography>
                <Typography color="black">{subtitle}</Typography>
            </Box>
}

export default Header;