import React, { useEffect, useState } from "react";
import {ScrollView} from "native-base";
import useInterval from "../utilities/useInterval";
import {HomeScreenProps, UserStats} from "../types";
import {useIsFocused, useRoute} from "@react-navigation/native";
import UserCatalogCardGroup from "../components/molecules/UserCatalogCardGroup";
import GeneralErrorAlert from "../components/atoms/GeneralErrorAlert";
import {useTranslation} from "react-i18next";
import baseURL from "../utilities/baseURL";


export default function () {
    const { t } = useTranslation("servicedPage")
    const [props, setProps] = useState<UserStats[]>([])
    const [errors, setError] = useState<any>([]);
    const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false)
    const route = useRoute<HomeScreenProps["route"]>()
    useEffect(() => {if (!!errors.length) {setShowErrorAlert(true)}}, [errors])  // Render alert if errors

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
                        'Access-Control-Allow-Origin': 'http://localhost:19006/',
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
    useInterval(fetchServicedData, useIsFocused() ? 5000 : null)

    return (
        <>
            <GeneralErrorAlert
                showAlert={showErrorAlert}
                setShowAlert={setShowErrorAlert}
                message={t(!errors.length ? "cannot_fetch_serviced_message" : errors[0])} // Render default message
            />
            <ScrollView>
                <UserCatalogCardGroup entities={props} setEntities={setProps}/>
            </ScrollView>
        </>
    )
}
