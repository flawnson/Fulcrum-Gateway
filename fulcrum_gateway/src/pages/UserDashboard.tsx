import React, { SetStateAction, useState } from 'react'
import { useNavigation } from "@react-navigation/native";
import { HomeScreenProps, DashboardStat } from "../../types";
import { StyleSheet } from 'react-native'
import { Center, Heading, Image, Text } from "native-base";
import UserDashboardGroup from "../components/organisms/UserDashboardStats";
import UserDashboardMenu from "../containers/UserDashboardMenu"
import useInterval from "../utilities/useInterval";


export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const defaultProps = {
        name: "Someone",
        stats: [
                {prefix: "You're", stat: 0, suffix: "n/a"},
                {prefix: "You've waited", stat: 0, suffix: "m"},
                {prefix: "Average wait", stat: 0, suffix: "m"},
                {prefix: "ETA", stat: 0, suffix: "m"}
            ],
        }
    const [props, setProps] = useState(defaultProps)

    const query = `
        query get_stats($user_id: UserWhereUniqueInput!) {
            user(where: $user_id) {
                userId: id
                name
                index
                estimated_wait
                join_time
                state
            }
        }
    `
    const variables = `{
    "user_id": {
            "id": "userID"
        }
    }`

    useInterval(async () => {
        try {
            const response = await fetch(`http://localhost:8080/api?query=${query}&variables=${variables}`)
            await response.json().then(
                data => {
                    data = data.data.user
                    const now: any = new Date()
                    const join: any = new Date(data.join_time)
                    const waited = new Date(Math.abs(now - join))
                    data.waited = `${Math.floor(waited.getMinutes())}`
                    const info: SetStateAction<any> = Object.fromEntries([
                        "name",
                        "index",
                        "waited",
                        "average_wait",
                        "estimated_wait"]
                        .filter(key => key in data)
                        .map(key => [key, data[key]]))
                    const terminalDigit = parseInt(info.index.toString().charAt(info.index.toString().length - 1))
                    const suffix = terminalDigit === 1 ? "st"
                                   : terminalDigit === 2 ? "nd"
                                   : terminalDigit === 3 ? "rd"
                                   : "st"
                    setProps({"name": info.name, "stats": [{"prefix": "You're", "stat": info.index, "suffix": suffix},
                                                                 {"prefix": "You've waited", "stat": info.waited, "suffix": "m"},
                                                                 {"prefix": "Average wait", "stat": info.average_wait, "suffix": "m"},
                                                                 {"prefix": "ETA", "stat": info.estimated_wait, "suffix": "m"}]})
                }
            )
        } catch(error) {
            console.log(error)
        }
    }, 5000)

    return (
        <Center style={styles.animationFormat}>
            <Heading style={styles.headingFormat}>{props.name}'s Queue</Heading>
            <Image
                source={require('../assets/images/queueup.gif')}
                alt={"Loading..."}
                style={styles.animation}
            />
            <Text style={styles.textFormat}>Almost there!</Text>
            <Center>
                <UserDashboardGroup {...props.stats}/>
            </Center>
            <UserDashboardMenu />
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



