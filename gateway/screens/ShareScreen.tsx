// @ts-nocheck to prevent errors for route-params
import React from 'react';
import { StyleSheet } from 'react-native'
import {Text, Button, Image, Center, Heading} from 'native-base'
import { useTranslation } from "react-i18next";
import {useRoute} from "@react-navigation/native";
import {HomeScreenProps} from "../types";
import { SafeAreaView } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';


export default function() {
    // We get all share data via route params because all user types can access the Share Screen
    // This also prevents rerender hell caused by having the fetch share data method in this screen with useEffect
    const route = useRoute<HomeScreenProps["route"]>()
    const { t } = useTranslation("shareScreen");

    const copyToClipboard = () => {
        Clipboard.setString(`https://fiefoe.com/${route.params!["shareData"]["currentQueueJoinCode"]}`);
    };

    return (
        <SafeAreaView style={{flex: 1}}>
            <Center style={styles.container}>
                <Heading>
                    {route.params!["shareData"]["currentQueueName"]}
                </Heading>
                <Text style={styles.message}>
                    {t('message')}
                </Text>
                <Image
                    style={styles.QRcode}
                    source={{uri: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${route.params!["shareData"]["currentQueueQR"]}`}}
                    alt={"QRCode"}
                />
                <Text fontSize="3xl" style={styles.subText}>
                    {route.params!["shareData"]["currentQueueJoinCode"]}
                </Text>
                <Text style={styles.subText}>
                    Click here to copy the join code to Clipboard
                </Text>
                <Button onPress={() => copyToClipboard()}>
                    {t("copy")}
                </Button>
            </Center>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        flex: 1,
    },
    message: {
        fontSze: 32,
        margin: 20
    },
    QRcode: {
        width: 300,
        height: 300,
    },
    subText: {
        textAlign: "center",
        margin: 20
    },
})
