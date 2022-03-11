import React, { useEffect, useState } from "react";
import useInterval, {interval} from "../../utilities/useInterval";
import {HomeScreenProps, UserStats} from "../../types";
import { useRoute} from "@react-navigation/native";
import UserCatalogCardGroup from "./UserCatalogCardGroup";
import {ScrollView, useToast} from "native-base";
import {useTranslation} from "react-i18next";
import baseURL from "../../utilities/baseURL";
import corsURL from "../../utilities/corsURL";


export default function (props: {isFocused: boolean}) {
    const { t } = useTranslation("abandonedPage")
    const route = useRoute<HomeScreenProps["route"]>()
    const [errors, setError] = useState<any>([]);
    const [state, setState] = useState<UserStats[]>([])
    const toast = useToast()

    useEffect(() => {
        if (!!errors.length) {
            toast.show({
                title: t('something_went_wrong', {ns: "common"}),
                status: "error",
                description: t(!errors.length ? "cannot_fetch_abandoned_message" : errors[0])
            })
        }
    }, [errors])  // Render alert if errors

    const query = `
        query get_users($queueId: String, $orderBy: [UserOrderByWithRelationInput!]) {
            getQueue(queueId: $queueId) {
                ... on Queue {
                    state
                    users(orderBy: $orderBy) {
                        userId: id
                        name
                        joinTime: join_time
                        finishTime: finish_time
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
    const variables = route.params ? {"queueId": route.params!["queueId"], "orderBy": {"index": "asc"}}
                                   : {"queueId": "123456", "orderBy": {"index": "asc"}}

    async function fetchAbandonedData () {
        try {
            fetch(baseURL(),
                 {
                  method: 'POST',
                  headers: {
                         'Content-Type': 'application/json',
                         'Access-Control-Allow-Origin': corsURL(),
                           },
                  credentials: 'include',
                  body: JSON.stringify({query: query, variables: variables})
            }).then(response => response.json()).then(data => {
                if (!!data.errors?.length) {setError(data.errors[0])}  // Check for errors on response
                    data = data.data.getQueue.users
                    data = data.filter((d: UserStats) => d.status === "ABANDONED" ||
                                                              d.status === "KICKED" ||
                                                              d.status === "NOSHOW")
                    let abandonedStats: UserStats[] = []
                    data.forEach((abandonedData: UserStats) => {
                        const joinTime: any = new Date(abandonedData.joinTime)
                        // Null assertion because finishTime does not exist for Enqueued users
                        const finishTime: any = new Date(abandonedData.finishTime!)
                        const waited = new Date(Math.abs(finishTime - joinTime))
                        abandonedData.waited = Math.floor(waited.getMinutes())
                        abandonedData.finishTime = `${finishTime.getHours()}:${finishTime.getHours()}:${finishTime.getHours()}`
                        abandonedStats.push(abandonedData)
                    })
                    setState(abandonedStats)
                }
            )
        } catch(error) {
            setError([...errors, error])
        }
    }

    // Run on first render
    useEffect(() => {fetchAbandonedData().then(null)}, [])
    // Poll only if user is currently on this screen
    useInterval(fetchAbandonedData, props.isFocused ? interval : null)

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
        >
            <UserCatalogCardGroup entities={state} setEntities={setState}/>
        </ScrollView>
    )
}
