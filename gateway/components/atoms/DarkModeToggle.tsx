import React from "react";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Switch } from "react-native";
import { PreferencesContext } from "../../utilities/useTheme";
import { useColorMode, HStack } from "native-base";
import {scale} from "../../utilities/scales";

export default function () {
    const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);
    const { colorMode, toggleColorMode } = useColorMode()

    function toggle () {
        toggleTheme()
        toggleColorMode()
    }

    return (
        <HStack space={1} style={styles.container}>
            <Feather
                style={styles.switchIcon}
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
        </HStack>
    )
}


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    switch: {
    },
    switchIcon: {
    },
});

