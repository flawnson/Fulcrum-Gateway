import React, {SetStateAction, useContext, useEffect, useState} from 'react'
import {useIsFocused, useNavigation} from "@react-navigation/native";
import {HomeScreenProps, UserInfo} from "../types";
import {StyleSheet} from 'react-native'
import {Avatar, Center, Heading, HStack, Image, Text} from "native-base";

import UserDashboardGroup from "../components/organisms/UserDashboardStats";
import UserDashboardMenu from "../containers/UserDashboardMenu"
import useInterval from "../utilities/useInterval";
import {useTranslation} from "react-i18next";
import RightHeaderGroup from "../components/molecules/RightHeaderGroup";
import VerifySMSModal from "../containers/VerifySMSModal";
import {scale} from "../utilities/scales";
import calculateTimeToNow from "../utilities/calculateTimeToNow";
import GeneralErrorAlert from "../components/atoms/GeneralErrorAlert";


export default function () {
    const { t } = useTranslation(["userDashboard"]);
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const [errors, setError] = useState<any>([]);
    const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false)
    const [showModal, setShowModal] = useState<boolean>(true)  // If params are defined, no need to verify SMS
    // Render the header (dark mode toggle and language picker)
    useEffect(() => navigation.setOptions({headerRight: RightHeaderGroup()}), [])
    useEffect(() => {if (!!errors.length) {setShowErrorAlert(true)}}, [errors])  // Render alert if errors

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
    // State kept separate from general props because it is only needed at the page level and in this file
    const [state, setState] = useState("ACTIVE")

    const query = `
        query get_user_stats {
            getUser {
                ... on User {
                    id
                    phone_number
                    name
                    index
                    estimated_wait
                    join_time
                    summoned
                    queue {
                        state
                        average_wait
                    }
                }
                ... on Error {
                    error
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
                    if (!!data.errors.length) {
                        // Check for errors on response
                        setError(data.errors[0])
                    } else {
                        const userData = data.data.getUser
                        const queueData = data.data.getUser.queue
                        // If summoned is toggled true, immediately navigate to Summon Screen
                        if (userData.summoned) {
                            navigation.navigate("SummonScreen", {queueId: queueData.id, userId: userData.id})
                        }
                        // Set the queue state
                        setState(queueData.state)
                        // Calculate join time and get the minutes
                        userData.waited = calculateTimeToNow(userData.join_time).m
                        // Get the last digit to determine the index suffix
                        const terminalDigit = parseInt(userData.index.toString().charAt(userData.index.toString().length - 1))
                        const suffix = userData.index === 1 ? "st"
                            : userData.index === 11 ? "th"
                                : terminalDigit === 1 ? "st"
                                    : terminalDigit === 2 ? "nd"
                                        : terminalDigit === 3 ? "rd"
                                            : "th"
                        // Set user data to be displayed and passed to subcomponents
                        setProps({
                            "name": userData.name,
                            "phone_number": userData.phone_number,
                            "join_time": userData.join_time,
                            "stats": [{
                                "prefix": t("index_prefix"),
                                "stat": userData.index,
                                "suffix": suffix,
                                "tooltip": t("index_tooltip")
                            },
                                {
                                    "prefix": t("waited_prefix"),
                                    "stat": userData.waited,
                                    "suffix": "m",
                                    "tooltip": t("waited_tooltip")
                                },
                                {
                                    "prefix": t("average_prefix"),
                                    "stat": queueData.average_wait,
                                    "suffix": "m",
                                    "tooltip": t("average_tooltip")
                                },
                                {
                                    "prefix": t("eta_prefix"),
                                    "stat": userData.estimated_wait,
                                    "suffix": "m",
                                    "tooltip": t("eta_tooltip")
                                }]
                        })
                    }
                }
            )
        } catch(error) {
            setError([...errors, error])
        }
    }

    // Run on first render
    useEffect(() => {fetchUserStats().then(null)}, [])
    // Poll only if user is currently on this screen
    useInterval(fetchUserStats, useIsFocused() ? 5000 : null)

    return (
        <Center style={styles.animationFormat}>
            <GeneralErrorAlert
                showAlert={showErrorAlert}
                setShowAlert={setShowErrorAlert}
                message={t(!errors.length ? "cannot_fetch_user_data" : errors[0])} // Render default message
            />
            <Heading style={styles.headingFormat}>{props.name}'s Queue</Heading>
            <HStack style={styles.container}>
                <Image
                    source={require('../assets/images/queueup.gif')}
                    alt={"Loading..."}
                    style={styles.animation}
                />
                <Avatar
                    style={styles.avatar}
                    source={require('../assets/images/store_004.jpg')}
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
        alignItems: 'baseline',
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
        width: scale(200),
        height: scale(60),
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
