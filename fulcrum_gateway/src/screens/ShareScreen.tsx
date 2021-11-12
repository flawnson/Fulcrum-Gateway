import React from 'react';
import {StyleSheet,
        Image,
        Text,
        View} from 'react-native'
import {useTranslation} from "react-i18next";


type share_props = {
    currentQueueQR: Image,
    currentQueueID: number,
}


export default function(props: share_props) {
    const { t, i18n } = useTranslation("shareScreen");

    return (
        <View>
            <Text style={styles.header}>
                {t('message')}
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
