import React, { useEffect, useState } from "react";
import {ScrollView, useToast} from "native-base";
import useInterval, {interval} from "../../utilities/useInterval";
import {HomeScreenProps, UserStats} from "../../types";
import {useIsFocused, useRoute} from "@react-navigation/native";
import UserCatalogCardGroup from "./UserCatalogCardGroup";
import {useTranslation} from "react-i18next";
import baseURL from "../../utilities/baseURL";
import corsURL from "../../utilities/corsURL";
import {scale} from "../../utilities/scales";
import useDimensions from "../../utilities/useDimensions";


export default function () {
    const { t } = useTranslation("servicedPage")
    const route = useRoute<HomeScreenProps["route"]>()
    const [props, setProps] = useState<UserStats[]>([])
    const [errors, setError] = useState<any>([]);
    const {width, height} = useDimensions()
    const toast = useToast()

    useEffect(() => {
        if (!!errors.length) {
            toast.show({
                title: t('something_went_wrong', {ns: "common"}),
                status: "error",
                description: t(!errors.length ? "cannot_fetch_serviced_message" : errors[0])
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

    async function fetchServicedData () {
        try {
            const response = await fetch(baseURL(),
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': corsURL(),
                    },
                    credentials: 'include',
                    body: JSON.stringify({query: query, variables: variables})
                })
            await response.json().then(
                data => {
                    if (!!data.errors?.length) {setError(data.errors[0])}  // Check for errors on response
                    data = data.data.getQueue.users
                    data = data.filter((d: UserStats) => d.status === "SERVICED")
                    let servicedStats: UserStats[] = []
                    data.forEach((servicedData: UserStats) => {
                        const joinTime: any = new Date(servicedData.joinTime)
                        // Null assertion because finishTime does not exist for Enqueued users
                        const finishTime: any = new Date(servicedData.finishTime!)
                        const waited = new Date(Math.abs(finishTime - joinTime))
                        servicedData.waited = Math.floor(waited.getMinutes())
                        servicedData.finishTime = `${finishTime.getHours()}:${finishTime.getHours()}:${finishTime.getHours()}`
                        servicedStats.push(servicedData)
                    })
                    setProps(servicedStats)
                }
            )
        } catch(error) {
            setError([...errors, error])
        }
    }

    // Run on first render
    useEffect(() => {fetchServicedData().then(null)}, [])
    // Poll only if user is currently on this screen
    useInterval(fetchServicedData, useIsFocused() ? interval : null)

    return (
        <ScrollView
            style={{
                maxWidth: scale(width / 2),
                height: scale(height / 3.5)
            }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
        >
            <UserCatalogCardGroup entities={props} setEntities={setProps}/>
        </ScrollView>
    )
}
