import React, { SetStateAction, useEffect, useState } from 'react'
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { HomeScreenProps } from "../types";
import { StyleSheet } from 'react-native'
import { Center, Heading } from "native-base";
import QueueDashboardGroup from "../components/organisms/QueueDashboardStats";
import QueueDashboardMenu from "../containers/QueueDashboardMenu"
import useInterval from "../utilities/useInterval";
import { zipObject } from "lodash"
import { DashboardStat } from "../types";
import { useTranslation } from "react-i18next";
import GeneralErrorAlert from "../components/atoms/GeneralErrorAlert";

type QueueData = {
    queue_id: string,
    state: string,
}


export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const { t } = useTranslation(["organizerDashboard"]);
    const [errors, setError] = useState<any>([]);
    const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false)
    useEffect(() => {if (!errors.length) {setShowErrorAlert(true)}}, [errors])  // Render alert if errors

    const defaultProps = {
        name: "Some Organizer",
        stats: [
            {prefix: t("total_queues_prefix"), stat: 0, suffix: ""},
            {prefix: t("universal_average_wait"), stat: 0, suffix: "m"},
            {prefix: t("active_patron_count"), stat: 0, suffix: ""},
            {prefix: t("serviced_patron_count"), stat: 0, suffix: ""},
            {prefix: t("reneged_patron_count"), stat: 0, suffix: ""},
        ],
    }
    const [props, setProps] = useState(defaultProps)
    const query = `
        query get_queue_stats($queue_id: QueueWhereUniqueInput!) {
            queues {
                queue(where: $queue_id) {
                    name
                    users {
                        queue_id: id
                        state
                    }
                }
            }
        }
    `
    const variables = `{
    "queue_id": {
            "id": "costco_queue1"
        }
    }`

    async function fetchQueueData () {
        try {
            const response = await fetch(`http://localhost:8080/api?query=${query}&variables=${variables}`)
            await response.json().then(
                data => {
                    if (!!data.errors.length) {setError(data.errors[0])}  // Check for errors on response
                    const name = data.data.queue.name
                    data = data.data.queue.users
                    const states = ["ACTIVE", "PAUSED", "INACTIVE"]
                    const counts = []
                    for (const state of states) {
                        counts.push(data.filter((user: QueueData) => {return user.state === state}).length)
                    }
                    let stats: SetStateAction<DashboardStat[] | any> = zipObject(states.map(state => state.toLowerCase()), counts)
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
                            {prefix: t("total_queues_prefix"), stat: 0, suffix: ""},
                            {prefix: t("universal_average_wait"), stat: 0, suffix: "m"},
                            {prefix: t("active_patron_count"), stat: 0, suffix: ""},
                            {prefix: t("serviced_patron_count"), stat: 0, suffix: ""},
                            {prefix: t("reneged_patron_count"), stat: 0, suffix: ""},
                        ]
                    }
                    setProps(stats)
                }
            )
        } catch(error) {
            setError([...errors, error])
        }
    }

    // Run on first render
    useEffect(() => {fetchQueueData().then(null)}, [])
    // Poll only if user is currently on this screen
    useInterval(fetchQueueData, useIsFocused() ? 5000 : null)

    return (
        <Center style={styles.animationFormat}>
            <GeneralErrorAlert
                showAlert={showErrorAlert}
                setShowAlert={setShowErrorAlert}
                message={t(!errors.length ? "cannot_fetch_serviced_message" : errors[0])} // Render default message
            />
            <Heading style={styles.headingFormat}>{props.name}</Heading>
            {/*<QueueDashboardGroup {...props.stats}/>*/}
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



