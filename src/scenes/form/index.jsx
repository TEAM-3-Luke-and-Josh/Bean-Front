import { Box, Button, TextField, useMediaQuery, Typography } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/header.jsx"
import { useState } from 'react';

// INITIAL VALUES
const initialValues = {
    firstName: "",
    lastName: "",
    contact: "",
    pax: "",
    tableId: "",
    time: null,
    date: null,
}

// VALIDATION SCHEMA
const userSchema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    contact: yup.string()
        .required("Phone number is required")
        .matches(/^\+?[\d\s-]+$/, "Invalid phone number format"),
    pax: yup.number()
        .required("Number of people is required")
        .min(1, "Must be at least 1 person")
        .max(20, "Maximum 20 people allowed"),
    tableId: yup.string().required("Table selection is required"),
    time: yup.date().required("Time is required"),
    date: yup.date().required("Date is required"),
})

const Form = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [apiStatus, setApiStatus] = useState(null);

    async function handlePost(values, { resetForm }) {
        try {
            // Combine date and time
            const dateTime = new Date(values.date);
            const timeValue = new Date(values.time);
            dateTime.setHours(timeValue.getHours());
            dateTime.setMinutes(timeValue.getMinutes());
    
            const mappedValues = {
                resDate: dateTime.toISOString(),
                numPeople: parseInt(values.pax),
                firstName: values.firstName,
                lastName: values.lastName,
                phoneNum: values.contact,
                tableName: values.tableId,
                resStatus: 'Pending'
            };
    
            console.log('Posting new reservation:', mappedValues);
    
            const response = await fetch(`http://localhost:3001/reservation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mappedValues)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to post reservation');
            }
    
            setApiStatus('Reservation saved successfully.');
    
            setTimeout(() => {
                resetForm();
                setApiStatus(null);
            }, 2000);
    
        } catch (error) {
            console.error('Update error:', error);
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
                    initialValues={initialValues}
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
                                        type='text'
                                        label='Phone Number'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.contact}
                                        name="contact"
                                        error={!!touched.contact && !!errors.contact}
                                        helperText={touched.contact && errors.contact}
                                        sx={{ gridColumn: "span 4" }}
                                    />
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
                                    <TextField
                                        fullWidth
                                        variant='filled'
                                        label='Table'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.tableId}
                                        name="tableId"
                                        error={!!touched.tableId && !!errors.tableId}
                                        helperText={touched.tableId && errors.tableId}
                                        sx={{ gridColumn: "span 1" }}
                                    >
                                    </TextField>
                                    <Box sx={{ gridColumn: "span 1" }}>
                                        <TimePicker
                                            label="Arrival Time"
                                            value={values.time}
                                            onChange={(newValue) => {
                                                setFieldValue('time', newValue);
                                            }}
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
                                    <Box sx={{ gridColumn: "span 1" }}>
                                        <DatePicker
                                            label="Date"
                                            value={values.date}
                                            onChange={(newValue) => {
                                                setFieldValue('date', newValue);
                                            }}
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
    )
}

export default Form;