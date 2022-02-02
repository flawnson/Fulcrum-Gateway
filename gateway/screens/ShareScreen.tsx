import React from 'react';
import { StyleSheet } from 'react-native'
import { Text, Image, Center } from 'native-base'
import { useTranslation } from "react-i18next";
import {useRoute} from "@react-navigation/native";
import {HomeScreenProps} from "../types";


export default function() {
    // We get all share data via route params because all user types can access the Share Screen
    // This also prevents rerender hell caused by having the fetch share data method in this screen with useEffect
    const route = useRoute<HomeScreenProps["route"]>()
    const { t, i18n } = useTranslation("shareScreen");

    return (
        <Center style={styles.container}>
            <Text style={styles.header}>
                {route.params!["shareData"]["currentQueueName"]}
            </Text>
            <Text style={styles.message}>
                {t('message')}
            </Text>
            <Image
                style={styles.QRcode}
                source={{uri: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${route.params!["shareData"]["currentQueueQR"]}`}}
                alt={"QRCode"}
            />
            <Text style={styles.subText}>
                {route.params!["shareData"]["currentQueueJoinCode"]}
            </Text>
        </Center>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        flex: 1,
        bottom: 50,
    },
    header: {
        fontSize: 40,
        fontWeight: "bold"
    },
    message: {
        fontSize: 20,
        margin: 20
    },
    QRcode: {
        width: 300,
        height: 300,
    },
    subText: {
        textAlign: "center",
        fontSze: 70,
        margin: 20
    },
})
