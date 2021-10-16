import React from 'react'
import {extendTheme} from "native-base";

export const theme = extendTheme({
    colors: {
        // Add new color
        primary: {
            50: '#ffffff',
            100: '#faf0ff',
            200: '#eed2ff',
            300: '#e1b4ff',
            400: '#d296ff',
            500: '#ca86ff',
            600: '#c277ff',
            700: '#b055ff',
            800: '#9b2cff',
            900: '#8f00ff',
        },
        // Redefinig only one shade, rest of the color will remain same.
        amber: {
            400: '#d97706',
        },
    },
    config: {
        // Changing initialColorMode to 'dark'
        initialColorMode: 'light',
    },
    components: {
        View: {
            defaultProps: {
            }
        },
        Center: {
            defaultProps: {
            }
        },
        Button: {
            baseStyle: {},
            defaultProps: {
                colorScheme: 'green',
            },
            variants: {},
            sizes: {},
        },
    },
});
