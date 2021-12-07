import React, {SetStateAction, useState} from 'react'
import {useNavigation} from "@react-navigation/native";
import {HomeScreenProps} from "../../types";
import {StyleSheet} from 'react-native'
import {Center, Heading, Text, Image} from "native-base";
import QueueDashboardGroup from "../components/organisms/QueueDashboardStats";
import QueueDashboardMenu from "../containers/QueueDashboardMenu"
import useInterval from "../utilities/useInterval";


export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const tempProps = {
        'enqueued': 35,
        'serviced': 22,
        'deferrals': 8,
        'avg': 12,
        'abandonments': 2,
        'noshows': 0
    }
    const [props, setProps] = useState(tempProps)
    const query = `
        query Queue($id: ID!){
            queue(queue_id: $id){
                num_enqueued
                num_serviced
                num_deferred
                average_wait_time
                num_abandoned
                num_noshows
            }
        }
    `
    const variables = `{
        "id": "costco_queue1"
    }`

    useInterval(async () => {
        try {
            const response = await fetch(`http://localhost:8080/api?query=${query}&variables=${variables}`)
            await response.json().then(
                data => {
                    data = data.data.queue
                    const stats: SetStateAction<any> = Object.fromEntries([
                        "num_enqueued",
                        "num_serviced",
                        "num_deferred",
                        "average_wait_time",
                        "num_abandoned",
                        "num_noshows"]
                            .filter(key => key in data)
                            .map(key => [key, data[key]]))
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



