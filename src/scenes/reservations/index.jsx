import { Box, useTheme } from '@mui/material';
import { DataGrid } from "@mui/x-data-grid"
import Header from "../../components/header.jsx"
import { tokens } from "../../theme.js"
import { useState, useEffect, createContext, useContext } from 'react';
import { DateContext } from '../global/TopBar.jsx';

// ICONS
import Person4Icon from '@mui/icons-material/Person4';
import CakeIcon from '@mui/icons-material/Cake';

const Reservations = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { selectedDate } = useContext(DateContext);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                setLoading(true);
                // Format date to YYYY-MM-DD for API and adjusted for localtimezone.
                const localDate = new Date(selectedDate);
                localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
                const formattedDate = localDate.toISOString().split('T')[0];

                const response = await fetch(`http://localhost:3001/reservation/${formattedDate}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                // Transform the data to match DataGrid requirements
                const transformedData = data.map(reservation => ({
                     id: reservation.id,
                     Start: new Date(reservation.Start),
                     name: `${reservation.name}`,
                     phone: reservation.phone,
                     Table: reservation.Table,
                     PAX: reservation.PAX,
                     Special: reservation.Special || "no"
                }));
                
                console.log(response);
                setReservations(transformedData);
            } catch (error) {
                console.error('Error fetching reservations:', error);
                // Handle the error appropriately
                setReservations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [selectedDate]); 

    const columns = [
        { field: "Start", headerName: "Arrival", headerAlign: "left", cellClassName: "time-column--cell", renderCell: (params) => {
                const date = new Date(params.value);
                return date.toLocaleTimeString('en-AU', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                });
            }},
        { field: "name", headerName: "Name", headerAlign: "left", flex: 2},
        { field: "phone", headerName: "Phone Number", headerAlign: "left", flex: 2},
        { field: "Table", headerName: "T#", headerAlign: "center", type: "number", align: "center", flex: 1},
        { field: "PAX", headerName: "PX", headerAlign: "center", type: "number", align: "center", flex: 1},
        { field: "Special", headerName: "VIP", headerAlign: "center", flex: 1, renderCell: ({ row: { Special } }) => {
            return (<Box
                width="60%"
                m="0 auto"
                p="5px"
                display="flex"
                justifyContent="center"
                marginTop="10px"
                backgroundColor={
                    (Special === "yes" || Special === "birthday")
                    ? colors.sand[700]
                    : undefined
                }
                borderRadius="4px">
                {Special === "yes" && <Person4Icon sx={{ color: "white" }}/>}
                {Special === "birthday" && <CakeIcon sx={{ color: "white" }}/>}
            </Box>
            );
        }}
    ]

    return (
        <Box>
            <Header title="Reservations" subtitle="View upcoming reservations" />
            <Box height="66vh" sx={{
                "& .MuiDataGrid-root": {
                    border: "none",
                },
                "& .MuiDataGrid-cell": {
                    borderBottom: "none"
                },
                "& .time-column--cell": {
                    color: colors.sand[700],
                    fontWeight: 700
                },
                "& .MuiDataGrid-columnHeaders": {
                    borderBottom: "none"
                },
                "& .MuiDataGrid-footerContainer": {
                    borderTop: "none",
                }
            }}>
                <DataGrid 
                    rows={reservations}
                    columns={columns}
                    loading={loading}
                    initialState={{
                        sorting: {
                            sortModel: [{ field: 'Start', sort: 'asc' }]
                        }
                    }}
                />
            </Box>
        </Box>
    )
}

export default Reservations;