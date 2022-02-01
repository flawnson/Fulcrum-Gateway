import React, {SetStateAction, useEffect, useState} from 'react';
import { StyleSheet } from 'react-native'
import { Text, Image, Center } from 'native-base'
import { useTranslation } from "react-i18next";

type ShareData = {
    currentQueueName: string,
    currentQueueQR: string | typeof Image,
    currentQueueJoinCode: string,
}

export default function() {
    const [props, setProps] = useState<ShareData>({currentQueueName: "Bob's burgers",
                                                             currentQueueQR: 'Image address',
                                                             currentQueueJoinCode: "1234567890"})
    const [errors, setError] = useState<any>([]);
    const { t, i18n } = useTranslation("shareScreen");

    useEffect(() => {fetchData().then(null)}, [])

    const organizerQuery = `
        query get_queue_stats($queueId: String) {
            getQueue(queueId: $queueId) {
                name
                joinCode: join_code
            }
        }
    `

    const assistantQuery = `
        query get_queue_stats {
            getQueue {
                name
                joinCode: join_code
            }
        }
    `

    const userQuery = `
        query get_queue_stats {
            getUser {
                queue {
                    name
                    joinCode: join_code
                }
            }
        }
    `

    const query = signedInAs === "ORGANIZER" ? organizerQuery :
        signedInAs === "ASSISTANT" ? assistantQuery :
            signedInAs === "USER" ? userQuery : {null: null}
    const variables = signedInAs === "ORGANIZER" ? {queueId: route.params!["queueId"]} : null

    const fetchData = async () => {
        try {
            console.log(query, variables)
            const response = await fetch(`http://localhost:8080/api`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:19006/',
                },
                credentials: 'include',
                body: JSON.stringify({query: query, variables: variables})
            })
            await response.json().then(
                data => {
                    console.log(data)
                    data = data.data.getQueue
                    setProps({
                        ...props,
                        "currentQueueName": data.name,
                        "currentQueueQR": `http://localhost:8080/api/${data.joinCode}`,
                        "currentQueueJoinCode": data.joinCode})
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
            {/*<Image*/}
            {/*    style={styles.QRcode}*/}
            {/*    source={{uri: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${props.currentQueueQR}`}}*/}
            {/*    alt={"QRCode"}*/}
            {/*/>*/}
            <Text style={styles.subText}>
                {props.currentQueueJoinCode}
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
