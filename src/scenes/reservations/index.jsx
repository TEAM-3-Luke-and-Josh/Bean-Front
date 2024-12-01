import { Box, useTheme } from '@mui/material';
import { DataGrid } from "@mui/x-data-grid"
import Header from "../../components/header.jsx"
import { tokens } from "../../theme.js"
import { useState, useEffect, useContext, useCallback } from 'react';
import { DateContext } from '../global/TopBar.jsx';
import ApiClient from '../../services/apiClient';
import ReservationModal from '../../components/ReservationModal';

const Reservations = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { selectedDate } = useContext(DateContext);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [selectedRes, setSelectedRes] = useState(null)
    const [apiStatus, setApiStatus] = useState(null);

    const columns = [
        { 
            field: "start", 
            headerName: "Time", 
            headerAlign: "left",
            width: 100,
            cellClassName: "time-column--cell",
            renderCell: (params) => {
                if (!params?.value) return '';
                try {
                    const date = new Date(params.value);
                    return date.toLocaleTimeString('en-AU', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                    });
                } catch (error) {
                    console.error('Error formatting date:', error);
                    return '';
                }
            }
        },
        { 
            field: "name", 
            headerName: "Guest Name", 
            headerAlign: "left", 
            flex: 2,
        },
        { 
            field: "phone", 
            headerName: "Phone", 
            headerAlign: "left", 
            flex: 1,
        },
        {
            field: "tables",
            headerName: "Tables",
            headerAlign: "center",
            align: "center",
            flex: 1,
            renderCell: (params) => {
                const tables = params.value;
                if (!tables || tables.length === 0) return '—';
                return tables.join(', ');
            }
        },
        { 
            field: "numberOfGuests", 
            headerName: "PX", 
            headerAlign: "center", 
            align: "center",
            flex: 1,
        },
        { 
            field: "status", 
            headerName: "Status", 
            headerAlign: "center", 
            flex: 1,
            renderCell: (params) => {
                const status = params?.value;
                if (!status) return '';
                
                let backgroundColor;
                switch (status.toLowerCase()) {
                    case 'completed':
                        backgroundColor = colors.green[500];
                        break;
                    case 'cancelled':
                        backgroundColor = colors.pink[500];
                        break;
                    case 'seated':
                        backgroundColor = colors.yellow[500];
                        break;
                    case 'confirmed':
                        backgroundColor = colors.brown[500];
                        break;
                    case 'pending':
                    default:
                        backgroundColor = colors.sand[500];
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
            }
        }
    ];    

    const fetchReservations = useCallback(async () => {
        try {
            setLoading(true);
            const localDate = new Date(selectedDate);
            localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
            const formattedDate = localDate.toISOString().split('T')[0];
    
            const response = await ApiClient.get(`/reservations/date/${formattedDate}`);
    
            const transformedData = response.map(reservation => ({
                id: reservation.id,
                start: reservation.start,
                name: reservation.name,
                phone: reservation.phone,
                tables: reservation.tables,
                numberOfGuests: reservation.numberOfGuests,
                status: reservation.status
            }));
    
            setReservations(transformedData);
        } catch (error) {
            console.error('Error fetching reservations:', error);
            setReservations([]);
        } finally {
            setLoading(false);
        }
    }, [selectedDate]);

    useEffect(() => {
        fetchReservations();
    }, [fetchReservations]);
    /** A function that is called for the onClick of a Reservation row in the datagrid
     * takes the params of the row (the fields of the object that is being displayed) to then
     * display those in the modal it opens.
     */
    const handleRowClick = (params) => {
        setSelectedRes(params.row);
        setOpenModal(true);
    };
    /** Closes the Reservation Modal and resets the following data for the application */
    const closeModal = () => {
        setSelectedRes(null);
        setOpenModal(false);
        setApiStatus(null);
    };

    async function handleUpdateReservation(id, values) {
        try {
        // Get the original date in Sydney timezone
        const originalDate = new Date(selectedRes.start);
        const timeStr = values.start.toLowerCase();
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':');
    
        let hour24 = parseInt(hours);
        if (period === 'pm' && hour24 !== 12) {
            hour24 += 12;
        } else if (period === 'am' && hour24 === 12) {
            hour24 = 0;
        }
    
        // Create the date in Sydney timezone
        const sydneyDate = new Date(originalDate);
        sydneyDate.setHours(hour24, parseInt(minutes), 0, 0);

        // Convert to UTC for API
        const utcDate = new Date(Date.UTC(
            sydneyDate.getFullYear(),
            sydneyDate.getMonth(),
            sydneyDate.getDate(),
            hour24,
            parseInt(minutes),
            0
        ));
    
        const updatedValues = {
            startTime: utcDate.toISOString(),
            numberOfGuests: parseInt(values.numberOfGuests),
            reservationStatus: values.status,
            firstName: values.name.split(' ')[0],  // Split the full name
            lastName: values.name.split(' ').slice(1).join(' '),  // Get rest of name
            phoneNumber: values.phone,
            email: selectedRes.email || '',  // Add email from selectedRes if available
            tables: values.tables.split(',').map(t => t.trim()).filter(t => t),
            notes: values.notes || ''
        };

        await ApiClient.put(`/reservations/${id}`, updatedValues);
            
            setApiStatus('Reservation successfully updated.');
            await fetchReservations(); // Refresh the list
    
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
            await ApiClient.delete(`/reservations/${id}`);
            
            setApiStatus('Reservation successfully deleted.');
            await fetchReservations(); // Refresh the list
    
            setTimeout(() => {
                closeModal();
                setApiStatus(null);
            }, 2000);
        } catch (error) {
            console.error('Delete error:', error);
            setApiStatus(error.message || 'Error deleting reservation');
        }
    }

    return (
        <Box>
            <Header title="Reservations" subtitle="Manage your restaurant reservations" />
            
            <Box height="68vh" sx={{
                "& .MuiDataGrid-root": {
                    border: "none",
                },
                "& .MuiDataGrid-cell": {
                    borderBottom: "none"
                },
                "& .time-column--cell": {
                    color: colors.sand[700], // Yellow theme color
                    fontWeight: 700 // Bold
                },
                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: colors.sand[100],
                    borderBottom: "none"
                },
                "& .MuiDataGrid-footerContainer": {
                    borderTop: "none",
                    backgroundColor: colors.sand[100],
                }
            }}>
                <DataGrid 
                    rows={reservations}
                    columns={columns}
                    loading={loading}
                    initialState={{
                        sorting: {
                            sortModel: [{ field: 'start', sort: 'asc' }]
                        },
                        pagination: {
                            pageSize: 15,
                        },
                    }}
                    pageSizeOptions={[15, 25, 50]}
                    onRowClick={handleRowClick}
                    disableSelectionOnClick
                />
            </Box>
            
            {/*MODAL COMPONENT */}
            <ReservationModal
                open={openModal}
                onClose={closeModal}
                selectedRes={selectedRes}
                onUpdate={handleUpdateReservation}
                onDelete={deleteReservation}
                apiStatus={apiStatus}
                colors={colors}
            />
        </Box>
    )
}

export default Reservations;