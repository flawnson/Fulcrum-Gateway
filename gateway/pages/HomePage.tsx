import React, { useEffect } from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native'
import { View } from 'native-base'
import EnqueueGroup from "../components/molecules/EnqueueGroup";
import QRCodeScanner from "../components/organisms/QRCodeScanner";
import { PreferencesContext } from "../utilities/useTheme";
import { useNavigation, StackActions } from "@react-navigation/native";
import { HomeScreenProps } from "../types";
import { MaterialCommunityIcons} from '@expo/vector-icons';
import RightHeaderGroup from "../components/molecules/RightHeaderGroup";


export default function () {
    const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    useEffect(() => navigation.setOptions({headerRight: RightHeaderGroup()}), [])

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


