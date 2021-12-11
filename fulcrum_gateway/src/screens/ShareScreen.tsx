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

    useEffect(() => {fetchData()}, [])

    const query = `
        query get_queue_stats($queueId: QueueWhereUniqueInput!) {
            queue(where: $queueId) {
                name
            }
        }
    `
    const variables = `{
        "queueId":
        {
            "id": 2
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

    return (
        <Center>
            <Text style={styles.header}>
                {props.currentQueueName}
            </Text>
            <Text style={styles.message}>
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
    message: {
        fontSize: 20,
    },
    QRcode: {
        width: 30,
    },
    subText: {
        textAlign: "center"
    },
})
