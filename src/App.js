import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes , Route, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import { DateProvider } from "./scenes/global/TopBar.jsx";

// COMPONENETS
import Topbar from './scenes/global/TopBar.jsx'
import AppSidebar from './scenes/global/AppSidebar.jsx'

// SCENES
import Dashboard from './scenes/dashboard'
import Reservations from './scenes/reservations'
import Form from './scenes/form'
import Help from './scenes/help'
import Settings from './scenes/settings'


function App() {
  const [theme, colorMode] = useMode();

  /**Create location object and then get the current location/path */
  const location = useLocation();
  const currentPath = location.pathname



  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <DateProvider>
        <CssBaseline />
        <Box className="app" sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <Topbar />
          <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <AppSidebar currentPath={currentPath}/>
            <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/reservations" element={<Reservations />} />
                <Route path="/form" element={<Form />} />
                <Route path="/help" element={<Help />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Box>
          </Box>
        </Box>
        </DateProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
