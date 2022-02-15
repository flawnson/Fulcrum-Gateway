import React from "react";
import {
    useFonts,
    Poppins_100Thin,
    Poppins_100Thin_Italic,
    Poppins_200ExtraLight,
    Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    Poppins_800ExtraBold_Italic,
    Poppins_900Black,
    Poppins_900Black_Italic
} from '@expo-google-fonts/poppins'
import SplashScreen from "../screens/SplashScreen";

export default function () {
    // Can choose to load locally by using require('path to font file")
    const [fontsLoaded] = useFonts({
        "Poppins_100Thin": Poppins_100Thin,
        "Poppins_100Thin_Italic": Poppins_100Thin_Italic,
        "Poppins_200ExtraLight": Poppins_200ExtraLight,
        "Poppins_200ExtraLight_Italic": Poppins_200ExtraLight_Italic,
        "Poppins_300Light": Poppins_300Light,
        "Poppins_300Light_Italic": Poppins_300Light_Italic,
        "Poppins_400Regular": Poppins_400Regular,
        "Poppins_400Regular_Italic": Poppins_400Regular_Italic,
        "Poppins_500Medium": Poppins_500Medium,
        "Poppins_500Medium_Italic": Poppins_500Medium_Italic,
        "Poppins_600SemiBold": Poppins_600SemiBold,
        "Poppins_600SemiBold_Italic": Poppins_600SemiBold_Italic,
        "Poppins_700Bold": Poppins_700Bold,
        "Poppins_700Bold_Italic": Poppins_700Bold_Italic,
        "Poppins_800ExtraBold": Poppins_800ExtraBold,
        "Poppins_800ExtraBold_Italic": Poppins_800ExtraBold_Italic,
        "Poppins_900Black": Poppins_900Black,
        "Poppins_900Black_Italic": Poppins_900Black_Italic
    })

    // Load fonts asynchronously
    if (!fontsLoaded) {
        return <SplashScreen />;
    }

    return ({
            colors: {
                // Add new color
                primary: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
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
                        colorScheme: 'primary',
                    },
                    variants: {},
                    sizes: {},
                },
                Text: {
                    defaultProps: {
                        color: 'black',
                        selectable: false
                    }
                },
            },
            fontConfig: {
                Poppins: {
                    100: {
                        normal: 'Poppins_100Thin',
                        italic: 'Poppins_100Thin_Italic',
                    },
                    200: {
                        normal: 'Poppins_200ExtraLight',
                        italic: 'Poppins_200ExtraLight_Italic',
                    },
                    300: {
                        normal: 'Poppins_300Light',
                        italic: 'Poppins_300Light_Italic',
                    },
                    400: {
                        normal: 'Poppins_400Regular',
                        italic: 'Poppins_400Regular_Italic',
                    },
                    500: {
                        normal: 'Poppins_500Medium',
                        italic: 'Poppins_500Medium_Italic',
                    },
                    600: {
                        normal: 'Poppins_600SemiBold',
                        italic: 'Poppins_600SemiBold_Italic',
                    },
                    700: {
                        normal: 'Poppins_700Bold',
                        italic: 'Poppins_700Bold_Italic',
                    },
                    800: {
                        normal: 'Poppins_800ExtraBold',
                        italic: 'Poppins_800ExtraBold_Italic',
                    },
                    900: {
                        normal: 'Poppins_900Black',
                        italic: 'Poppins_900Black_Italic ',
                    },
                },
            },

            // Make sure values below matches any of the keys in `fontConfig`
            fonts: {
                heading: 'Poppins',
                body: 'Poppins',
                mono: 'Poppins',
            },
        }
    )
}
