import { Box, Button, TextField, useMediaQuery, Typography, Select, MenuItem, FormControl, InputLabel, useTheme } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/header.jsx"
import { useState, useEffect } from 'react';
import ApiClient from '../../services/apiClient';
import { tokens } from "../../theme.js"

// Move sitting selection before date/time
const findSittingType = (hour) => {
    if (hour >= 7 && hour < 11) return "Breakfast";
    if (hour >= 11.5 && hour < 15.5) return "Lunch";
    if (hour >= 17 && hour < 22) return "Dinner";
    return null;
};

const defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    pax: "",
    tableId: "",
    sittingId: "",
    time: null,
    date: new Date(),
};

const userSchema = yup.object().shape({
    firstName: yup.string()
        .required("First name is required")
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name must be less than 50 characters"),
    lastName: yup.string()
        .required("Last name is required")
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name must be less than 50 characters"),
    email: yup.string()
        .required("Email is required")
        .email("Enter a valid email"),
    contact: yup.string()
        .required("Phone number is required")
        .matches(/^(\+?\d{1,3}[-.]?)?\d{10}$/, "Enter a valid phone number (e.g., 0412345678 or +61412345678)"),
    pax: yup.number()
        .required("Number of people is required")
        .min(1, "Must be at least 1 person")
        .max(20, "Maximum 20 people allowed"),
    tableId: yup.string().required("Table selection is required"),
    sittingId: yup.string().required("Sitting time is required"),
    time: yup.date().required("Time is required"),
    date: yup.date()
        .required("Date is required")
        .min(new Date(), "Date must be in the future")
});

