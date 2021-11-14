import React, {useEffect, useState} from 'react';
import {StyleSheet,
        Image,
        Text,
        View} from 'react-native'
import {useTranslation} from "react-i18next";

type ShareData = {
    currentQueueQR: string | Image,
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
