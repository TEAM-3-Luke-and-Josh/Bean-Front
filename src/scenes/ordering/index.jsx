import { useState, useEffect } from 'react';
import { 
    Box, 
    Card, 
    CardMedia, 
    CardContent, 
    Typography, 
    Button, 
    Chip, 
    Modal, 
    TextField, 
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Paper
} from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import Header from '../../components/header';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ApiClient from '../../services/apiClient';

// Menu Images
import avToast from '../../../src/images/menu_items/av_toast.jpg';
import eggsBen from '../../../src/images/menu_items/eggs_ben.jpg';
import beefBurg from '../../../src/images/menu_items/beef_burg.jpg';
import ceasSalad from '../../../src/images/menu_items/ceas_salad.jpg';
import chocPud from '../../../src/images/menu_items/choc_pud.jpg';
import coffee from '../../../src/images/menu_items/coffee.jpg';
import gardSalad from '../../../src/images/menu_items/gard_salad.jpg';
import orgJuice from '../../../src/images/menu_items/org_juice.jpg';
import spFries from '../../../src/images/menu_items/sp_fries.jpg';
import steakRib from '../../../src/images/menu_items/steak_rib.jpg';
import steakSalm from '../../../src/images/menu_items/steak_salm.jpg';
import stickPud from '../../../src/images/menu_items/sticky_pud.jpg';



