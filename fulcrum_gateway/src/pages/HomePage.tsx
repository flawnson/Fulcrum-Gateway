import React from 'react';
import { StyleSheet,
        Image,
        Switch,
        TouchableHighlight } from 'react-native'
import { View } from 'native-base'
import EnqueueGroup from "../components/molecules/EnqueueGroup";
import QRCodeScanner from "../components/organisms/QRCodeScanner";
import { PreferencesContext } from "../utilities/useTheme";
import { useNavigation } from "@react-navigation/native";
import { HomeScreenProps } from "../../types";
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import MultiSelectButtons from "../containers/QueueMultiSelectButtons";


export default function () {
    const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    navigation.setOptions({headerRight: (props) =>
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
    })

    return (
        <View style={styles.container}>
            <EnqueueGroup/>
            <TouchableHighlight style={styles.qrButton} onPress={() => navigation.navigate("QRCodeScanner")}>
                <MaterialCommunityIcons
                    name={'qrcode-scan'}
                    size={32}
                    color={isThemeDark ? 'white': 'black'}
                />
            </TouchableHighlight>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        position: "relative",
        margin: "3%"
    },
    switch: {
        position: "absolute",
        right: "15px",
    },
    switchName: {
        position: "absolute",
        right: "60px",
    },
    qrButton: {
        position: "absolute",
        top: "8px",
        right: "16px",
    },
});


