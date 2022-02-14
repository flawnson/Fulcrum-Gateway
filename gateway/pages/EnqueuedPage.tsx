import React, { useEffect, useState } from "react";
import EnqueuedCatalogCardGroup from "../components/molecules/UserCatalogCardGroup";
import useInterval from "../utilities/useInterval";
import {HomeScreenProps, UserStats} from "../types";
import { useIsFocused, useRoute } from "@react-navigation/native";
import {ScrollView} from "native-base";
import GeneralErrorAlert from "../components/atoms/GeneralErrorAlert";
import {useTranslation} from "react-i18next";


export default function () {
    const { t } = useTranslation("enqueuedPage")
    const route = useRoute<HomeScreenProps["route"]>()
    const [props, setProps] = useState<UserStats[]>([])
    const [errors, setError] = useState<any>([]);
    const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false)
    // The callback is so that we can call the method that deletes the cards from the flatlist when delete confirmed
    const [showConfirmDeleteAlert, setShowConfirmDeleteAlert] = useState<any>({show: false, callback: () => {}})
    useEffect(() => {if (!errors.length) {setShowErrorAlert(true)}}, [errors])  // Render alert if errors

    const query = `
        query get_users($queueId: String, $orderBy: [UserOrderByWithRelationInput!]) {
            getQueue(queueId: $queueId) {
                ... on Queue {
                    state
                    users(orderBy: $orderBy) {
                      userId: id
                      name
                      index
                      lastOnline: last_online
                      joinTime: join_time
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

    async function fetchUserData () {
        try {
            const response = await fetch(`http://localhost:8080/api`,
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
                    if (!!data.errors.length) {setError(data.errors[0])}  // Check for errors on response
                    data = data.data.getQueue.users
                    data = data.filter((d: UserStats) => d.status === "ENQUEUED" || d.status === "DEFERRED")
                    const user_stats: UserStats[] = []
                    data.forEach((userData: UserStats) => {
                        // Must cast dates to any type to do arithmetic otherwise Typescript complains
                        const now: any = new Date()
                        const join: any = new Date(userData.joinTime)
                        const waited = new Date(Math.abs(now - join))
                        userData.waited = Math.floor(waited.getMinutes())
                        // Null assertion because lastOnline is not needed for Abandoned and Serviced users
                        const lastOnline: any = new Date(userData.lastOnline!)
                        // Milliseconds to minutes and check if less than 15 mins, convert to bool
                        userData.online = ((Math.abs(now - lastOnline)/1000)/60) <= 15
                        user_stats.push(userData)
                    })
                    setProps(user_stats)
                }
            )
        } catch(error) {
            setError([...errors, error])
        }
    }

    // Run on first render
    useEffect(() => {fetchUserData().then()}, [])
    // Poll only if user is currently on this screen and if Alert isn't being shown
    useInterval(fetchUserData, useIsFocused() && !showConfirmDeleteAlert ? 5000 : null)

    return (
        <>
            <GeneralErrorAlert
                showAlert={showErrorAlert}
                setShowAlert={setShowErrorAlert}
                message={t(!errors.length ? "cannot_fetch_serviced_message" : errors[0])} // Render default message
            />
            <ScrollView>
                <EnqueuedCatalogCardGroup
                    entities={props}
                    setEntities={setProps}
                    showConfirmDeleteAlert={showConfirmDeleteAlert}
                    setShowConfirmDeleteAlert={setShowConfirmDeleteAlert}
                />
            </ScrollView>
        </>
    )
}