export default function OrderSystem() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [menu, setMenu] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [cart, setCart] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cartTotal, setCartTotal] = useState(0);
    const [selectedTable, setSelectedTable] = useState('');
    const [modalQuantity, setModalQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [tables, setTables] = useState([]);

    const categories = ['all', 'breakfast', 'lunch mains', 'dinner mains', 'sides', 'beverages', 'desserts'];

    // Fetch menu data
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const data = await ApiClient.get('/menu');
                setMenu(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching menu:', error);
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const data = await ApiClient.get('/tables');
                const sortedTables = data.sort((a, b) => {
                    if (a.area === b.area) {
                        return a.tableID.localeCompare(b.tableID, undefined, { numeric: true });
                    }
                    return a.area.localeCompare(b.area);
                });
                console.log(sortedTables);
                setTables(sortedTables);
            } catch (error) {
                console.error('Error fetching tables:', error);
            }
        };
        fetchTables();
    }, []);
    

    // Update cart total whenever cart changes
    useEffect(() => {
        const total = cart.reduce((sum, item) => {
            const itemTotal = item.price * item.quantity;
            const optionsTotal = item.selectedOptions?.reduce((optSum, opt) => 
                optSum + opt.priceModifier, 0) || 0;
            return sum + (itemTotal + (optionsTotal * item.quantity));
        }, 0);
        setCartTotal(total);
    }, [cart]);

    const mapImageUrl = (path) => {
        // Map the category and name to the appropriate image file
        switch (path) {
            case 'av_toast.jpg':
                return avToast;
            case 'beef_burg.jpg':
                return beefBurg;
            case 'ceas_salad.jpg':
                return ceasSalad;
            case 'choc_pud.jpg':
                return chocPud;
            case 'coffee.jpg':
                return coffee;
            case 'eggs_ben.jpg':
                return eggsBen;
            case 'gard_salad.jpg':
                return gardSalad;
            case 'org_juice.jpg':
                return orgJuice;
            case 'sp_fries.jpg':
                return spFries;
            case 'steak_ribeye.jpg':
                return steakRib;
            case 'steak_salm.jpg':
                return steakSalm;
            case 'sticky_pud.jpg':
                return stickPud;
            default:
                return '/api/placeholder/400/320'; // Use a placeholder image if no match is found
        }
    };

    const handleRemoveFromCart = (index) => {
        setCart(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpdateQuantity = (index, increment) => {
        setCart(prev => prev.map((item, i) => {
            if (i === index) {
                const newQuantity = Math.max(1, item.quantity + increment);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const handleToggleOption = (option) => {
        setSelectedOptions(prev => {
            const exists = prev.some(opt => opt.optionID === option.optionID);
            if (exists) {
                return prev.filter(opt => opt.optionID !== option.optionID);
            } else {
                return [...prev, option];
            }
        });
    };

    const handleAddToCart = (item) => {
        console.log('Original menu item:', item);
        setSelectedItem(item);
        setModalOpen(true);
    };
    
    const handleModalClose = () => {
        setSelectedItem(null);
        setModalOpen(false);
        setModalQuantity(1);
        setSelectedOptions([]);
        setSpecialInstructions('');
    };
    
    const handleConfirmAddToCart = (item, quantity, selectedOptions, specialInstructions) => {
        console.log('Item being added to cart:', {
            itemID: item.itemID,  // Check if this exists
            menuItemItemID: item.menuItemItemID, // Check if this exists instead
            item,
            quantity,
            selectedOptions,
            specialInstructions
        });
        setCart(prev => [...prev, { ...item, quantity, selectedOptions, specialInstructions }]);
        handleModalClose();
    };

    const handlePlaceOrder = async () => {
        if (!selectedTable || cart.length === 0) return;
    
        try {
            const orderItems = cart.map(item => {
                const orderItem = {
                    itemID: item.itemID,  // Changed back to itemID to match OrderItem model
                    quantity: item.quantity,
                    specialInstructions: item.specialInstructions || '',
                    selectedOptionIds: item.selectedOptions?.map(opt => opt.optionID) || []
                };
                console.log('Individual order item:', orderItem);
                return orderItem;
            });
    
            const orderData = {
                tableID: selectedTable,
                specialRequests: '', 
                items: orderItems
            };
    
            console.log('Final payload as string:', JSON.stringify(orderData, null, 2));
    
            const response = await ApiClient.post('/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });
    
            const responseText = await response.text();  // Get raw response text
            console.log('Raw response:', responseText);  // Log it
    
            let data;
            try {
                data = JSON.parse(responseText);  // Try to parse as JSON
            } catch (e) {
                console.error('Failed to parse response as JSON:', e);
                throw new Error('Invalid response from server');
            }
    
            if (!response.ok) {
                throw new Error(data.message || 'Failed to place order');
            }
    
            console.log('Order placed successfully:', data);
            setCart([]);
            setSelectedTable('');
            alert('Order placed successfully!');
    
        } catch (error) {
            console.error('Error placing order:', error);
            alert(`Failed to place order: ${error.message}`);
        }
    };
    
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>

            {/* Main Content Area */}
            <Box sx={{ flexGrow: 1, p: 3, pr: '220px' }}>

                {/* Header with inline table selection */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Header title="Place Order" subtitle="Order food and drinks" />
                    <FormControl sx={{ minWidth: 400 }}>
                        <InputLabel>Select Table</InputLabel>
                        <Select
                            value={selectedTable}
                            label="Select Table"
                            onChange={(e) => setSelectedTable(e.target.value)}
                        >
                            {tables.map((table) => (
                                <MenuItem key={table.tableID} value={table.tableID}>
                                    Table {table.tableID} ({table.area})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* Categories */}
                <Box mb={3} display="flex" gap={1} sx={{ overflowX: 'auto', pb: 1 }}>
                    {categories.map(category => (
                        <Chip 
                            key={category}
                            label={category.charAt(0).toUpperCase() + category.slice(1)}
                            onClick={() => setSelectedCategory(category)}
                            color={selectedCategory === category ? "primary" : "default"}
                            sx={{ 
                                bgcolor: selectedCategory === category ? colors.green[500] : 'transparent',
                                color: selectedCategory === category ? '#fff' : colors.green[500],
                                '&:hover': { 
                                    bgcolor: selectedCategory === category ? colors.green[600] : colors.green[100]
                                }
                            }}
                        />
                    ))}
                </Box>

                {/* Menu Grid */}
                <Box 
                    display="grid" 
                    gridTemplateColumns="repeat(2, 1fr)"
                    gap={3}
                    >
                    {menu
                        .filter(item => 
                        selectedCategory === 'all' || 
                        item.categoryName.toLowerCase() === selectedCategory.toLowerCase()
                        )
                        .map(item => (
                        <Card key={item.itemID}>
                            <CardMedia 
                            component="img" 
                            height="200" 
                            image={mapImageUrl(item.imageUrl)} 
                            alt={item.name} 
                            />
                            <CardContent>
                            <Typography gutterBottom variant="h5">{item.name}</Typography>
                            <Typography variant="body2" color="text.secondary" mb={2}>
                                {item.description}
                            </Typography>
                            <Typography variant="h6" color={colors.green[500]} mb={2}>
                                ${item.price.toFixed(2)}
                            </Typography>
                            <Button 
                                fullWidth 
                                variant="contained" 
                                sx={{backgroundColor: colors.green[500]}} 
                                onClick={() => handleAddToCart(item)}
                            >
                                Add to Order
                            </Button>
                            </CardContent>
                        </Card>
                        ))}
                    </Box>
            </Box>

            {/* Order Summary Sidebar */}
            <Paper
            elevation={3}
                sx={{
                    position: 'fixed',
                    right: 0,
                    top: 72,
                    bottom: 0,
                    width: '200px',
                    bgcolor: colors.brown[100],
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 1000,
                    overflow: 'hidden'
                }}
            >
                {/* Order Header */}
                <Box sx={{ p: 2, bgcolor: colors.green[500], color: 'white' }}>
                    <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                        <ShoppingCartIcon /> Current Order
                    </Typography>
                    {selectedTable && (
                        <Typography variant="subtitle2">
                            Table: {selectedTable}
                        </Typography>
                    )}
                </Box>

                {/* Order Items */}
                <Box sx={{ 
                    flexGrow: 1, 
                    overflowY: 'auto',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}>
                    {cart.length === 0 ? (
                        <Typography sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}>
                            No items in order
                        </Typography>
                    ) : (
                        cart.map((item, index) => (
                            <Paper
                                key={index}
                                sx={{
                                    p: 2,
                                    bgcolor: colors.green[200],
                                    position: 'relative'
                                }}
                            >
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {item.name}
                                    </Typography>
                                    <IconButton 
                                        size="small" 
                                        onClick={() => handleRemoveFromCart(index)}
                                        sx={{ color: colors.pink[500] }}
                                    >
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                </Box>
                                
                                {/* Quantity Controls */}
                                <Box display="flex" alignItems="center" gap={1} my={1}>
                                    <IconButton 
                                        size="small" 
                                        onClick={() => handleUpdateQuantity(index, -1)}
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                    <Typography>{item.quantity}</Typography>
                                    <IconButton 
                                        size="small"
                                        onClick={() => handleUpdateQuantity(index, 1)}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                    <Typography variant="body2" sx={{ ml: 'auto' }}>
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </Typography>
                                </Box>

                                {/* Options */}
                                {item.selectedOptions?.length > 0 && (
                                    <Box mt={1}>
                                        <Typography variant="caption" color="text.secondary">
                                            Options:
                                        </Typography>
                                        {item.selectedOptions.map((option, i) => (
                                            <Typography key={i} variant="body2" color="text.secondary">
                                                + {option.name} (${option.priceModifier.toFixed(2)})
                                            </Typography>
                                        ))}
                                    </Box>
                                )}

                                {/* Special Instructions */}
                                {item.specialInstructions && (
                                    <Box mt={1}>
                                        <Typography variant="caption" color="text.secondary">
                                            Special Instructions:
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.specialInstructions}
                                        </Typography>
                                    </Box>
                                )}
                            </Paper>
                        ))
                    )}
                </Box>

                {/* Order Summary */}
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="subtitle1">Total</Typography>
                        <Typography variant="h6" color={colors.green[500]}>
                            ${cartTotal.toFixed(2)}
                        </Typography>
                    </Box>
                    <Button
                        fullWidth
                        variant="contained"
                        disabled={cart.length === 0 || !selectedTable}
                        onClick={handlePlaceOrder}
                        sx={{
                            bgcolor: colors.green[500],
                            '&:hover': { bgcolor: colors.green[600] },
                            '&.Mui-disabled': {
                                bgcolor: colors.green[200],
                            }
                        }}
                    >
                        Place Order
                    </Button>
                </Box>
            </Paper>

            {/* Add to Cart Modal */}
            <Modal
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="add-to-cart-modal"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: 400,
                    bgcolor: colors.brown[100],
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}>
                    {selectedItem && (
                        <>
                            <Typography variant="h6" mb={2}>
                                {selectedItem.name}
                            </Typography>
                            
                            <Box mb={3}>
                                <Typography variant="subtitle2" mb={1}>Quantity</Typography>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <IconButton 
                                        size="small"
                                        onClick={() => setModalQuantity(prev => Math.max(1, prev - 1))}
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                    <Typography>{modalQuantity}</Typography>
                                    <IconButton 
                                        size="small"
                                        onClick={() => setModalQuantity(prev => prev + 1)}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </Box>
                            </Box>

                            {selectedItem.options?.length > 0 && (
                                <Box mb={3}>
                                    <Typography variant="subtitle2" mb={1}>Options</Typography>
                                    {selectedItem.options.map(option => (
                                        <Box key={option.optionID} mb={1}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleToggleOption(option)}
                                                sx={{ 
                                                    mr: 1,
                                                    bgcolor: selectedOptions.some(opt => opt.optionID === option.optionID) ? 
                                                        colors.green[500] : 'transparent',
                                                    borderColor: colors.green[500],
                                                    color: selectedOptions.some(opt => opt.optionID === option.optionID) ? 
                                                        'white' : colors.green[500],
                                                    '&:hover': {
                                                        bgcolor: colors.green[500],
                                                        color: '#fff'
                                                    }
                                                }}
                                            >
                                                {option.name} (+${option.priceModifier.toFixed(2)})
                                            </Button>
                                        </Box>
                                    ))}
                                </Box>
                            )}

                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Special Instructions"
                                variant="outlined"
                                value={specialInstructions}
                                onChange={(e) => setSpecialInstructions(e.target.value)}
                                sx={{ mb: 3 }}
                            />

                            <Button 
                                fullWidth 
                                variant="contained"
                                onClick={() => handleConfirmAddToCart(
                                    selectedItem,
                                    modalQuantity,
                                    selectedOptions,
                                    specialInstructions
                                )}
                                sx={{ 
                                    bgcolor: colors.green[500],
                                    '&:hover': { bgcolor: colors.green[600] }
                                }}
                            >
                                Add to Order
                            </Button>
                        </>
                    )}
                </Box>
            </Modal>
        </Box>
    );
}