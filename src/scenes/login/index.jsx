// src/scenes/login/index.jsx
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useState } from "react";
//import { useNavigate } from "react-router-dom";
import AuthService from "../../services/authService";

// Optional - import your logo
import LogoWhite from "../../images/logo_white.png";

const Login = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    //const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            console.log('Attempting login...');
            const response = await AuthService.login(formData.username, formData.password);
            console.log('Login response:', response);

            if (response.success) {
                console.log('Login successful, navigating to dashboard...');
                // Force a page reload to ensure all auth state is updated
                window.location.href = '/';
                // Alternative to navigate if you don't want a full reload:
                // navigate('/', { replace: true });
            } else {
                console.log('Login failed:', response.message);
                setError(response.message || "Login failed. Please check your credentials.");
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || "An error occurred during login.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                backgroundColor: colors.pink[500],
            }}
        >
            {/* Header with Logo */}
            <Box
                sx={{
                    padding: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <img src={LogoWhite} alt="Bean Scene Logo" height="60px" />
            </Box>

            {/* Login Form Container */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "20px",
                }}
            >
                <Box
                    sx={{
                        backgroundColor: "background.paper",
                        padding: "40px",
                        borderRadius: "10px",
                        width: "100%",
                        maxWidth: "400px",
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            marginBottom: "20px",
                            textAlign: "center",
                            fontWeight: "bold"
                        }}
                    >
                        Welcome to Bean Scene
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            margin="normal"
                            variant="outlined"
                            required
                            sx={{ marginBottom: 2 }}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            margin="normal"
                            variant="outlined"
                            required
                            sx={{ marginBottom: 3 }}
                        />

                        {error && (
                            <Typography 
                                color="error" 
                                sx={{ 
                                    marginBottom: 2,
                                    textAlign: "center" 
                                }}
                            >
                                {error}
                            </Typography>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{
                                backgroundColor: colors.green[500],
                                color: "white",
                                padding: "12px",
                                "&:hover": {
                                    backgroundColor: colors.green[600],
                                },
                            }}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                </Box>
            </Box>
        </Box>
    );
};

export default Login;