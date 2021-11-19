import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native'
import { Text, Image, Center } from 'native-base'
import { useTranslation } from "react-i18next";

type ShareData = {
    currentQueueQR: string | typeof Image,
    currentQueueID: number,
}

export default function() {
    const [props, setProps] = useState<ShareData>({currentQueueQR: 'Image address', currentQueueID: 1234567890})
    const [errors, setError] = useState<any>([]);
    const { t, i18n } = useTranslation("shareScreen");

    useEffect(() => {fetchData()}, [])

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:8080/queuer/QUEUEID/info')
            setProps(await response.json())
        } catch (error) {
            setError([...errors, error])
        }
    }

    return (
        <Center>
            <Text style={styles.header}>
                {t('message')}
            </Text>
            <Image style={styles.QRcode} source={require("../assets/images/qr-icon-black.png")}/>
            <Text style={styles.subText}>
                {props.currentQueueID}
            </Text>
        </Center>
    )
}

const styles = StyleSheet.create({
    header: {
        fontSize: 40,
        fontWeight: "bold"
    },
    QRcode: {
        width: 30,
    },
    subText: {
        textAlign: "center"
    },
})
