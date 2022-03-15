import React, {SetStateAction, useEffect, useRef, useState} from 'react'
import {useIsFocused, useNavigation, useRoute} from "@react-navigation/native"
import {DashboardStat, HomeScreenProps, QueueState} from "../types"
import {AppState, StyleSheet} from 'react-native'
import {
    Text, Center,
    Heading, HStack, useToast
} from "native-base"
import QueueDashboardGroup from "../components/organisms/QueueDashboardStats"
import QueueDashboardMenu from "../containers/QueueDashboardMenu"
import useInterval, {interval} from "../utilities/useInterval"
import {zipObject} from "lodash"
import {useTranslation} from "react-i18next"
import baseURL from "../utilities/baseURL"
import corsURL from "../utilities/corsURL";
import {DashboardContext} from "../utilities/DashboardContext";
import UserCatalogGroup from "../components/organisms/UserCatalogGroup";

type UserData = {
    user_id: string,
    join_time: Date,
    status: string,
}

type QueueDashboardStats = {
    name: string,
    state: QueueState,
    stats: DashboardStat[],
}


export default function () {
    const { t } = useTranslation(["queueDashboard"]);
    const route = useRoute<HomeScreenProps["route"]>()
    const [errors, setError] = useState<any>([]);
    const [dashboardContext, setDashboardContext] = useState<string>("ENQUEUED");
    const toast = useToast()
    const toastId = "errorToast"

    useEffect(() => {
        if (!!errors.length) {
            if (!toast.isActive(toastId)) {
                toast.show({
                    id: toastId,
                    title: t('something_went_wrong', {ns: "common"}),
                    status: "error",
                    description: t("cannot_enqueue_message"),
                    duration: 10
                })
            }
        }
    }, [errors])  // Render alert if errors

    const defaultProps = {
        name: "Some Queue",
        state: "ACTIVE" as QueueState,
        stats: [
            {prefix: t("enqueued_prefix"), stat: 0, suffix: "", tooltip: null},
            {prefix: t("serviced_prefix"), stat: 0, suffix: "", tooltip: null},
            {prefix: t("average_prefix"), stat: 0, suffix: "m", tooltip: null},
            {prefix: t("abandoned_prefix"), stat: 0, suffix: "", tooltip: null},
        ],
    }
    const [props, setProps] = useState<QueueDashboardStats>(defaultProps)

    // Two queries are needed depending on what type of user you are
    const assistantQuery = `
        query get_queue_stats {
            getQueue {
                ... on Queue {
                    name
                    state
                    users {
                        user_id: id
                        join_time
                        status
                    }
                }
                ... on Error {
                    error
                }
            }
        }
    `
    // Organizers must provide a queueId because they have access to all queues
    const organizerQuery = `
        query get_queue_stats ($queueId: String){
            getQueue(queueId: $queueId) {
                ... on Queue {
                    name
                    state
                    users {
                        user_id: id
                        join_time
                        status
                    }
                }
                ... on Error {
                    error
                }
            }
        }
    `
    // @ts-ignore
    const body = route.params ? {query: organizerQuery, variables: {"queueId": route.params?.queueId}} : {query: assistantQuery}

    async function fetchQueueData () {
        try {
            const response = await fetch(baseURL(), {
                                         method: 'POST',
                                         headers: {
                                             'Content-Type': 'application/json',
                                             'Access-Control-Allow-Origin': corsURL(),
                                         },
                                         credentials: 'include',
                                         body: JSON.stringify(body)
                                         })
            await response.json().then(
                data => {
                    const queueData = data.data.getQueue
                    data = data.data.getQueue.users
                    // Count the number users with of each type of status
                    const statuses = ["ENQUEUED", "SERVICED", "DEFERRED", "ABANDONED", "NOSHOW"]
                    const counts = []
                    for (const status of statuses) {
                        counts.push(data.filter((user: UserData) => {return user.status === status}).length)
                    }
                    let stats: SetStateAction<DashboardStat[] | any> = zipObject(statuses.map(status => status.toLowerCase()), counts)
                    // Calculate the average of all user waits thus far
                    const now: any = new Date()
                    let userWaits: Array<number> = []
                    for (const user of data) {
                        const join: any = new Date(user.join_time)
                        const waited = new Date(Math.abs(now - join)).getMinutes()
                        const minutes = Math.floor(waited)
                        userWaits.push(minutes)
                    }
                    stats.avg = Math.floor(userWaits.reduce((a,b) => a + b, 0) / userWaits.length)
                    // Set queue data to be displayed and passed to subcomponents
                    setProps({"name": queueData.name,
                                    "state": queueData.state,
                                    "stats": [{prefix: t("enqueued_prefix"),
                                               stat: stats.enqueued + stats.deferred,
                                               suffix: "",
                                               tooltip: null},
                                              {prefix: t("average_prefix"),
                                               stat: stats.avg,
                                               suffix: "m",
                                               tooltip: null},
                                              {prefix: t("serviced_prefix"),
                                               stat: stats.serviced,
                                               suffix: "",
                                               tooltip: null},
                                              {prefix: t("abandoned_prefix"),
                                               stat: stats.abandoned + stats.noshow,
                                               suffix: "",
                                               tooltip: null},]})
                }
            )
        } catch(error) {
            setError([...errors, error])
        }
    }

    // Run on first render and when the dashboardContext changes (to show the corresponding catalog list)
    useEffect(() => {fetchQueueData().then()}, [dashboardContext])
    // Poll only if user is currently on this screen
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    useEffect(() => {
        AppState.addEventListener("change", nextAppState => {
            appState.current = nextAppState;
            setAppStateVisible(appState.current);
        });
    }, []);
    useInterval(fetchQueueData, useIsFocused() && appStateVisible ? interval : null)

    return (
        <DashboardContext.Provider value={{dashboardContext, setDashboardContext}}>
            <Center style={styles.container}>
                <HStack space={3} alignItems="center">
                    <Text>{props.state === "ACTIVE" ? "🟢" : "🔴"}</Text>
                    <Heading style={styles.headingFormat}>{props.name}</Heading>
                </HStack>
                <QueueDashboardGroup {...props.stats}/>
                <UserCatalogGroup isFocused={useIsFocused()}/>
                <QueueDashboardMenu queueState={props.state}/>
            </Center>
        </DashboardContext.Provider>
    )
}

const styles = StyleSheet.create({
    container: {
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
