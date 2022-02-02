import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native'
import { Text, View, Center, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { HomeScreenProps } from "../types";
import { useTranslation } from "react-i18next";


type SummonData = {
    queueName?: string,
    venueAddress?: string,
    arriveByTime?: string,
}


export default function() {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const [props, setProps] = useState<SummonData>({})
    const [errors, setError] = useState<any>([]);
    const { t, i18n } = useTranslation("summonScreen");

    useEffect(() => {fetchData()}, [])

    const query = `
        query get_queue_stats($queueId: QueueWhereUniqueInput!) {
            queue(where: $queueId) {
                name
                address
                grace_period
            }
            getUser(where: $userId) {
                summoned
            }
        }
    `
    const variables = `{
        "queueId":
        {
            "id": 1
        }
    }`

    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api?query=${query}&variables=${variables}`)
            await response.json().then(
                data => {
                    // If summoned is toggled false, navigate back to User Dashboard
                    if (!data.data.user.summoned) {navigation.navigate("UserDashboard")}
                    data = data.data.queue.name
                    const now: any = new Date()
                    const join: any = new Date(data.data.queue.grace_period)
                    const arriveByTime = new Date(Math.abs(now + join))
                    setProps({"queueName": data.data.queue.name,
                                    "venueAddress": data.data.queue.address,
                                    "arriveByTime": arriveByTime.getTime().toString()})
                }
            )
        } catch (error) {
            setError([...errors, error])
        }
    }

    return (
        <View>
            <Center>
                <VStack>
                    <Text style={styles.header}>
                        {t('message')}
                    </Text>
                    <Text style={styles.subHeader}>
                        {t('reach_by', {props: props.venueAddress})}
                    </Text>
                    <Text style={styles.header}>
                        {props.arriveByTime}
                    </Text>
                    <Text style={styles.subHeader}>
                        {t('reach_by_cont')}
                    </Text>
                    <Text style={styles.subText}>
                        {t('footer')}
                        <Text style={styles.linkText} onPress={() => navigation.navigate('LandingPage')}> fiefoe.com</Text>
                    </Text>
                </VStack>
            </Center>
        </View>
    )
}


const styles = StyleSheet.create({
    header: {
        textAlign: "center",
        fontSize: 40,
        fontWeight: "bold"
    },
    subHeader: {
        textAlign: "center",
        fontSize: 12,
    },
    subText: {
        textAlign: "center",
        margin: 10,
    },
    linkText: {
        textAlign: "center",
        fontWeight: 'bold',
    }
})
