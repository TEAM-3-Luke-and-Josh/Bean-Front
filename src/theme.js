import { createContext, useState, useMemo } from 'react';
import { createTheme } from "@mui/material/styles";

// color tokens
export const tokens = (mode) => ({
    ...(mode === 'dark'
        ? {
            swap: {
                100: "#FFF",
                200: "#000",
            },
            brown: {
                100: "#0072B2",
                200: "#2e211a",
                300: "#453126",
                400: "#5c4233",
                500: "#735240",
                600: "#8f7566",
                700: "#ab978c",
                800: "#c7bab3",
                900: "#e3dcd9",
            },
            yellow: {
                100: "#2d240c",
                200: "#5b4718",
                300: "#886b24",
                400: "#b68e30",
                500: "#e3b23c",
                600: "#e9c163",
                700: "#eed18a",
                800: "#f4e0b1",
                900: "#f9f0d8",
            },
            green: {
                100: "#212b23",
                200: "#415747",
                300: "#62826a",
                400: "#82ae8e",
                500: "#0072B2",
                600: "#b5e1c1",
                700: "#c8e8d0",
                800: "#daf0e0",
                900: "#edf7ef",
            },
            pink: {
                100: "#301c1c",
                200: "#613838",
                300: "#915454",
                400: "#c27070",
                500: "#E69F00",
                600: "#f5a3a3",
                700: "#f7baba",
                800: "#fad1d1",
                900: "#fce8e8",
            },
            sand: {
                100: "#32312e",
                200: "#64615c",
                300: "#959289",
                400: "#c7c2b7",
                500: "#f9f3e5",
                600: "#faf5ea",
                700: "#FFFFFF",
                800: "#fdfaf5",
                900: "#fefdfa",
            },
        } : {
            swap: {
                100: "#FFF",
                200: "#000",
            },
            brown: {
                100: "#f5f5f5",
                200: "#c7bab3",
                300: "#ab978c",
                400: "#8f7566",
                500: "#735240",
                600: "#5c4233",
                700: "#453126",
                800: "#2e211a",
                900: "#17100d"
            },
            yellow: {
                100: "#f9f0d8",
                200: "#f4e0b1",
                300: "#eed18a",
                400: "#e9c163",
                500: "#e3b23c",
                600: "#b68e30",
                700: "#886b24",
                800: "#5b4718",
                900: "#2d240c"
            },
            green: {
                100: "#edf7ef",
                200: "#daf0e0",
                300: "#c8e8d0",
                400: "#b5e1c1",
                500: "#a3d9b1",
                600: "#82ae8e",
                700: "#62826a",
                800: "#415747",
                900: "#212b23"
            },
            pink: {
                100: "#fce8e8",
                200: "#fad1d1",
                300: "#f7baba",
                400: "#f5a3a3",
                500: "#f28c8c",
                600: "#c27070",
                700: "#915454",
                800: "#613838",
                900: "#301c1c"
            },
            sand: {
                100: "#fefdfa",
                200: "#fdfaf5",
                300: "#fbf8ef",
                400: "#faf5ea",
                500: "#f9f3e5",
                600: "#c7c2b7",
                700: "#e3b23c",
                800: "#64615c",
                900: "#32312e"
            },
        }
    )
});

// mui theme settings
export const themeSettings = (mode) => {
    const colors = tokens(mode);

    return {
        palette: {
            mode: mode,
            ...(mode === 'dark'
                ? {
                    primary: {
                        main: "#ffffff",
                    },
                    secondary: {
                        main: colors.yellow[500],
                    },
                    neutral: {
                        dark: colors.green[700],
                        main: colors.green[500],
                        light: colors.pink[100]
                    },
                    background: {
                        default: "#222",
                    }
                } : {
                    primary: {
                        main: "#ffffff",
                    },
                    secondary: {
                        main: colors.pink[500],
                    },
                    neutral: {
                        dark: colors.yellow[700],
                        main: colors.yellow[500],
                        light: colors.yellow[100]
                    },
                    background: {
                        default: "#fcfcfc",
                    }
                }),
        },
        typography: {
            fontFamily: ["Poppins", "sans-serif"].join(","),
            fontSize: 12,
            h1: {
                fontFamily: ["Poppins", "sans-serif"].join(","),
                fontSize: 40,
            },
            h2: {
                fontFamily: ["Poppins", "sans-serif"].join(","),
                fontSize: 32,
            },
            h3: {
                fontFamily: ["Poppins", "sans-serif"].join(","),
                fontSize: 24,
            },
            h4: {
                fontFamily: ["Poppins", "sans-serif"].join(","),
                fontSize: 20,
            },
            h5: {
                fontFamily: ["Poppins", "sans-serif"].join(","),
                fontSize: 16,
            },
            h6: {
                fontFamily: ["Poppins", "sans-serif"].join(","),
                fontSize: 14,
            },
        }
    };
};

// context for color mode
export const ColorModeContext = createContext({
    toggleColorMode: () => {}
});

export const useMode = () => {
    const [mode, setMode] = useState("light");

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () =>
                setMode((prev) => (prev === "light" ? "dark" : "light")),
        }),
        []
    );

    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])

    return [theme, colorMode];
}