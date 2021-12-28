import React, { SetStateAction, useState } from 'react'
import { useNavigation } from "@react-navigation/native";
import { HomeScreenProps } from "../../types";
import { StyleSheet } from 'react-native'
import { Center, Heading } from "native-base";
import QueueDashboardGroup from "../components/organisms/QueueDashboardStats";
import QueueDashboardMenu from "../containers/QueueDashboardMenu"
import useInterval from "../utilities/useInterval";
import { zipObject } from "lodash"
import { DashboardStat } from "../../types";

type UserData = {
    user_id: string,
    join_time: Date,
    state: string,
}


export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const defaultProps = {
        name: "Some Queue",
        stats: [
            {prefix: "Enqueued", stat: 0, suffix: ""},
            {prefix: "Serviced", stat: 0, suffix: ""},
            {prefix: "Deferrals", stat: 0, suffix: ""},
            {prefix: "Average wait", stat: 0, suffix: "m"},
            {prefix: "Abandoned", stat: 0, suffix: ""},
            {prefix: "No shows", stat: 0, suffix: ""}
        ],
    }
    const [props, setProps] = useState(defaultProps)
    const query = `
        query get_queue_stats($queue_id: QueueWhereUniqueInput!) {
            queue(where: $queue_id) {
                name
                users {
                    user_id: id
                    join_time
                    status
                }
            }
        }
    `
    const variables = `{
    "queue_id": {
            "id": "costco_queue1"
        }
    }`

    const fetchQueueData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api?query=${query}&variables=${variables}`)
            await response.json().then(
                data => {
                    const name = data.data.queue.name
                    data = data.data.queue.users
                    const states = ["ENQUEUED", "SERVICED", "DEFERRED", "ABANDONED", "NOSHOW"]
                    const counts = []
                    for (const state of states) {
                        counts.push(data.filter((user: UserData) => {return user.state === state}).length)
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
                        {prefix: "Enqueued", stat: stats.enqueued, suffix: ""},
                        {prefix: "Serviced", stat: stats.serviced, suffix: ""},
                        {prefix: "Deferrals", stat: stats.deferrals, suffix: ""},
                        {prefix: "Average wait", stat: stats.avg, suffix: "m"},
                        {prefix: "Abandoned", stat: stats.abandoned, suffix: ""},
                        {prefix: "No shows", stat: stats.noshows, suffix: ""}
                        ]
                    }
                    setProps(stats)
                }
            )
        } catch(error) {
            console.log(error)
        }
    }

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



