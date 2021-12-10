import React, { SetStateAction, useState } from 'react'
import { useNavigation } from "@react-navigation/native";
import { HomeScreenProps } from "../../types";
import { StyleSheet } from 'react-native'
import { Center, Heading, Text, Image } from "native-base";
import QueueDashboardGroup from "../components/organisms/QueueDashboardStats";
import QueueDashboardMenu from "../containers/QueueDashboardMenu"
import useInterval from "../utilities/useInterval";
import { zipObject } from "lodash"
import { QueueStats } from "../../types";

type UserData = {
    user_id: string,
    join_time: Date,
    state: string,
}


export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const defaultProps = {
        'enqueued': 0,
        'serviced': 0,
        'deferrals': 0,
        'avg': 0,
        'abandoned': 0,
        'noshow': 0
    }
    const [props, setProps] = useState(defaultProps)
    const query = `
        query get_queue_stats($queue_id: QueueWhereUniqueInput!) {
            queue(where: $queue_id) {
                users {
                    user_id: id
                    join_time
                    state
                }
            }
        }
    `
    const variables = `{
    "queue_id": {
            "id": 1
        }
    }`

    useInterval(async () => {
        try {
            const response = await fetch(`http://localhost:8080/api?query=${query}&variables=${variables}`)
            await response.json().then(
                data => {
                    data = data.data.queue.users
                    const states = ["ENQUEUED", "SERVICED", "DEFERRED", "ABANDONED", "NOSHOW"]
                    let counts = []
                    for (const state of states) {
                        counts.push(data.filter((user: UserData) => {return user.state === state}).length)
                    }
                    const stats: SetStateAction<QueueStats | any> = zipObject(states.map(state => state.toLowerCase()), counts)
                    const now: any = new Date()
                    let lifespans: Array<number> = []
                    for (const user of data) {
                        const join: any = new Date(user.join_time)
                        const lifespan = new Date(Math.abs(now - join)).getMinutes()
                        const minutes = Math.floor(lifespan)
                        lifespans.push(minutes)
                    }
                    stats.avg = lifespans.reduce((a,b) => a + b, 0) / lifespans.length
                    setProps(stats)
                }
            )
        } catch(error) {
            console.log(error)
        }
    }, 5000)

    return (
        <Center style={styles.animationFormat}>
            <Heading style={styles.headingFormat}>Someone's Queue</Heading>
            <QueueDashboardGroup QueueDashboardProps={props}/>
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



