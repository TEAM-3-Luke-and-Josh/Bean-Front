import { Box, Typography } from '@mui/material';
import Header from "../../components/header.jsx";
import React, { useEffect, useState } from 'react';

const Settings = () => {
    const [backendData, setBackendData] = useState({ users: [] }); // Change to an object

    useEffect(() => {
        fetch("/api")
            .then(response => response.json())
            .then(data => {
                setBackendData(data);
            })
            .catch(error => console.error("Error fetching data:", error)); // Add error handling
    }, []);

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Settings" subtitle="Welcome to your Settings" />
            </Box>
            <Typography>
                {backendData.users.length === 0 ? ( // Check for empty array
                    <p>Loading...</p>
                ) : (
                    backendData.users.map((user, i) => (
                        <p key={i}>{user}</p>
                    ))
                )}
            </Typography>
        </Box>
    );
}

export default Settings;
