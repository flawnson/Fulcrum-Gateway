import React from 'react'
import { extendTheme, useColorMode } from "native-base";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import darkTheme from "./utilities/darkTheme";
import lightTheme from "./utilities/lightTheme";

export function nativebaseTheme (colorMode: string) {
    return extendTheme(colorMode === 'dark' ? darkTheme() : lightTheme());
}

export function navigationTheme (colorMode: string) {  // https://reactnavigation.org/docs/themes/
    return ({
        ...(colorMode === 'dark' ? DarkTheme : DefaultTheme),  // Should do useColorScheme() hook from react native
        colors: {
            ...(colorMode === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
            background: (colorMode === 'dark' ? '#372B47' : '#ffffff'),
        }
    })
}

