import { Box, useTheme, Modal, Typography, Button } from '@mui/material';
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


    //This will all be used in the onRowClick() in the data grid in the return block
    //SET STATE TO HANDLE MODALS - initially set to false as a modal should be closed until the state is updated
    const [openModal, setOpenModal] = useState(false);
    //STATE TO HANDLE SELECTED RESERVATION - initially set as null as no reservation is selected and state will be updated when one is selected
    const [selectedRes, setSelectedRes] = useState(null)
    /**
     * FUNCTION TO UPDATE STATES ON ROW SELECT
     * @param {*} params Data that is stored in the row
     */
    const rowClickStateUpdate = (params) => {
        setSelectedRes(params.row); //Sets the selected reservation to the clicked row's data
        setOpenModal(true); //Opens the modal
    }
    /**
     * FUNCTION TO CLOSE OUT OF MODAL AND RESET SELECTED RES DATA
     */
    const closeModal = () => {
        setSelectedRes(null); //Sets null data for selected reservation as no reservation is now seleted
        setOpenModal(false); //Closes modal by setting it to false
    }

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
                    onRowClick={rowClickStateUpdate}
                />
            </Box>
            {/*MODAL CREATION */}
            <Modal
                open={openModal}
                onClose={closeModal}
            >
                <Box>
                    {/*Only renders the content inside modal if there is a reservation selected*/}
                    {selectedRes && (
                    <Box 
                        //Placeholder styling from chatgpt just to make sure it works, REPLACE IN FINAL
                        sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)', // Center it
                        width: 400, // Customize width as needed
                        bgcolor: 'white', // White background
                        borderRadius: 2, // Rounded corners
                        boxShadow: 24, // Standard modal shadow
                        p: 4, // Padding for the inner content
                    }}>
                        <Typography variant='h2'>View Reservation:</Typography>
                        <Typography>
                            Start Time: {selectedRes.Start.toLocaleTimeString("en-AU", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true
                                        })}
                        </Typography>
                        <Typography>Name: {selectedRes.name}</Typography>
                        <Typography>Phone: {selectedRes.phone}</Typography>
                        <Typography>Table: {selectedRes.Table}</Typography>
                        <Typography>PAX: {selectedRes.PAX}</Typography>
                        <Typography>Special Requests: {selectedRes.Special}</Typography>
                        {/* Will need to update the colours and styling of the buttons*/}
                        <Button variant="contained" color="success" size="large">
                            Update Res
                        </Button>
                        <Button variant="contained" sx={{bgcolor: '#ff3d00'}} size="large">
                            Delete Res
                        </Button>
                        <Button variant="contained" onClick={closeModal} size="small">
                            Close
                        </Button>
                    </Box>
                    )}
                </Box>
            </Modal>
        </Box>

        
    )
}

export default Reservations;