import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import { DateProvider } from "./scenes/global/TopBar.jsx";
import { SidebarProvider } from './scenes/contexts/SidebarContext';
import { useState, useEffect } from 'react';
import AuthService from './services/authService';

// COMPONENTS
import Topbar from './scenes/global/TopBar.jsx'
import AppSidebar from './scenes/global/AppSidebar.jsx'

// SCENES
import Dashboard from './scenes/dashboard'
import Reservations from './scenes/reservations'
import Form from './scenes/form'
import Help from './scenes/help'
import Settings from './scenes/settings'
import Login from './scenes/login'
import OrderSystem from './scenes/ordering';
import Orders from './scenes/orders';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  
  if (!isAuthenticated) {
      return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  const [theme, colorMode] = useMode();
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());

  useEffect(() => {
      // Check authentication status on mount and token changes
      const checkAuth = () => {
          setIsAuthenticated(AuthService.isAuthenticated());
      };

      window.addEventListener('storage', checkAuth);
      return () => window.removeEventListener('storage', checkAuth);
  }, []);

  /**Create location object and then get the current location/path */
  const location = useLocation();
  const currentPath = location.pathname



  return (
      <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
              <DateProvider>
                  <CssBaseline />
                  {isAuthenticated ? (
                      <Box className="app" sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                          <Topbar />
                          <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                              <AppSidebar currentPath={currentPath} />
                              <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
                                  <Routes>
                                      <Route path="/" element={
                                          <ProtectedRoute>
                                              <Dashboard />
                                          </ProtectedRoute>
                                      } />
                                      <Route path="/reservations" element={
                                          <ProtectedRoute>
                                              <Reservations />
                                          </ProtectedRoute>
                                      } />
                                      <Route path="/form" element={
                                          <ProtectedRoute>
                                              <Form />
                                          </ProtectedRoute>
                                      } />
                                      <Route path="/help" element={
                                          <ProtectedRoute>
                                              <Help />
                                          </ProtectedRoute>
                                      } />
                                      <Route path="/settings" element={
                                          <ProtectedRoute>
                                              <Settings />
                                          </ProtectedRoute>
                                      } />
                                  </Routes>
                              </Box>
                          </Box>
                      </Box>
                  ) : (
                      <Routes>
                          <Route path="/login" element={<Login />} />
                          <Route path="*" element={<Navigate to="/login" />} />
                      </Routes>
                  )}
                <SidebarProvider>
                    <CssBaseline />
                    {isAuthenticated ? (
                        <Box className="app" sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                            <Topbar />
                            <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                                <AppSidebar />
                                <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
                                    <Routes>
                                        <Route path="/" element={
                                            <ProtectedRoute>
                                                <Dashboard />
                                            </ProtectedRoute>
                                            } />
                                            <Route path="/reservations" element={
                                                <ProtectedRoute>
                                                    <Reservations />
                                                </ProtectedRoute>
                                            } />
                                            <Route path="/ordering" element={
                                                <ProtectedRoute>
                                                    <OrderSystem />
                                                </ProtectedRoute>
                                            } />
                                            <Route path="/orders" element={
                                                <ProtectedRoute>
                                                    <Orders />
                                                </ProtectedRoute>
                                            } />                                            
                                            <Route path="/form" element={
                                                <ProtectedRoute>
                                                    <Form />
                                                </ProtectedRoute>
                                            } />
                                            <Route path="/help" element={
                                                <ProtectedRoute>
                                                    <Help />
                                                </ProtectedRoute>
                                            } />
                                            <Route path="/settings" element={
                                                <ProtectedRoute>
                                                    <Settings />
                                                </ProtectedRoute>
                                            } />
                                    </Routes>
                                </Box>
                            </Box>
                        </Box>
                    ) : (
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="*" element={<Navigate to="/login" />} />
                        </Routes>
                    )}
                </SidebarProvider>
              </DateProvider>
          </ThemeProvider>
      </ColorModeContext.Provider>
  );
}

export default App;