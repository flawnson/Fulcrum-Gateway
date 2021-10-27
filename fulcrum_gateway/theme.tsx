import React from 'react'
import {extendTheme, useColorMode} from "native-base";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useColorScheme} from "react-native";

export function nativebaseTheme () {
    const { colorMode } = useColorMode();
    const darkTheme = {
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
            initialColorMode: 'dark',
        },
        components: {
            Button: {
                baseStyle: {},
                defaultProps: {
                    colorScheme: 'red',
                },
                variants: {},
                sizes: {},
            },
            Input: {
                defaultProps: {
                    placeholderTextColor: 'white',
                    borderColor: 'white',
                }
            }
        },
    }
    const lightTheme = {
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
            // Changing initialColorMode to 'light'
            initialColorMode: 'light',
        },
        components: {
            Button: {
                baseStyle: {},
                defaultProps: {
                    colorScheme: 'green',
                },
                variants: {},
                sizes: {},
            },
        },
    }

    return extendTheme(colorMode === 'dark' ? darkTheme : lightTheme);
}

export function navigationTheme () {  // https://reactnavigation.org/docs/themes/
    const { colorMode } = useColorMode();
    return ({
        ...(colorMode === 'dark' ? DarkTheme : DefaultTheme),  // Should do useColorScheme() hook from react native
        colors: {
            ...(colorMode === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
            background: (colorMode === 'dark' ? '#8743FF' : '#ffffff'),
        }
    })
}

