import React, {SetStateAction, useEffect, useState} from 'react'
import {useIsFocused, useNavigation, useRoute} from "@react-navigation/native";
import {DashboardStat, HomeScreenProps} from "../types";
import {StyleSheet} from 'react-native'
import {Center, Heading} from "native-base";
import QueueDashboardGroup from "../components/organisms/QueueDashboardStats";
import QueueDashboardMenu from "../containers/QueueDashboardMenu"
import useInterval from "../utilities/useInterval";
import {zipObject} from "lodash"
import {useTranslation} from "react-i18next";
import {AuthContext} from "../utilities/AuthContext";

type UserData = {
    user_id: string,
    join_time: Date,
    status: string,
}


export default function () {
    const route = useRoute<HomeScreenProps["route"]>()
    const { t } = useTranslation(["queueDashboard"]);

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

    // Two queries are needed depending on what type of user you are
    const assistantQuery = `
        query get_queue_stats {
            getQueue {
                ... on Queue {
                    name
                    users {
                        user_id: id
                        join_time
                        status
                    }
                }
                ... on Error {
                    error
                }
            }
        }
    `
    // Organizers must provide a queueId because they have access to all queues
    const organizerQuery = `
        query get_queue_stats ($queueId: String){
            getQueue(queueId: $queueId) {
                ... on Queue {
                    name
                    users {
                        user_id: id
                        join_time
                        status
                    }
                }
                ... on Error {
                    error
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
                    console.log(data)
                    const name = data.data.getQueue.name
                    data = data.data.getQueue.users
                    // Count the number users with of each type of status
                    const statuses = ["ENQUEUED", "SERVICED", "DEFERRED", "ABANDONED", "NOSHOW"]
                    const counts = []
                    for (const status of statuses) {
                        counts.push(data.filter((user: UserData) => {return user.status === status}).length)
                    }
                    let stats: SetStateAction<DashboardStat[] | any> = zipObject(statuses.map(status => status.toLowerCase()), counts)
                    // Calculate the average of all user waits thus far
                    const now: any = new Date()
                    let userWaits: Array<number> = []
                    for (const user of data) {
                        const join: any = new Date(user.join_time)
                        const waited = new Date(Math.abs(now - join)).getMinutes()
                        const minutes = Math.floor(waited)
                        userWaits.push(minutes)
                    }
                    stats.avg = Math.floor(userWaits.reduce((a,b) => a + b, 0) / userWaits.length)
                    // Set queue data to be displayed and passed to subcomponents
                    setProps({"name": name,
                                    "stats": [{prefix: t("enqueued_prefix"),
                                               stat: stats.enqueued,
                                               suffix: "",
                                               tooltip: t("enqueued_tooltip")},
                                              {prefix: t("serviced_prefix"),
                                               stat: stats.serviced,
                                               suffix: "",
                                               tooltip: t("serviced_tooltip")},
                                              {prefix: t("deferred_prefix"),
                                               stat: stats.deferred,
                                               suffix: "",
                                               tooltip: t("deferred_tooltip")},
                                              {prefix: t("average_prefix"),
                                               stat: stats.avg,
                                               suffix: "m",
                                               tooltip: t("average_tooltip")},
                                              {prefix: t("abandoned_prefix"),
                                               stat: stats.abandoned,
                                               suffix: "",
                                               tooltip: t("abandoned_tooltip")},
                                              {prefix: t("noshow_prefix"),
                                               stat: stats.noshow,
                                               suffix: "",
                                               tooltip: t("noshow_tooltip")}]})
                }
            )
        } catch(error) {
            console.log(error)
        }
    }

    // Run on first render
    useEffect(() => {fetchQueueData().then()}, [])
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
