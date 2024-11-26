import { Box, Typography, Button, Stack, Modal } from '@mui/material';

const OrderModal = ({ open, onClose, order, onUpdateStatus, onUpdateItemStatus, apiStatus, colors }) => {
    const statusOptions = ['Pending', 'In Progress', 'Ready', 'Completed', 'Cancelled'];
    const itemStatusOptions = ['Pending', 'Preparing', 'Ready', 'Served'];

    return (
        <Modal 
        open={open} 
        onClose={onClose}
        aria-labelledby="order-details-modal"
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
            {order && (
            <>
                <Box p={3} borderBottom={1} borderColor="divider">
                <Typography variant="h5" fontWeight="bold">
                    Order Details - Table {order.tableID}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    {new Date(order.orderTime).toLocaleString()}
                </Typography>
                </Box>

                <Box p={3} sx={{ overflowY: 'auto' }}>
                <Stack spacing={2.5}>
                    {/* Order Items */}
                    <Box>
                    <Typography variant="h6" mb={2}>Order Items</Typography>
                    {order.items.map((item, index) => (
                        <Box 
                            key={index} 
                            sx={{ 
                                mb: 2,
                                p: 2,
                                bgcolor: 'background.default',
                                borderRadius: 1
                            }}
                            >
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography fontWeight="bold">
                                {item.quantity}x {item.itemName}
                                </Typography>
                                <Typography>
                                ${(item.unitPrice * item.quantity).toFixed(2)}
                                </Typography>
                            </Box>

                            {/* Item Options */}
                            {item.selectedOptions?.length > 0 && (
                                <Box ml={2} mb={1}>
                                {item.selectedOptions.map((option, i) => (
                                    <Typography key={i} variant="body2" color="text.secondary">
                                    + {option.name} (${option.priceModifier.toFixed(2)})
                                    </Typography>
                                ))}
                                </Box>
                            )}

                            {/* Special Instructions */}
                            {item.specialInstructions && (
                                <Typography variant="body2" color="text.secondary" ml={2}>
                                Note: {item.specialInstructions}
                                </Typography>
                            )}

                            {/* Item Status Controls */}
                            <Box mt={2}>
                                {itemStatusOptions.map((status) => (
                                    <Button
                                        key={status}
                                        size="small"
                                        variant={item.itemStatus?.toLowerCase() === status.toLowerCase() ? "contained" : "outlined"}
                                        onClick={() => onUpdateItemStatus(order.id, item.orderItemID, status)}
                                        sx={{
                                            mr: 1,
                                            mb: 1,
                                            bgcolor: item.itemStatus?.toLowerCase() === status.toLowerCase() ? colors.green[500] : 'transparent',
                                            borderColor: colors.green[500],
                                            color: item.itemStatus?.toLowerCase() === status.toLowerCase() ? 'white' : colors.green[500],
                                            '&:hover': {
                                                bgcolor: colors.green[600],
                                                color: 'white'
                                            }
                                        }}
                                    >
                                        {status}
                                    </Button>
                                ))}
                            </Box>
                        </Box>
                    ))}
                </Box>

                    {/* Special Requests */}
                    {order.specialRequests && (
                    <Box>
                        <Typography variant="h6" mb={1}>Special Requests</Typography>
                        <Typography>{order.specialRequests}</Typography>
                    </Box>
                    )}

                    {/* Order Total */}
                    <Box>
                    <Typography variant="h6" align="right">
                        Total: ${order.totalAmount.toFixed(2)}
                    </Typography>
                    </Box>

                    {/* Status Update */}
                    <Box>
                    <Typography variant="h6" mb={2}>Update Order Status</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                    {statusOptions.map((status) => (
                        <Button
                        key={status}
                        variant={order.orderStatus === status ? "contained" : "outlined"}
                        onClick={() => onUpdateStatus(order.id, status)}
                        sx={{
                            mb: 1,
                            bgcolor: order.orderStatus === status ? colors.green[500] : 'transparent',
                            borderColor: colors.green[500],
                            color: order.orderStatus === status ? 'white' : colors.green[500],
                            '&:hover': {
                            bgcolor: colors.green[600],
                            color: 'white'
                            }
                        }}
                        >
                        {status}
                        </Button>
                    ))}
                    </Stack>
                    </Box>

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
                        mt: 'auto',
                        display: 'flex',
                    }}
                >
                <Button
                    variant="contained"
                    onClick={onClose}
                    fullWidth
                    sx={{ 
                    color: colors.swap[100],
                    backgroundColor: colors.pink[500],
                    m: '0px 10px 0px 10px',
                    }}
                >
                    Delete
                </Button>
                <Button
                    variant="outlined"
                    onClick={onClose}
                    fullWidth
                    sx={{ 
                    color: colors.swap[200],
                    borderColor: colors.swap[200],
                    m: '0px 10px 0px 10px',
                    }}
                >
                    Close
                </Button>
                </Box>
            </>
            )}
        </Box>
        </Modal>
    );
};

export default OrderModal;