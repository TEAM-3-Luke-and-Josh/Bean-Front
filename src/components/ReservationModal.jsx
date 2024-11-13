import { Box, Typography, Button, Stack, TextField, Modal } from '@mui/material';
import { Form, Formik } from 'formik';

const ReservationModal = ({ open, onClose, selectedRes, onUpdate, onDelete, apiStatus, colors }) => {
  return (
    <Modal 
      open={open} 
      onClose={onClose}
      aria-labelledby="edit-reservation-modal"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box p={3} borderBottom={1} borderColor="divider">
          <Typography variant="h5" fontWeight="bold">
            Edit Reservation
          </Typography>
        </Box>

        {selectedRes && (
          <Formik
            initialValues={{
              start: new Date(selectedRes.start).toLocaleTimeString('en-AU', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
                timeZone: 'Australia/Sydney'
              }),
              name: selectedRes.name,
              phone: selectedRes.phone,
              email: selectedRes.email || '',
              tables: selectedRes.tables ? selectedRes.tables.join(', ') : '',
              numberOfGuests: selectedRes.numberOfGuests,
              status: selectedRes.status,
              notes: selectedRes.notes || ''
            }}
            onSubmit={(values) => onUpdate(selectedRes.id, values)}
          >
            {({ values, handleChange }) => (
              <Form>
                <Box p={3} sx={{ overflowY: 'auto' }}>
                  <Stack spacing={2.5}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        label="Start Time"
                        name="start"
                        value={values.start}
                        onChange={handleChange}
                        fullWidth
                      />
                      <TextField
                        label="Guest Name"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        label="Phone"
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                        fullWidth
                      />
                      <TextField
                        label="Number of Guests"
                        name="numberOfGuests"
                        type="number"
                        value={values.numberOfGuests}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Stack>

                    <TextField
                      label="Tables"
                      name="tables"
                      value={values.tables}
                      onChange={handleChange}
                      fullWidth
                      helperText="Comma separated table numbers (e.g., M1, M2)"
                    />

                    <TextField
                      select
                      label="Status"
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      fullWidth
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Seated">Seated</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </TextField>

                    <TextField
                      label="Notes"
                      name="notes"
                      value={values.notes}
                      onChange={handleChange}
                      fullWidth
                    />

                    {apiStatus && (
                      <Typography 
                        color={apiStatus.includes('Error') ? 'error' : 'success.main'}
                        textAlign="center"
                      >
                        {apiStatus}
                      </Typography>
                    )}
                  </Stack>
                </Box>

                <Box 
                  p={3} 
                  borderTop={1} 
                  borderColor="divider"
                  sx={{
                    backgroundColor: 'background.default',
                    mt: 'auto'
                  }}
                >
                  <Stack 
                    direction="row" 
                    spacing={2} 
                    justifyContent="space-between"
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ 
                        bgcolor: colors.green[500], 
                        color: '#FFF',
                        px: 4,
                        '&:hover': {
                          bgcolor: colors.green[600]
                        }
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => onDelete(selectedRes.id)}
                      sx={{ 
                        bgcolor: colors.pink[500], 
                        color: '#FFF',
                        px: 4,
                        '&:hover': {
                          bgcolor: colors.pink[600]
                        }
                      }}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={onClose}
                      sx={{ 
                        color: colors.swap[200],
                        borderColor: colors.swap[200],
                        px: 4
                      }}
                    >
                      Close
                    </Button>
                  </Stack>
                </Box>
              </Form>
            )}
          </Formik>
        )}
      </Box>
    </Modal>
  );
};

export default ReservationModal;