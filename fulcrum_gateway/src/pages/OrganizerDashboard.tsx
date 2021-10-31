import React, { useState } from 'react'
import {useNavigation} from "@react-navigation/native";
import {HomeScreenProps} from "../../types";
import {StyleSheet} from 'react-native'
import {Center, Heading, Text, Image} from "native-base";
import OrganizerDashboardGroup from "../components/organisms/OrganizerDashboardStats";
import OrganizerDashboardMenu from "../containers/OrganizerDashboardMenu"
import useInterval from "../api/useInterval";


export default function () {
    const navigation = useNavigation<HomeScreenProps>()
    const tempProps = {
        index: 3,
        eta: 15,
        waited: 5,
        avg: 10,
    }
    const [props, setProps] = useState(tempProps)

    useInterval(async () => {
        try {
            const response = await fetch('http://localhost:8080/organizer/stats')
            setProps(await response.json())
        } catch(error) {
            console.log(error)
        }
    }, 5000)

    return (
        <Center style={styles.animationFormat}>
            <Heading style={styles.headingFormat}>Someone's Queue</Heading>
            <Text style={styles.textFormat}>Almost there!</Text>
            <Center>
                <OrganizerDashboardGroup queuerDashboardProps={props}/>
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



