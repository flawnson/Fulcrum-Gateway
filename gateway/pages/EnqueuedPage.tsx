import React, { SetStateAction, useEffect, useState } from "react";
import EnqueuedCatalogCardGroup from "../components/molecules/UserCatalogCardGroup";
import useInterval from "../utilities/useInterval";
import {HomeScreenProps, UserStats} from "../types";
import { useIsFocused, useRoute } from "@react-navigation/native";


export default function () {
    const [props, setProps] = useState<UserStats[]>([])
    const route = useRoute<HomeScreenProps["route"]>()

    const query = `
        query get_users($queueId: String, $orderBy: [UserOrderByWithRelationInput!]) {
            getQueue(queueId: $queueId) {
                users(orderBy: $orderBy) {
                    userId: id
                    name
                    index
                    lastOnline: last_online
                    joinTime: join_time
                    status
                }
            }
        }
    `
    //@ts-ignore
    const variables = route.params ? {"queueId": route.params?.queueId, "orderBy": {"index": "asc"}}
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
            console.log(error)
        }
    }

    // Run on first render
    useEffect(() => {fetchUserData().then(null)}, [])
    // Poll only if user is currently on this screen
    useInterval(fetchUserData, useIsFocused() ? 5000 : null)

    return (
        <EnqueuedCatalogCardGroup entities={props} setEntities={setProps}/>
    )
}
