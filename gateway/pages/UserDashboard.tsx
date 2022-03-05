import React, {useEffect, useState} from 'react'
import {useIsFocused, useNavigation, useRoute, useFocusEffect} from "@react-navigation/native";
import {HomeScreenProps, UserInfo} from "../types";
import {StyleSheet, BackHandler} from 'react-native'
import {Avatar, Center, Heading, HStack, Image, Text, useToast} from "native-base";

import UserDashboardGroup from "../components/organisms/UserDashboardStats";
import UserDashboardMenu from "../containers/UserDashboardMenu"
import useInterval, {interval} from "../utilities/useInterval";
import {useTranslation} from "react-i18next";
import RightHeaderGroup from "../components/molecules/RightHeaderGroup";
import VerifySMSModal from "../containers/VerifySMSModal";
import {scale} from "../utilities/scales";
import calculateTimeToNow from "../utilities/calculateTimeToNow";
import baseURL from "../utilities/baseURL";
import corsURL from "../utilities/corsURL";
import secondsToTime from "../utilities/secondsToTime";
import LeaveQueueAlert from "../containers/LeaveQueueAlert";


export default function () {
    const { t } = useTranslation(["userDashboard"]);
    const route = useRoute<HomeScreenProps["route"]>()
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const [errors, setErrors] = useState<any>([]);
    const [showModal, setShowModal] = useState<boolean>(false)
    const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false)
    // Render the header (dark mode toggle and language picker)
    useEffect(() => navigation.setOptions({headerRight: RightHeaderGroup()}), [])
    const toast = useToast()
    const toastId = "errorToast"

    useEffect(() => {
        if (!!errors.length) {
            if (!toast.isActive(toastId)) {
                toast.show({
                    id: toastId,
                    title: t('something_went_wrong', {ns: "common"}),
                    status: "error",
                    description: t("cannot_fetch_user_data"),
                    duration: 10
                })
            }
        }
    }, [errors])  // Render alert if errors

    const defaultProps: UserInfo = {
        user_name: route.params!["name"],
        queue_name: "Someone",
        phone_number: route.params!["phoneNumber"],
        join_time: "",
        status: "UNVERIFIED",
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
                    status
                    estimated_wait
                    join_time
                    summoned
                    queue {
                        name
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
            fetch(baseURL(),
                 {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                          'Access-Control-Allow-Origin': corsURL(),
                      },
                      credentials: 'include',
                      body: JSON.stringify({query: query})
            }).then(response => response.json()).then(data => {
                    if (!!data.errors?.length) {
                        // Check for errors on response
                        setErrors([...errors, data.errors])
                        setShowModal(true)
                    } else if (data.data.getUser.error === "USER_DOES_NOT_EXIST"){
                        // Check if user exists on backend
                        setErrors([...errors, data.data.getUser.error])
                        // Try letting the user confirm via SMS
                        setShowModal(true)
                    } else {
                        const userData = data.data.getUser
                        const queueData = data.data.getUser.queue
                        // If user status is unverified, show SMS verification modal
                        if (userData.status === "UNVERIFIED") {
                            console.log("USER IS UNVERIFIED")
                            setShowModal(true)
                        }
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
                        // Convert average wait and estimated wait from seconds to hh/mm/ss
                        const estimated_wait = secondsToTime(userData.estimated_wait)
                        const average_wait = secondsToTime(queueData.average_wait)
                        // Set user data to be displayed and passed to subcomponents
                        setProps({
                            "user_name": userData.name,
                            "queue_name": queueData.name,
                            "phone_number": userData.phone_number,
                            "join_time": userData.join_time,
                            "status": userData.status,
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
                                    "stat": average_wait,
                                    "suffix": "m",
                                    "tooltip": t("average_tooltip")
                                },
                                {
                                    "prefix": t("eta_prefix"),
                                    "stat": estimated_wait,
                                    "suffix": "m",
                                    "tooltip": t("eta_tooltip")
                                }]
                        })
                    }
                }
            )
        } catch(error) {
            console.log("User Dashboard Error");
            console.log(error);
            setErrors([...errors, error])
        }
    }

    // Run on first render or when modal is opened or closed
    useEffect(() => {fetchUserStats().then(null)}, [showModal])
    // Poll only if user is currently on this screen
    useInterval(fetchUserStats, useIsFocused() && !isAlertOpen ? interval : null)

    React.useEffect(
        // Use effect to prevent going back without logging out
        () =>
            navigation.addListener('beforeRemove', (e) => {
                // Prevent default behavior of leaving the screen
                e.preventDefault();

                // Prompt the user before leaving the screen
                setIsAlertOpen(true)
            }),
        [navigation]
    )


    return (
        <Center>
            <Heading style={styles.headingFormat}>{props.queue_name}</Heading>
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
            <Text style={styles.welcomeFormat}>{`Hello ${props.user_name}!`}</Text>
            <Text style={styles.textFormat}>{t("status_text")}</Text>
            <Center>
                <UserDashboardGroup {...props.stats}/>
            </Center>
            <UserDashboardMenu />
            <LeaveQueueAlert isAlertOpen={isAlertOpen} setIsAlertOpen={setIsAlertOpen}/>
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
        width: scale(500),
        height: scale(100),
        borderRadius: 10,
    },
    headingFormat: {
        marginTop: scale(25),
        marginBottom: scale(25),
    },
    textFormat: {
        marginTop: scale(25),
        marginBottom: scale(25),
    },
    welcomeFormat: {
        fontSize: scale(16),
        marginTop: scale(25),
        marginBottom: scale(25),
    },
})
