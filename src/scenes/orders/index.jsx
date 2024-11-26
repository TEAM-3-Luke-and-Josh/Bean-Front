import { Box, useTheme } from '@mui/material';
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/header.jsx";
import { tokens } from "../../theme.js";
import { useState, useEffect, useCallback } from 'react';
import { DateContext } from '../global/TopBar.jsx';
import ApiClient from '../../services/apiClient';
import OrderModal from '../../components/OrderModal.jsx';

const Orders = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [apiStatus, setApiStatus] = useState(null);

    const columns = [
        { 
            field: "orderTime", 
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
                        hour12: true,
                        timeZone: 'Australia/Sydney',
                    });
                } catch (error) {
                    console.error('Error formatting date:', error);
                    return '';
                }
            }
        },
        { 
            field: "tableID", 
            headerName: "Table", 
            headerAlign: "center", 
            align: "center",
            width: 80,
        },
        {
            field: "items",
            headerName: "Items",
            headerAlign: "left",
            flex: 2,
            renderCell: (params) => {
                const itemCount = params.value.length;
                const itemSummary = params.value
                    .map(item => `${item.quantity}x ${item.itemName}`)
                    .join(', ');
                return (
                    <Box>
                        <span style={{ fontWeight: 'bold' }}>{itemCount} items:</span> {itemSummary}
                    </Box>
                );
            }
        },
        { 
            field: "totalAmount", 
            headerName: "Total", 
            headerAlign: "right",
            align: "right",
            width: 100,
            renderCell: (params) => `$${params.value.toFixed(2)}`
        },
        { 
            field: "orderStatus", 
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
                    case 'in progress':
                        backgroundColor = colors.yellow[500];
                        break;
                    case 'ready':
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
                        justifyContent: 'center',
                        padding: '0 15px'
                    }}>
                        {status}
                    </Box>
                );
            }
        }
    ];    

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/orders');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            const transformedData = data.map(order => ({
                id: order.orderID,
                orderTime: order.orderTime,
                tableID: order.tableID,
                items: order.items,
                totalAmount: order.totalAmount,
                orderStatus: order.orderStatus,
                specialRequests: order.specialRequests
            }));
    
            setOrders(transformedData);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleRowClick = (params) => {
        setSelectedOrder(params.row);
        setOpenModal(true);
    };

    const closeModal = () => {
        setSelectedOrder(null);
        setOpenModal(false);
        setApiStatus(null);
    };

    async function handleUpdateOrderStatus(id, status) {
        try {
            await ApiClient.put(`/orders/${id}/status`, { status });
            
            // Immediately update the local state
            setSelectedOrder(prevOrder => ({
                ...prevOrder,
                orderStatus: status
            }));
            
            setApiStatus('Order status successfully updated.');
            await fetchOrders(); // Keep this to update the background table
        
            setTimeout(() => {
                setApiStatus(null);
            }, 2000);
        
        } catch (error) {
            console.error('Update error:', error);
            setApiStatus(error.message || 'Error updating order status');
        }
    }

    async function handleItemStatusUpdate(orderId, itemId, status) {
        try {
            await ApiClient.put(`/orders/${orderId}/items/${itemId}/status`, { status });
            
            // Immediately update the local state
            setSelectedOrder(prevOrder => ({
                ...prevOrder,
                items: prevOrder.items.map(item => 
                    item.orderItemID === itemId 
                        ? { ...item, itemStatus: status }
                        : item
                )
            }));
            
            setApiStatus('Item status successfully updated.');
            await fetchOrders(); // Keep this to update the background table
        
            setTimeout(() => {
                setApiStatus(null);
            }, 2000);
        
        } catch (error) {
            console.error('Update error:', error);
            setApiStatus(error.message || 'Error updating item status');
        }
    }
    

    return (
        <Box>
            <Header title="Orders" subtitle="Manage restaurant orders" />
            
            <Box height="68vh" sx={{
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
                    backgroundColor: colors.sand[100],
                    borderBottom: "none"
                },
                "& .MuiDataGrid-footerContainer": {
                    borderTop: "none",
                    backgroundColor: colors.sand[100],
                }
            }}>
                <DataGrid 
                    rows={orders}
                    columns={columns}
                    loading={loading}
                    initialState={{
                        sorting: {
                            sortModel: [{ field: 'orderTime', sort: 'desc' }]
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
            
            {selectedOrder && (
                <OrderModal
                    open={openModal}
                    onClose={closeModal}
                    order={selectedOrder}
                    onUpdateStatus={handleUpdateOrderStatus}
                    onUpdateItemStatus={handleItemStatusUpdate}
                    apiStatus={apiStatus}
                    colors={colors}
                />
            )}
        </Box>
    );
};

export default Orders;