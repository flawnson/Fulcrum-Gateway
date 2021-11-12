// import {useColorMode} from 'native-base'
// import {useColorScheme} from "react-native";
//
// export default function () {
//     const { colorMode, toggleColorMode } = useColorMode();
//     const colorScheme = useColorScheme()
//
// }

import React from 'react';

export const PreferencesContext = React.createContext({
    toggleTheme: () => {},
    isThemeDark: false,
});