const Form = () => {
    const theme = useTheme();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [apiStatus, setApiStatus] = useState(null);
    const [tables, setTables] = useState([]);
    const [sittings, setSittings] = useState([]);
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tableData = await ApiClient.get('/tables');
                const sortedTables = tableData.sort((a, b) => {
                    if (a.area === b.area) {
                        return a.tableID.localeCompare(b.tableID, undefined, { numeric: true });
                    }
                    return a.area.localeCompare(b.area);
                });
                setTables(sortedTables);

                const today = new Date().toISOString().split('T')[0];
                const sittingData = await ApiClient.get(`/sittings/date/${today}`);
                setSittings(sittingData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    async function handlePost(values, { resetForm }) {
        try {
            const dateTime = new Date(values.date);
            const timeValue = new Date(values.time);
            dateTime.setHours(timeValue.getHours());
            dateTime.setMinutes(timeValue.getMinutes());
    
            if (dateTime <= new Date()) {
                throw new Error('Reservation time must be in the future');
            }
    
            const mappedValues = {
                sittingId: parseInt(values.sittingId),
                startTime: dateTime.toISOString(),
                numberOfGuests: parseInt(values.pax),
                firstName: values.firstName.trim(),
                lastName: values.lastName.trim(),
                phoneNumber: values.contact.trim(),
                email: values.email.trim(),
                notes: ""
            };
    
            await ApiClient.post('/reservations', mappedValues);
            setApiStatus('Reservation saved successfully.');
            
            setTimeout(() => {
                resetForm();
                setApiStatus(null);
            }, 2000);
    
        } catch (error) {
            console.error('Reservation error:', error);
            setApiStatus(error.message || 'Error creating reservation');
        }
    }

    // Component JSX with rearranged fields and updated styles
    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Add a Reservation" subtitle="Fill in the details below to add a new reservation" />
            </Box>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Formik
                    onSubmit={handlePost}
                    initialValues={defaultValues}
                    validationSchema={userSchema}>
                        {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
                            <form onSubmit={handleSubmit}>
                                <Box 
                                    display="grid" 
                                    gap="30px" 
                                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                    sx={{
                                        "& > div" : { gridColumn: isNonMobile ? undefined : "span 4"}
                                    }}>
                                    {/* First section - Personal Details */}
                                    <TextField
                                        fullWidth
                                        variant='filled'
                                        type='text'
                                        label='First Name'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.firstName}
                                        name="firstName"
                                        error={!!touched.firstName && !!errors.firstName}
                                        helperText={touched.firstName && errors.firstName}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant='filled'
                                        type='text'
                                        label='Last Name'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.lastName}
                                        name="lastName"
                                        error={!!touched.lastName && !!errors.lastName}
                                        helperText={touched.lastName && errors.lastName}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant='filled'
                                        type='email'
                                        label='Email'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.email}
                                        name="email"
                                        placeholder="example@email.com"
                                        error={!!touched.email && !!errors.email}
                                        helperText={touched.email && errors.email}
                                        sx={{ gridColumn: "span 4" }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant='filled'
                                        type='text'
                                        label='Phone Number'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.contact}
                                        name="contact"
                                        placeholder="e.g. 0412345678"
                                        error={!!touched.contact && !!errors.contact}
                                        helperText={touched.contact && errors.contact}
                                        sx={{ gridColumn: "span 4" }}
                                    />

                                    {/* Second section - Date and Time */}
                                    <Box sx={{ gridColumn: "span 2" }}>
                                    <DatePicker
                                        label="Date"
                                        value={values.date}
                                        onChange={(newValue) => {
                                            setFieldValue('date', newValue);
                                            if (values.time) {
                                                const timeValue = new Date(values.time);
                                                const sittingType = findSittingType(timeValue.getHours());
                                                const sitting = sittings.find(s => s.sittingType === sittingType);
                                                if (sitting) {
                                                    setFieldValue('sittingId', sitting.sittingID);
                                                }
                                            }
                                        }}
                                        slotProps={{
                                            textField: {
                                                variant: 'filled',
                                                fullWidth: true,
                                                error: !!touched.time && !!errors.time,
                                                helperText: touched.time && errors.time,
                                            },
                                            popper: {
                                                sx: {
                                                    "& .MuiPaper-root": {
                                                        backgroundColor: colors.brown[100],
                                                    },
                                                    "& .MuiClock-pin": {
                                                        backgroundColor: `${colors.green[500]} !important`,
                                                    },
                                                    "& .MuiClockPointer-root": {
                                                        backgroundColor: `${colors.green[500]} !important`,
                                                    },
                                                    "& .MuiClockPointer-thumb": {
                                                        border: `16px solid ${colors.green[500]} !important`,
                                                    },
                                                    "& .MuiIconButton-root": {
                                                        color: `${colors.green[500]} !important`,
                                                        backgroundColor: `${colors.brown[200]} !important`,
                                                        visibility: "visible",
                                                        "&:hover": {
                                                            backgroundColor: `${colors.green[200]} !important`,
                                                        }
                                                    },
                                                    "& .MuiPickersYear-yearButton.Mui-selected": {
                                                        backgroundColor: `${colors.green[500]} !important`,
                                                    },
                                                    "& .MuiPickersDay-root.Mui-selected": {
                                                        backgroundColor: `${colors.green[500]} !important`,
                                                    },
                                                    "& .MuiButton-text": {
                                                        color: `${colors.green[500]} !important`,
                                                        backgroundColor: `${colors.brown[200]} !important`,
                                                        padding: "8px 16px",
                                                        visibility: "visible",
                                                        "&:hover": {
                                                            backgroundColor: `${colors.green[200]} !important`,
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                        minDate={new Date()}
                                    />
                                    </Box>
                                    <Box sx={{ gridColumn: "span 2" }}>
                                    <TimePicker
                                        label="Arrival Time"
                                        value={values.time}
                                        onChange={(newValue) => {
                                            setFieldValue('time', newValue);
                                            if (newValue) {
                                                const sittingType = findSittingType(newValue.getHours());
                                                const sitting = sittings.find(s => s.sittingType === sittingType);
                                                if (sitting) {
                                                    setFieldValue('sittingId', sitting.sittingID);
                                                }
                                            }
                                        }}
                                        slotProps={{
                                            textField: {
                                                variant: 'filled',
                                                fullWidth: true,
                                                error: !!touched.time && !!errors.time,
                                                helperText: touched.time && errors.time,
                                            },
                                            popper: {
                                                sx: {
                                                    "& .MuiPaper-root": {
                                                        backgroundColor: colors.brown[100],
                                                    },
                                                    "& .MuiClock-pin": {
                                                        backgroundColor: `${colors.green[500]} !important`,
                                                    },
                                                    "& .MuiClockPointer-root": {
                                                        backgroundColor: `${colors.green[500]} !important`,
                                                    },
                                                    "& .MuiClockPointer-thumb": {
                                                        border: `16px solid ${colors.green[500]} !important`,
                                                    },
                                                    "& .MuiButton-sizeMedium": {
                                                        color: `${colors.green[500]} !important`,
                                                        backgroundColor: `${colors.brown[200]} !important`,
                                                        visibility: "visible",
                                                        "&:hover": {
                                                            backgroundColor: `${colors.green[200]} !important`,
                                                        }
                                                    },
                                                    "& .MuiPickersYear-yearButton.Mui-selected": {
                                                        backgroundColor: `${colors.green[500]} !important`,
                                                    },
                                                    "& .MuiPickersDay-root.Mui-selected": {
                                                        backgroundColor: `${colors.green[500]} !important`,
                                                    },
                                                    "& .MuiButton-text": {
                                                        color: `${colors.green[500]} !important`,
                                                        backgroundColor: `${colors.brown[200]} !important`,
                                                        padding: "8px 16px",
                                                        visibility: "visible",
                                                        "&:hover": {
                                                            backgroundColor: `${colors.green[200]} !important`,
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                    </Box>

                                    {/* Third section - Reservation Details */}
                                    <TextField
                                        fullWidth
                                        variant='filled'
                                        type='number'
                                        label='Number of People'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.pax}
                                        name="pax"
                                        error={!!touched.pax && !!errors.pax}
                                        helperText={touched.pax && errors.pax}
                                        sx={{ gridColumn: "span 1" }}
                                    />
                                    <FormControl 
                                        variant="filled" 
                                        sx={{ gridColumn: "span 1" }}
                                        error={!!touched.tableId && !!errors.tableId}
                                    >
                                        <InputLabel>Select Table</InputLabel>
                                        <Select
                                            value={values.tableId}
                                            name="tableId"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        >
                                            {tables.map((table) => (
                                                <MenuItem key={table.tableID} value={table.tableID}>
                                                    Table {table.tableID} ({table.area}) - {table.capacity} seats
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {touched.tableId && errors.tableId && (
                                            <Typography variant="caption" color="error">
                                                {errors.tableId}
                                            </Typography>
                                        )}
                                    </FormControl>
                                    <FormControl 
                                        variant="filled" 
                                        sx={{ gridColumn: "span 2" }}
                                        error={!!touched.sittingId && !!errors.sittingId}
                                    >
                                        <InputLabel>Sitting</InputLabel>
                                        <Select
                                            value={values.sittingId}
                                            name="sittingId"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            disabled
                                        >
                                            {sittings.map((sitting) => (
                                                <MenuItem key={sitting.sittingID} value={sitting.sittingID}>
                                                    {sitting.sittingType}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {touched.sittingId && errors.sittingId && (
                                            <Typography variant="caption" color="error">
                                                {errors.sittingId}
                                            </Typography>
                                        )}
                                    </FormControl>
                                </Box>
                                <Box display="flex" justifyContent="start" mt="40px">
                                    <Button type="submit" color="secondary" variant="contained">
                                        Add Reservation
                                    </Button>
                                </Box>
                            </form>
                        )}
                </Formik>
            </LocalizationProvider>
            {apiStatus && (
                <Typography 
                    mt={2} 
                    color={apiStatus.includes('Error') ? 'error' : 'success.main'}
                >
                    {apiStatus}
                </Typography>
            )}
        </Box>
    );
};

export default Form;