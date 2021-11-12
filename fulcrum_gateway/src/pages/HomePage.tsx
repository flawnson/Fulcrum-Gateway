import React from 'react';
import {StyleSheet,
        Image,
        Switch,
        TouchableHighlight} from 'react-native'
import {View} from 'native-base'
import EnqueueGroup from "../components/molecules/EnqueueGroup";
import {PreferencesContext} from "../utilities/useTheme";


export default function () {
    const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);
    const goToCameraView = () => {
        console.log("yes")
    };

    return (
        <View>
            <EnqueueGroup/>
            <Switch onValueChange={toggleTheme} value={isThemeDark}>Toggle</Switch>
            <TouchableHighlight style={styles.qrButton} onPress={goToCameraView}>
                <Image style={styles.qrCode} source={require("../assets/images/qr-icon.png")} />
            </TouchableHighlight>
        </View>
    )
}


const styles = StyleSheet.create({
    qrCode: {
        height: 50,
        width: 50,
    },
    qrButton: {
        marginTop: "5%",
        marginLeft: "80%",
    },
});


