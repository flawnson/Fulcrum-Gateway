import React from "react";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Switch } from "react-native";
import { PreferencesContext } from "../../utilities/useTheme";
import { useColorMode } from "native-base";

export default function () {
    const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);
    const { colorMode, toggleColorMode } = useColorMode()

    function toggle () {
        toggleTheme()
        toggleColorMode()
    }

    return (
        <>
            <Feather
                style={styles.switchName}
                name={isThemeDark ? 'sun' : 'moon'}
                size={32}
                color={isThemeDark ? 'white': 'black'}
            />
            <Switch
                style={styles.switch}
                onValueChange={toggle}
                value={isThemeDark}
                thumbColor={isThemeDark ? '#FFFFFF' : '#FFFFFF'}
                trackColor={{false: 'gray', true: '#FFFFFF'}}
            />
        </>
    )
}


const styles = StyleSheet.create({
    switch: {
    },
    switchName: {
    },
});

