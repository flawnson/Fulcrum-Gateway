import React from 'react';
import {StyleSheet,
        Image,
        TouchableHighlight} from 'react-native'
import {View} from 'native-base'
import QueueUp from "../components/molecules/EnqueueGroup";


export default function () {
    const goToCameraView = () => {
        console.log("yes")
    };

    return (
        <View>
            <QueueUp/>
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

