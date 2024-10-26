import { Box, Button, TextField, useMediaQuery } from '@mui/material';
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/header.jsx"

// INITIAL VALUES
const initialValues = {
    firstName: "",
    lastName: "",
    contact: "",
    pax: "",
    table: "",
    time: "",
    date: "",
}

// PHONE REGEX
const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

// VALIDATION SCHEMA
const userSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    contact: yup.string().matches(phoneRegExp, "Phone number is not valid").required("required"),
    pax: yup.string().required("required"),
    table: yup.string().required("required"),
    time: yup.string().required("required"),
    date: yup.string().required("required"),
})

const Form = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    
    const handleFormSubmit = (values) => {
        console.log(values);
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Add a Reservation" subtitle="Fill in the details below to add a new reservation" />
            </Box>

            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={userSchema}>
                    {({ values, errors, touched, handleBlur, handleChange, handleSubmit}) => (
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
                                    values={values.firstName}
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
                                    values={values.lastName}
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
                                    values={values.phone}
                                    name="phone"
                                    error={!!touched.phone && !!errors.phone}
                                    helperText={touched.phone && errors.phone}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField
                                    fullWidth
                                    variant='filled'
                                    type='text'
                                    label='PAX'
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    values={values.pax}
                                    name="pax"
                                    error={!!touched.pax && !!errors.pax}
                                    helperText={touched.pax && errors.pax}
                                    sx={{ gridColumn: "span 1" }}
                                />
                                <TextField
                                    fullWidth
                                    variant='filled'
                                    type='text'
                                    label='Table #'
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    values={values.table}
                                    name="table"
                                    error={!!touched.table && !!errors.table}
                                    helperText={touched.table && errors.table}
                                    sx={{ gridColumn: "span 1" }}
                                />
                                <TextField
                                    fullWidth
                                    variant='filled'
                                    type='text'
                                    label='Arrival Time'
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    values={values.time}
                                    name="time"
                                    error={!!touched.time && !!errors.time}
                                    helperText={touched.time && errors.time}
                                    sx={{ gridColumn: "span 1" }}
                                />
                                <TextField
                                    fullWidth
                                    variant='filled'
                                    type='text'
                                    label='Date'
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    values={values.date}
                                    name="date"
                                    error={!!touched.date && !!errors.date}
                                    helperText={touched.date && errors.date}
                                    sx={{ gridColumn: "span 1" }}
                                />
                            </Box>
                            <Box display="flex" justifyContent="start" mt="40px">
                                <Button type="submit" color="secondary" variant="contained">
                                    Add Reservation
                                </Button>
                            </Box>
                        </form>
                    )}
            </Formik>
        </Box>
    )
}

export default Form;