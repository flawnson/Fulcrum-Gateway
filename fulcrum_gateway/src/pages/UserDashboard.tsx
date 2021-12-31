import React, {SetStateAction, useEffect, useState} from 'react'
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { HomeScreenProps } from "../../types";
import { StyleSheet } from 'react-native'
import { Avatar, HStack,
        Center, Heading,
        Image, Text } from "native-base";
import UserDashboardGroup from "../components/organisms/UserDashboardStats";
import UserDashboardMenu from "../containers/UserDashboardMenu"
import useInterval from "../utilities/useInterval";
import { uniqueId } from "lodash"
import { useTranslation } from "react-i18next";
import DarkModeToggle from "../components/atoms/DarkModeToggle";


export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const { t, i18n } = useTranslation(["userDashboard"]);
    navigation.setOptions({headerRight: DarkModeToggle()})

    const defaultProps = {
        name: "Someone",
        stats: [
                {prefix: t("index_prefix"), stat: 0, suffix: ""},
                {prefix: t("waited_prefix"), stat: 0, suffix: "m"},
                {prefix: t("average_prefix"), stat: 0, suffix: "m"},
                {prefix: t("eta_prefix"), stat: 0, suffix: "m"}
            ],
        }
    const [props, setProps] = useState(defaultProps)
    const [state, setState] = useState("ACTIVE")

    const query = `
        query get_stats($userId: UserWhereUniqueInput! $queueId: QueueWhereUniqueInput!) {
            queue(where: $queueId) {
                state
            }
            user(where: $userId) {
                userId: id
                name
                index
                estimated_wait
                join_time
                status
            }
        }
    `
    const variables = `{
    "userId": {
            "id": "user1"
        },
    "queueId": {
            "id": "costco_queue2"
        }
    }`

    const fetchUserStats = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api?query=${query}&variables=${variables}`)
            await response.json().then(
                data => {
                    data = data.data.user
                    setState(data.data.queue.state)
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
                                   : "th"
                    setProps({"name": info.name,
                                    "stats": [{"prefix": t("index_prefix"), "stat": info.index, "suffix": suffix},
                                              {"prefix": t("waited_prefix"), "stat": info.waited, "suffix": "m"},
                                              {"prefix": t("average_prefix"), "stat": info.average_wait, "suffix": "m"},
                                              {"prefix": t("eta_prefix"), "stat": info.estimated_wait, "suffix": "m"}]})
                }
            )
        } catch(error) {
            console.log(error)
        }
    }

    // Run on first render
    useEffect(() => {fetchUserStats()}, [])
    // Poll only if user is currently on this screen
    if (useIsFocused()) {useInterval(fetchUserStats, 5000)}

    return (
        <Center style={styles.animationFormat}>
            <Heading style={styles.headingFormat}>{props.name}'s Queue</Heading>
            <HStack space={3} style={styles.container}>
                <Image
                    source={require('../assets/images/queueup.gif')}
                    alt={"Loading..."}
                    style={styles.animation}
                />
                <Avatar style={styles.avatar} size='xl' source={{uri: `https://avatars.dicebear.com/api/jdenticon/${uniqueId()}.svg?mood[]=happy`}}>
                    <Avatar.Badge bg={state === "ACTIVE" ? "green.500" : "red.500"}/>
                </Avatar>
            </HStack>
            <Text style={styles.textFormat}>{t("status_text")}</Text>
            <Center>
                <UserDashboardGroup {...props.stats}/>
            </Center>
            <UserDashboardMenu />
        </Center>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    animation: {
        flex: 1,
        marginTop: 25,
        marginBottom: 25,
        width: 309,
        height: 93,
    },
    avatar: {
        flex: 1,
        borderRadius: 10,
    },
    animationFormat: {
        position: 'relative',
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



