import React, {SetStateAction, useContext, useEffect, useState} from 'react'
import {useIsFocused, useNavigation, useRoute} from "@react-navigation/native";
import { UserInfo, HomeScreenProps } from "../types";
import { StyleSheet } from 'react-native'
import { Avatar, HStack,
        Center, Heading,
        Image, Text } from "native-base";
import UserDashboardGroup from "../components/organisms/UserDashboardStats";
import UserDashboardMenu from "../containers/UserDashboardMenu"
import useInterval from "../utilities/useInterval";
import { uniqueId } from "lodash"
import { useTranslation } from "react-i18next";
import RightHeaderGroup from "../components/molecules/RightHeaderGroup";
import VerifySMSModal from "../containers/VerifySMSModal";
import { AuthContext } from "../App";
import { scale } from "../utilities/scales";
import calculateTimeToNow from "../utilities/calculateTimeToNow";


export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const { signedInAs } = useContext(AuthContext)
    const { t, i18n } = useTranslation(["userDashboard"]);
    const [showModal, setShowModal] = useState<boolean>(true)  // If params are defined, no need to verify SMS
    useEffect(() => navigation.setOptions({headerRight: RightHeaderGroup()}), [])

    const defaultProps: UserInfo = {
        name: "Someone",
        phone_number: "123456789",
        join_time: "",
        stats: [
                {prefix: t("index_prefix"), stat: 0, suffix: "th", tooltip: t("index_tooltip")},
                {prefix: t("waited_prefix"), stat: 0, suffix: "m", tooltip: t("waited_tooltip")},
                {prefix: t("average_prefix"), stat: 0, suffix: "m", tooltip: t("average_tooltip")},
                {prefix: t("eta_prefix"), stat: 0, suffix: "m", tooltip: t("eta_tooltip")}
            ],
        }
    const [props, setProps] = useState(defaultProps)
    const [state, setState] = useState("ACTIVE")

    const query = `
        query get_stats {
            getUser {
                userId: id
                phone_number
                name
                index
                estimated_wait
                join_time
                status
                summoned
                queue {
                    state
                    average_wait
                }
            }
        }
    `

    const fetchUserStats = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api`,
                                     {
                                          method: 'POST',
                                          headers: {
                                              'Content-Type': 'application/json',
                                              'Access-Control-Allow-Origin': 'http://localhost:19006/',
                                          },
                                          credentials: 'include',
                                          body: JSON.stringify({query: query})
                                     })
            await response.json().then(
                data => {
                    data = data.data.getUser
                    // If summoned is toggled true, navigate to Summon Screen
                    if (data.summoned) {navigation.navigate("SummonScreen")}
                    setState(data.queue.state)
                    data.waited = calculateTimeToNow(data.join_time).m
                    const info: SetStateAction<any> = Object.fromEntries([
                        "name",
                        "phone_number",
                        "index",
                        "join_time",
                        "average_wait",
                        "estimated_wait"]
                        .filter(key => key in data)
                        .map(key => [key, data[key]]))
                    const terminalDigit = parseInt(info.index.toString().charAt(info.index.toString().length - 1))
                    const suffix = info.index === 1 ? "st"
                                   : info.index === 11 ? "th"
                                   : terminalDigit === 1 ? "st"
                                   : terminalDigit === 2 ? "nd"
                                   : terminalDigit === 3 ? "rd"
                                   : "th"
                    setProps({"name": info.name,
                                    "phone_number": info.phone_number,
                                    "join_time": info.join_time,
                                    "stats": [{"prefix": t("index_prefix"),
                                               "stat": info.index,
                                               "suffix": suffix,
                                               "tooltip": t("index_tooltip")},
                                              {"prefix": t("waited_prefix"),
                                               "stat": data.waited,
                                               "suffix": "m",
                                               "tooltip": t("waited_tooltip")},
                                              {"prefix": t("average_prefix"),
                                               "stat": data.queue.average_wait,
                                               "suffix": "m",
                                               "tooltip": t("average_tooltip")},
                                              {"prefix": t("eta_prefix"),
                                               "stat": info.estimated_wait,
                                               "suffix": "m",
                                               "tooltip": t("eta_tooltip")}]})
                }
            )
        } catch(error) {
            console.log(error)
        }
    }

    // Run on first render
    useEffect(() => {fetchUserStats().then(null)}, [])
    // Poll only if user is currently on this screen
    useInterval(fetchUserStats, useIsFocused() ? 5000 : null)

    return (
        <Center style={styles.animationFormat}>
            <Heading style={styles.headingFormat}>{props.name}'s Queue</Heading>
            <HStack style={styles.container}>
                <Image
                    source={require('../assets/images/queueup.gif')}
                    alt={"Loading..."}
                    style={styles.animation}
                />
                <Avatar
                    style={styles.avatar}
                    size='xl'
                    source={require('../assets/images/queueup.gif')}
                    // source={{uri: `https://avatars.dicebear.com/api/jdenticon/${uniqueId()}.svg?mood[]=happy`}}
                >
                    <Avatar.Badge bg={state === "ACTIVE" ? "green.500" : "red.500"}/>
                </Avatar>
            </HStack>
            <Text style={styles.textFormat}>{t("status_text")}</Text>
            <Center>
                <UserDashboardGroup {...props.stats}/>
            </Center>
            <UserDashboardMenu />
            <VerifySMSModal userInfo={props} showModal={showModal} setShowModal={setShowModal}/>
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
        marginY: scale(25),
        width: scale(200),
        height: scale(60),
    },
    avatar: {
        flex: 1,
        borderRadius: 10,
    },
    animationFormat: {
        // position: 'relative',
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



