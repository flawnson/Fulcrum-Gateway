import React, {SetStateAction, useEffect, useState} from 'react';
import { StyleSheet } from 'react-native'
import { Text, Image, Center } from 'native-base'
import { useTranslation } from "react-i18next";

type ShareData = {
    currentQueueName: string,
    currentQueueQR: string | typeof Image,
    currentQueueID: number,
}

export default function() {
    const [props, setProps] = useState<ShareData>({currentQueueName: "Bob's burgers",
                                                             currentQueueQR: 'Image address',
                                                             currentQueueID: 1234567890})
    const [errors, setError] = useState<any>([]);
    const { t, i18n } = useTranslation("shareScreen");

    useEffect(() => {fetchData().then(null)}, [])
    useEffect(() => {fetchQRCode().then(null)}, [])

    const query = `
        query get_queue_stats($queueId: QueueWhereUniqueInput!) {
            queue(where: $queueId) {
                queueId: id
                name
            }
        }
    `
    const variables = `{
        "queueId":
        {
            "id": "queueId"
        }
    }`

    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api?query=${query}&variables=${variables}`)
            await response.json().then(
                data => {
                    data = data.data.queue.name
                    setProps({...props, "currentQueueName": data})
                }
            )
        } catch (error) {
            setError([...errors, error])
        }
    }

    const fetchQRCode = async () => {
        try {
            const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=www.youtube.com`)
            await response.json().then(
                data => {
                    setProps({...props, "currentQueueQR": data})
                }
            )
        } catch (error) {
            setError([...errors, error])
        }
    }

    return (
        <Center style={styles.container}>
            <Text style={styles.header}>
                {props.currentQueueName}
            </Text>
            <Text style={styles.message}>
                {t('message')}
            </Text>
            <Image style={styles.QRcode} source={{uri: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=www.youtube.com`}} alt={"QRCode"}/>
            <Text style={styles.subText}>
                {props.currentQueueID}
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
