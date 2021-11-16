import React from 'react';
import {StyleSheet,
        Image,
        Switch,
        TouchableHighlight} from 'react-native'
import { View } from 'native-base'
import EnqueueGroup from "../components/molecules/EnqueueGroup";
import QRCodeScanner from "../components/atoms/QRCodeScanner";
import { PreferencesContext } from "../utilities/useTheme";
import {useNavigation} from "@react-navigation/native";
import {HomeScreenProps} from "../../types";
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function () {
    const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);
    const navigation = useNavigation<HomeScreenProps["navigation"]>()

    return (
        <View>
            <EnqueueGroup/>
            <Switch onValueChange={toggleTheme} value={isThemeDark}>Toggle</Switch>
            <TouchableHighlight style={styles.qrButton} onPress={() => navigation.navigate("QRCodeScanner")}>
                <MaterialCommunityIcons name={'qrcode-scan'} size={32} color={isThemeDark ? 'white': 'black'} />
            </TouchableHighlight>
        </View>
    )
}


const styles = StyleSheet.create({
    qrButton: {
        marginTop: "5%",
        marginLeft: "80%",
    },
});


