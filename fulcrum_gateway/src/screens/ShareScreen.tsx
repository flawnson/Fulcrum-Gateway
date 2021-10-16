import React from 'react';
import {StyleSheet,
        Image,
        Text,
        View} from 'react-native'


type share_props = {
    currentQueueQR: Image,
    currentQueueID: number,
}


export default function(props: share_props) {
    return (
        <View>
            <Text style={styles.header}>
                Come again soon!
            </Text>
            <Image source={require("../assets/images/qr-icon-black.png")}/>
            <Text style={styles.subText}>
                {props.currentQueueID}
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
