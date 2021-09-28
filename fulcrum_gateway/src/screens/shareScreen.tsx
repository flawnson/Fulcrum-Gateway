import React from 'react';
import {StyleSheet,
        Image,
        Text,
        View} from 'react-native'


export default function() {
    return (
        <View>
            <Text style={styles.header}>
                Come again soon!
            </Text>
            <Image source={require("../assets/images/qr-icon-black.png")}/>
            <Text style={styles.subText}>
                6477135354
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
            position: "absolute",
            textAlign: "center",
            fontSize: 40,
            fontWeight: "bold"
    },
    subText: {
        position: "absolute",
        top: 300,
        textAlign: "center"
    },
})
