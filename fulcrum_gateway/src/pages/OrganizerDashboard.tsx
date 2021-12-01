import React, {SetStateAction, useState} from 'react'
import {useNavigation, useRoute} from "@react-navigation/native";
import {HomeScreenProps} from "../../types";
import {StyleSheet} from 'react-native'
import {Center, Heading, Text, Image} from "native-base";
import OrganizerDashboardGroup from "../components/organisms/OrganizerDashboardStats";
import OrganizerDashboardMenu from "../containers/OrganizerDashboardMenu"
import useInterval from "../utilities/useInterval";
import EditQueueModal from "../containers/EditQueueModal";


export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const route = useRoute<HomeScreenProps["route"]>();  // Don't need this but if I want to pass config or params...
    const [showModal, setShowModal] = useState(false);

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
            {/* Modal must be placed at the Dashboard level to show when menu button is tapped*/}
            <EditQueueModal showModal={showModal} setShowModal={setShowModal} route={route} navigation={navigation}/>
            <Heading style={styles.headingFormat}>Someone's Queue</Heading>
            <OrganizerDashboardGroup OrganizerDashboardProps={props}/>
            <OrganizerDashboardMenu showModal={showModal} setShowModal={setShowModal}/>
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



