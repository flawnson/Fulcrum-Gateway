import React, {SetStateAction, useState} from 'react'
import {useNavigation} from "@react-navigation/native";
import {HomeScreenProps} from "../../types";
import {StyleSheet} from 'react-native'
import {Center, Heading, Image, Text} from "native-base";
import QueuerDashboardGroup from "../components/organisms/QueuerDashboardStats";
import QueuerDashboardMenu from "../containers/QueuerDashboardMenu"
import useInterval from "../utilities/useInterval";


export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const tempProps = {
        index: 3,
        eta: 15,
        waited: 5,
        avg: 10,
    }
    const [props, setProps] = useState(tempProps)

    const query = `
        query get_user($user_id: ID!){
            user(user_id: $user_id) {
                id
                name
                queue_id
                index
                estimated_wait
                average_wait
                join_time
            }   
        }
    `
    const variables = `{
        "user_id": "user0"
    }`

    useInterval(async () => {
        try {
            const response = await fetch(`http://localhost:8080/api?query=${query}&variables=${variables}`)
            await response.json().then(
                data => {
                    data = data.data.user
                    console.log(data)
                    const now: any = new Date()
                    const join: any = new Date(data.join_time)
                    const waited = new Date(Math.abs(now - join))
                    data.waited = `${Math.floor(waited.getMinutes())}`
                    const stats: SetStateAction<any> = Object.fromEntries([
                        "index",
                        "waited",
                        "average_wait",
                        "estimated_wait"]
                        .filter(key => key in data)
                        .map(key => [key, data[key]]))
                    setProps(stats)
                }
            )
        } catch(error) {
            console.log(error)
        }
    }, 1000)

    return (
        <Center style={styles.animationFormat}>
            <Heading style={styles.headingFormat}>Someone's Queue</Heading>
            <Image
                source={require('../assets/images/queueup.gif')}
                alt={"Loading..."}
                style={styles.animation}
            />
            <Text style={styles.textFormat}>Almost there!</Text>
            <Center>
                <QueuerDashboardGroup queuerDashboardProps={props}/>
            </Center>
            <QueuerDashboardMenu />
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



