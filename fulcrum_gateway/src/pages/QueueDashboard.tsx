import React, { SetStateAction, useEffect, useState } from 'react'
import {useIsFocused, useNavigation, useRoute} from "@react-navigation/native";
import { HomeScreenProps } from "../../types";
import { StyleSheet } from 'react-native'
import { Center, Heading } from "native-base";
import QueueDashboardGroup from "../components/organisms/QueueDashboardStats";
import QueueDashboardMenu from "../containers/QueueDashboardMenu"
import useInterval from "../utilities/useInterval";
import { zipObject } from "lodash"
import { DashboardStat } from "../../types";
import { useTranslation } from "react-i18next";

type UserData = {
    user_id: string,
    join_time: Date,
    status: string,
}


export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const route = useRoute<HomeScreenProps["route"]>()
    const { t, i18n } = useTranslation(["queueDashboard"]);

    const defaultProps = {
        name: "Some Queue",
        stats: [
            {prefix: t("enqueued_prefix"), stat: 0, suffix: "", tooltip: t("enqueued_tooltip")},
            {prefix: t("serviced_prefix"), stat: 0, suffix: "", tooltip: t("serviced_tooltip")},
            {prefix: t("deferred_prefix"), stat: 0, suffix: "", tooltip: t("deferred_tooltip")},
            {prefix: t("average_prefix"), stat: 0, suffix: "m", tooltip: t("average_tooltip")},
            {prefix: t("abandoned_prefix"), stat: 0, suffix: "", tooltip: t("abandoned_tooltip")},
            {prefix: t("noshow_prefix"), stat: 0, suffix: "", tooltip: t("noshow_tooltip")}
        ],
    }
    const [props, setProps] = useState(defaultProps)
    const assistantQuery = `
        query get_queue_stats {
            getQueue {
                name
                users {
                    user_id: id
                    join_time
                    status
                }
            }
        }
    `
    const organizerQuery = `
        query get_queue_stats ($queueId: String) {
            getQueue(queueId: $queueId) {
                name
                users {
                    user_id: id
                    join_time
                    status
                }
            }
        }
    `
    // @ts-ignore
    const body = route.params ? {query: organizerQuery, variables: {"queueId": route.params?.queueId}} : {query: assistantQuery}

    async function fetchQueueData () {
        try {
            const response = await fetch(`http://localhost:8080/api`, {
                                         method: 'POST',
                                         headers: {
                                             'Content-Type': 'application/json',
                                             'Access-Control-Allow-Origin': 'http://localhost:19006/',
                                         },
                                         credentials: 'include',
                                         body: JSON.stringify(body)
                                         })
            await response.json().then(
                data => {
                    const name = data.data.getQueue.name
                    data = data.data.getQueue.users
                    const statuses = ["ENQUEUED", "SERVICED", "DEFERRED", "ABANDONED", "NOSHOW"]
                    const counts = []
                    for (const status of statuses) {
                        counts.push(data.filter((user: UserData) => {return user.status === status}).length)
                    }
                    let stats: SetStateAction<DashboardStat[] | any> = zipObject(statuses.map(status => status.toLowerCase()), counts)
                    const now: any = new Date()
                    let lifespans: Array<number> = []
                    for (const user of data) {
                        const join: any = new Date(user.join_time)
                        const waited = new Date(Math.abs(now - join)).getMinutes()
                        const minutes = Math.floor(waited)
                        lifespans.push(minutes)
                    }
                    stats.avg = Math.floor(lifespans.reduce((a,b) => a + b, 0) / lifespans.length)
                    stats = {name: name, stats: [
                        {prefix: t("enqueued_prefix"), stat: stats.enqueued, suffix: ""},
                        {prefix: t("serviced_prefix"), stat: stats.serviced, suffix: ""},
                        {prefix: t("deferred_prefix"), stat: stats.deferred, suffix: ""},
                        {prefix: t("average_prefix"), stat: stats.avg, suffix: "m"},
                        {prefix: t("abandoned_prefix"), stat: stats.abandoned, suffix: ""},
                        {prefix: t("noshow_prefix"), stat: stats.noshow, suffix: ""}
                        ]
                    }
                    setProps(stats)
                }
            )
        } catch(error) {
            console.log(error)
        }
    }

    // Run on first render
    useEffect(() => {fetchQueueData()}, [])
    // Poll only if user is currently on this screen
    useInterval(fetchQueueData, useIsFocused() ? 5000 : null)

    return (
        <Center style={styles.animationFormat}>
            <Heading style={styles.headingFormat}>{props.name}</Heading>
            <QueueDashboardGroup {...props.stats}/>
            <QueueDashboardMenu />
        </Center>
    )
}

const styles = StyleSheet.create({
    animationFormat: {
        position: 'relative',
    },
    animation: {
        marginTop: 25,
        marginBottom: 25,
        width: 309,
        height: 93,
    },
    headingFormat: {
        marginTop: 25,
        marginBottom: 25,
    },
    textFormat: {
        marginTop: 25,
        marginBottom: 25,
    },
})



