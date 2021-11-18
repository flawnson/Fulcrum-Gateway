import React, { useState } from 'react'
import {useNavigation} from "@react-navigation/native";
import {HomeScreenProps} from "../../types";
import {StyleSheet} from 'react-native'
import {Center, Heading, Text, Image} from "native-base";
import OrganizerDashboardGroup from "../components/organisms/OrganizerDashboardStats";
import OrganizerDashboardMenu from "../containers/OrganizerDashboardMenu"
import useInterval from "../utilities/useInterval";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


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

    useInterval(async () => {
        try {
            const response = await fetch('/organizer/ORGANIZERID/queues/QUEUEID/stats')
            setProps(await response.json())
        } catch(error) {
            console.log(error)
        }
    }, 5000)

    return (
        <Center style={styles.animationFormat}>
            <Heading style={styles.headingFormat}>Someone's Queue</Heading>
            <Center>
                <OrganizerDashboardGroup OrganizerDashboardProps={props}/>
            </Center>
            <OrganizerDashboardMenu />
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



