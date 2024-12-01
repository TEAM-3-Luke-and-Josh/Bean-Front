import React from 'react';
import { Box, Typography, Switch, Select, MenuItem, TextField, Accordion, Alert, AccordionSummary, AccordionDetails, Button } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import Header from "../../components/header.jsx"

const SettingsPanel = () => {
    return (
      <Box>
        <Alert 
                    severity="info"
                    sx={{
                        position: 'fixed',
                        bottom: 20,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1000,
                        boxShadow: 3
                    }}
                >
                    API endpoints for this page are currently not implemented.
        </Alert>

        <Header title="Settings" subtitle="Configure your Bean Scene experience" />
        
        <Box display="flex" flexDirection="column" gap={2}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Display Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography>Time Format</Typography>
                  <Select defaultValue="12" size="small" sx={{ width: 200 }}>
                    <MenuItem value="12">12 Hour</MenuItem>
                    <MenuItem value="24">24 Hour</MenuItem>
                  </Select>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
  
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Business Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="Default Reservation Duration (minutes)"
                  type="number"
                  defaultValue={90}
                  size="small"
                />
                <TextField
                  label="Maximum Party Size"
                  type="number"
                  defaultValue={20}
                  size="small"
                />
              </Box>
            </AccordionDetails>
          </Accordion>
  
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Notification Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography>Email Notifications</Typography>
                  <Switch defaultChecked />
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography>Kitchen Order Alerts</Typography>
                  <Switch defaultChecked />
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
  
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">User Preferences</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box display="flex" flexDirection="column" gap={2}>
                <Button variant="contained" color="primary">
                  Change Password
                </Button>
                <Button variant="contained" color="primary">
                  Update Contact Information
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    );
  };
  
  export default SettingsPanel;
