import React, { SetStateAction, useEffect, useState } from 'react'
import { useIsFocused, useNavigation } from "@react-navigation/native";
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
    const { t, i18n } = useTranslation(["queueDashboard"]);

    const defaultProps = {
        name: "Some Queue",
        stats: [
            {prefix: t("enqueued_prefix"), stat: 0, suffix: ""},
            {prefix: t("serviced_prefix"), stat: 0, suffix: ""},
            {prefix: t("deferred_prefix"), stat: 0, suffix: ""},
            {prefix: t("average_prefix"), stat: 0, suffix: "m"},
            {prefix: t("abandoned_prefix"), stat: 0, suffix: ""},
            {prefix: t("noshows_prefix"), stat: 0, suffix: ""}
        ],
    }
    const [props, setProps] = useState(defaultProps)
    const query = `
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

    async function fetchQueueData () {
        try {
            const response = await fetch(`http://localhost:8080/api`, {
                                         method: 'POST',
                                         headers: {
                                             'Content-Type': 'application/json'
                                         },
                                         body: JSON.stringify({query: query})
            })
            await response.json().then(
                data => {
                    const name = data.data.getQueue.name
                    data = data.data.queue.users
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
                        const lifespan = new Date(Math.abs(now - join)).getMinutes()
                        const minutes = Math.floor(lifespan)
                        lifespans.push(minutes)
                    }
                    stats.avg = lifespans.reduce((a,b) => a + b, 0) / lifespans.length
                    stats = {name: name, stats: [
                        {prefix: t("enqueued_prefix"), stat: stats.enqueued, suffix: ""},
                        {prefix: t("serviced_prefix"), stat: stats.serviced, suffix: ""},
                        {prefix: t("deferred_prefix"), stat: stats.deferred, suffix: ""},
                        {prefix: t("average_prefix"), stat: stats.avg, suffix: "m"},
                        {prefix: t("abandoned_prefix"), stat: stats.abandoned, suffix: ""},
                        {prefix: t("noshows_prefix"), stat: stats.noshows, suffix: ""}
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
    // if (useIsFocused()) {useInterval(fetchQueueData, 5000)}
    useInterval(fetchQueueData, 5000)

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



