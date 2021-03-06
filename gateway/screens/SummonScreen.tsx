import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native'
import { Text, View, Center, VStack } from "native-base";
import {useNavigation, useRoute} from "@react-navigation/native";
import { HomeScreenProps } from "../types";
import { useTranslation } from "react-i18next";
import baseURL from "../utilities/baseURL";


type SummonData = {
    queueName?: string,
    venueAddress?: string,
    arriveByTime?: string,
}


export default function() {
    const route = useRoute<HomeScreenProps["route"]>()
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const [props, setProps] = useState<SummonData>({})
    const [errors, setError] = useState<any>([]);
    const { t, i18n } = useTranslation("summonScreen");

    useEffect(() => {fetchData().then()}, [])

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
    // @ts-ignore trying to get the queueId and userId from the UserDashboard
    const variables = route.params ? {queueId: route.params!["queueId"], userId: route.params!["userId"]} : null

    const fetchData = async () => {
        try {
            fetch(baseURL(), {
                method: "POST",
                body: JSON.stringify({query: query, variables: variables})
            }).then(response => response.json()).then(data => {
                    // If summoned is toggled false, navigate back to User Dashboard
                    if (!data.data.user.summoned) {navigation.navigate("UserDashboard")}
                    data = data.data.queue.name
                    // Calculate arrive by time, current time plus grace period
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
                        <Text style={styles.linkText} onPress={() => navigation.navigate('HomePage')}> fiefoe.com</Text>
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
