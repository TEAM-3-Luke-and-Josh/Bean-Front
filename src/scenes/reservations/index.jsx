import { Box, useTheme, Modal, Typography, Button, Stack, TextField} from '@mui/material';
import { DataGrid } from "@mui/x-data-grid"
import Header from "../../components/header.jsx"
import { tokens } from "../../theme.js"
import { useState, useEffect, useContext } from 'react';
import { DateContext } from '../global/TopBar.jsx';
import { Formik, Form } from 'formik'

const Reservations = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { selectedDate } = useContext(DateContext);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openModal, setOpenModal] = useState(false);
    const [selectedRes, setSelectedRes] = useState(null)
    const [apiStatus, setApiStatus] = useState(null);

    const rowClickStateUpdate = (params) => {
        setSelectedRes(params.row); 
        setOpenModal(true);
    }

    const closeModal = () => {
        setSelectedRes(null);
        setOpenModal(false);
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
                
                // Map the data to match DataGrid requirements
                const mappedData = data.map(reservation => ({
                     id: reservation.id,
                     Start: new Date(reservation.Start),
                     name: `${reservation.name}`,
                     phone: reservation.phone,
                     Table: reservation.Table,
                     PAX: reservation.PAX,
                     ResStatus: reservation.status
                }));
                
                setReservations(mappedData);
            } catch (error) {
                console.error('Error fetching reservations:', error);
                // Map empty reservations in case of failed fetch.
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
        { field: "ResStatus", headerName: "Status", headerAlign: "center", flex: 1, renderCell: (params) => {
                const status = params.value;
        
                let backgroundColor;
                switch (status) {
                    case 'Completed':
                        backgroundColor = `${colors.green[500]}`;
                        break;
                    case 'Canceled':
                        backgroundColor = `${colors.pink[500]}`;
                        break;
                    case 'Pending':
                        backgroundColor = `#333`;
                        break;
                    default:
                        backgroundColor = 'transparent';
                        break;
                }
        
                return (
                    <Box style={{ 
                        backgroundColor, 
                        color: 'white',
                        margin: '15px 5px 5px 5px',
                        textAlign: 'center',
                        borderRadius: '10px',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {status}
                    </Box>
                );
            },
        }
    ]        

    async function handleUpdateReservation(id, values) {
        try {
            // Convert time string back to full datetime
            const selectedDateTime = new Date(selectedDate); // From context
            const timeStr = values.Start.toLowerCase();
            const [time, period] = timeStr.split(' ');
            const [hours, minutes] = time.split(':');
            
            const hour = parseInt(hours);
            const minute = parseInt(minutes);
            
            // Convert to 24 hour format
            let hour24 = hour;
            if (period === 'pm' && hour !== 12) {
                hour24 = hour + 12;
            } else if (period === 'am' && hour === 12) {
                hour24 = 0;
            }
            
            selectedDateTime.setHours(hour24, minute);
    
            const updatedValues = {
                resDate: selectedDateTime.toISOString(),
                numPeople: parseInt(values.PAX),
                firstName: values.name.split(' ')[0],
                lastName: values.name.split(' ').slice(1).join(' '),
                phoneNum: values.phone,
                table: values.Table,
                resStatus: 'Pending'
            };
    
            console.log('Sending update:', updatedValues);
    
            const response = await fetch(`http://localhost:3001/reservation/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedValues)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update reservation');
            }
    
            setApiStatus('Reservation successfully updated.');
            
            // Update reservations list
            const localDate = new Date(selectedDate);
            localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
            const formattedDate = localDate.toISOString().split('T')[0];
    
            const updatedResponse = await fetch(`http://localhost:3001/reservation/${formattedDate}`);
            const updatedData = await updatedResponse.json();
            const mappedData = updatedData.map(reservation => ({
                id: reservation.id,
                Start: new Date(reservation.Start),
                name: `${reservation.name}`,
                phone: reservation.phone,
                Table: reservation.Table,
                PAX: reservation.PAX
            }));
            setReservations(mappedData);
    
            setTimeout(() => {
                closeModal();
                setApiStatus(null);
            }, 2000);
    
        } catch (error) {
            console.error('Update error:', error);
            setApiStatus(error.message || 'Error updating reservation');
        }
    }

    async function deleteReservation(id) {
        try {
            const response = await fetch(`http://localhost:3001/reservation/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.ok) {
                setApiStatus('Reservation successfully deleted.');
                
                // Update reservations list immediately after deletion
                const localDate = new Date(selectedDate);
                localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
                const formattedDate = localDate.toISOString().split('T')[0];
    
                const updatedResponse = await fetch(`http://localhost:3001/reservation/${formattedDate}`);
                const updatedData = await updatedResponse.json();
                const mappedData = updatedData.map(reservation => ({
                    id: reservation.id,
                    Start: new Date(reservation.Start),
                    name: `${reservation.name}`,
                    phone: reservation.phone,
                    Table: reservation.Table,
                    PAX: reservation.PAX,
                    Special: reservation.Special || "no"
                }));
                setReservations(mappedData);
    
                setTimeout(() => {
                    closeModal(); 
                    setApiStatus(null);
                }, 2000);
            } else {
                setApiStatus('Failed to delete reservation.');
            }
        } catch (error) {
            setApiStatus('Error deleting reservation.');
        }
    }

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
            <Modal open={openModal} onClose={closeModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        borderRadius: 3,
                        boxShadow: 24,
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    {selectedRes && (
                        <>
                            <Typography variant='h5' fontWeight="bold">
                                Edit Reservation
                            </Typography>

                            <Formik
                                initialValues={{
                                    Start: selectedRes.Start.toLocaleTimeString('en-AU', {
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: true,
                                    }),
                                    name: selectedRes.name || '',
                                    phone: selectedRes.phone || '',
                                    Table: selectedRes.Table || '',
                                    PAX: selectedRes.PAX || '',
                                    Special: selectedRes.Special || '',
                                }}
                                onSubmit={(values) => {
                                    // Submit the updated values
                                    handleUpdateReservation(selectedRes.id, values);
                                }}
                            >
                                {({ values, handleChange }) => (
                                    <Form>
                                        <Stack spacing={2}>
                                            <TextField
                                                label="Start Time"
                                                name="Start"
                                                value={values.Start}
                                                onChange={handleChange}
                                                fullWidth
                                            />
                                            <TextField
                                                label="Name"
                                                name="name"
                                                value={values.name}
                                                onChange={handleChange}
                                                fullWidth
                                            />
                                            <TextField
                                                label="Phone"
                                                name="phone"
                                                value={values.phone}
                                                onChange={handleChange}
                                                fullWidth
                                            />
                                            <TextField
                                                label="Table"
                                                name="Table"
                                                value={values.Table}
                                                onChange={handleChange}
                                                fullWidth
                                            />
                                            <TextField
                                                label="PAX"
                                                name="PAX"
                                                type="number"
                                                value={values.PAX}
                                                onChange={handleChange}
                                                fullWidth
                                            />
                                            <TextField
                                                label="Special Requests"
                                                name="Special"
                                                value={values.Special}
                                                onChange={handleChange}
                                                fullWidth
                                            />

                                            {/* Display API feedback */}
                                            {apiStatus && (
                                                <Typography>{apiStatus}</Typography>
                                            )}

                                            <Stack direction="row" spacing={2} justifyContent="space-between" mt={3}>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    sx={{ bgcolor: `${colors.green[500]}`, color: '#FFF' }}
                                                    size="large"
                                                >
                                                    Save
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    onClick={() => deleteReservation(selectedRes.id)}
                                                    sx={{ bgcolor: `${colors.pink[500]}`, color: '#FFF' }}
                                                    size="large"
                                                >
                                                    Delete
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    sx={{ bgcolor: `${colors.swap[100]}`, color: `${colors.swap[200]}` }}
                                                    onClick={closeModal}
                                                    size="medium"
                                                >
                                                    Close
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    </Form>
                                )}
                            </Formik>
                        </>
                    )}
                </Box>
            </Modal>
        </Box>
    )
}

export default Reservations;