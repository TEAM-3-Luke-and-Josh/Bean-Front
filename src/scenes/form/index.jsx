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
    time: null,
    date: new Date(),

const userSchema = yup.object().shape({
    firstName: yup.string().required("First name is required").min(2).max(50),
    lastName: yup.string().required("Last name is required").min(2).max(50),
    email: yup.string().required("Email is required").email("Enter a valid email"),
    contact: yup.string().required("Phone number is required")
        .matches(/^(\+?\d{1,3}[-.]?)?\d{10}$/, "Enter a valid phone number"),
    pax: yup.number().required("Number of people is required").min(1).max(20),
    tableId: yup.string().required("Table selection is required"),
    time: yup.date().required("Time is required")
        .test("valid-sitting", "Time must be within valid sitting hours", (value) => {
            if (!value) return false;
            const hours = value.getHours();
            return (hours >= 7 && hours < 11) || (hours >= 11.5 && hours < 15.5) || (hours >= 17 && hours < 22);
        }),
    date: yup.date().required("Date is required").min(new Date(), "Date must be in the future")
});

const Form = () => {
    const theme = useTheme();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [apiStatus, setApiStatus] = useState(null);
    const [tables, setTables] = useState([]);
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const tableData = await ApiClient.get('/tables');
                setTables(tableData.sort((a, b) => {
                    if (a.area === b.area) return a.tableID.localeCompare(b.tableID, undefined, { numeric: true });
                    return a.area.localeCompare(b.area);
                }));
            } catch (error) {
                console.error('Error fetching tables:', error);
            }
        };
        fetchTables();
    }, []);

    async function handlePost(values, { resetForm }) {
        // Combine date and time
        const dateTime = new Date(values.date);
        const timeValue = new Date(values.time);
        dateTime.setHours(timeValue.getHours());
        dateTime.setMinutes(timeValue.getMinutes());

        const mappedValues = {
            //No sitting ID as that will be handled on the backend.
            sittingID: 851,
            startTime: dateTime.toISOString(),
            numberOfGuests: parseInt(values.pax),
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: values.phoneNum,
            email: values.email,
            notes: values.notes || '',
            tableID: values.tableId
        };

        console.log('Posting new reservation:', mappedValues);
        try {
            const dateTime = new Date(values.date);
            const timeValue = new Date(values.time);
            dateTime.setHours(timeValue.getHours());
            dateTime.setMinutes(timeValue.getMinutes());

            const formattedDate = dateTime.toISOString().split('T')[0];
            const sittingData = await ApiClient.get(`/sittings/date/${formattedDate}`);
            
            const sittingType = findSittingType(timeValue.getHours());
            const sitting = sittingData.find(s => s.sittingType === sittingType);
            
            if (!sitting) throw new Error('No valid sitting found for selected time');

            const mappedValues = {
                sittingId: sitting.sittingID,
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
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 4"}
                                }}>
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    label="First Name"
                                    name="firstName"
                                    value={values.firstName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={!!touched.firstName && !!errors.firstName}
                                    helperText={touched.firstName && errors.firstName}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    label="Last Name"
                                    name="lastName"
                                    value={values.lastName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={!!touched.lastName && !!errors.lastName}
                                    helperText={touched.lastName && errors.lastName}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="email"
                                    label="Email"
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={!!touched.email && !!errors.email}
                                    helperText={touched.email && errors.email}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    label="Phone Number"
                                    name="contact"
                                    value={values.contact}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={!!touched.contact && !!errors.contact}
                                    helperText={touched.contact && errors.contact}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <Box sx={{ gridColumn: "span 1" }}>
                                    <DatePicker
                                        label="Date"
                                        value={values.date}
                                        onChange={(newValue) => setFieldValue('date', newValue)}
                                        slotProps={{
                                            textField: {
                                                variant: 'filled',
                                                fullWidth: true,
                                                error: !!touched.date && !!errors.date,
                                                helperText: touched.date && errors.date,
                                            }
                                        }}
                                        minDate={new Date()}
                                    />
                                </Box>
                                <Box sx={{ gridColumn: "span 1" }}>
                                    <TimePicker
                                        label="Arrival Time"
                                        value={values.time}
                                        onChange={(newValue) => setFieldValue('time', newValue)}
                                        slotProps={{
                                            textField: {
                                                variant: 'filled',
                                                fullWidth: true,
                                                error: !!touched.time && !!errors.time,
                                                helperText: touched.time && errors.time,
                                            }
                                        }}
                                    />
                                </Box>
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="number"
                                    label="Number of People"
                                    name="pax"
                                    value={values.pax}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
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