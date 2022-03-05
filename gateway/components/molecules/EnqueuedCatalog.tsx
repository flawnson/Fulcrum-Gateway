import React, { useEffect, useState } from "react";
import EnqueuedCatalogCardGroup from "./UserCatalogCardGroup";
import useInterval, {interval} from "../../utilities/useInterval";
import {HomeScreenProps, UserStats} from "../../types";
import { useRoute } from "@react-navigation/native";
import {ScrollView, useToast} from "native-base";
import {useTranslation} from "react-i18next";
import baseURL from "../../utilities/baseURL";
import corsURL from "../../utilities/corsURL";
import {scale} from "../../utilities/scales";
import useDimensions from "../../utilities/useDimensions";


export default function (props: {isFocused: boolean}) {
    const { t } = useTranslation("enqueuedPage")
    const route = useRoute<HomeScreenProps["route"]>()
    const [state, setState] = useState<UserStats[]>([])
    const [errors, setErrors] = useState<any>([]);
    const {width, height} = useDimensions()
    // The callback is so that we can call the method that deletes the cards from the flatlist when delete confirmed
    const [showConfirmDeleteAlert, setShowConfirmDeleteAlert] = useState<any>({show: false, callback: () => {}})
    const toast = useToast()

    useEffect(() => {
        if (!!errors.length) {
            toast.show({
                title: t('something_went_wrong', {ns: "common"}),
                status: "error",
                description: t(!errors.length ? "cannot_fetch_enqueued_message" : errors[0])
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

    async function fetchEnqueuedData () {
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
                    if (!!data.errors?.length) {setErrors(data.errors[0])}  // Check for errors on response
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
                    setState(user_stats)
                }
            )
        } catch(error) {
            setErrors([...errors, error])
        }
    }

    // Run on first render and if a user is kicked
    useEffect(() => {fetchEnqueuedData().then()}, [showConfirmDeleteAlert])
    // Poll only if user is currently on this screen and if Alert isn't being shown
    useInterval(fetchEnqueuedData, props.isFocused && !showConfirmDeleteAlert ? interval : null)

    return (
        <ScrollView
            style={{
                maxWidth: scale(width / 2),
                height: scale(height / 3.5)
            }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
        >
            <EnqueuedCatalogCardGroup
                entities={state}
                setEntities={setState}
                showConfirmDeleteAlert={showConfirmDeleteAlert}
                setShowConfirmDeleteAlert={setShowConfirmDeleteAlert}
            />
        </ScrollView>
    )
}


