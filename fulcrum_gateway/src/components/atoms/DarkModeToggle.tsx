import { Feather } from "@expo/vector-icons";
import { StyleSheet, Switch } from "react-native";
import React from "react";
import { PreferencesContext } from "../../utilities/useTheme";

export default function () {
    const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);

    return ((props: {tintColor?: string | undefined}) =>
        <>
            <Feather
                style={styles.switchName}
                name={isThemeDark ? 'sun' : 'moon'}
                size={32}
                color={isThemeDark ? 'white': 'black'}
            />
            <Switch
                style={styles.switch}
                onValueChange={toggleTheme}
                value={isThemeDark}
                thumbColor={isThemeDark ? '#FFFFFF' : '#FFFFFF'}
                trackColor={{false: 'gray', true: '#FFFFFF'}}
            />
        </>
    )
}


const styles = StyleSheet.create({
    switch: {
        position: "absolute",
        right: "15px",
    },
    switchName: {
        position: "absolute",
        right: "60px",
    },
});

