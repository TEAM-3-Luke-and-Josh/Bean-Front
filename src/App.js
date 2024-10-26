import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes , Route } from "react-router-dom";
import { Box } from "@mui/material";

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

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box className="app" sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <Topbar />
          <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <AppSidebar />
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
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
