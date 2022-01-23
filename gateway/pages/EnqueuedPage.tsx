import React, { SetStateAction, useEffect, useState } from "react";
import EnqueuedCatalogCardGroup from "../components/molecules/EnqueuedCatalogCardGroup";
import useInterval from "../utilities/useInterval";
import { EnqueuedStats, HomeScreenProps } from "../../types";
import { useIsFocused, useRoute } from "@react-navigation/native";


export default function () {
    const [props, setProps] = useState<EnqueuedStats[]>([])
    const route = useRoute<HomeScreenProps["route"]>()

    const query = `
        query get_users($queueId: String, $orderBy: [UserOrderByWithRelationInput!]) {
            getQueue(queueId: $queueId) {
                users(orderBy: $orderBy) {
                    userId: id
                    name
                    index
                    last_online
                    join_time
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
                    data = data.filter((d: EnqueuedStats) => d.status === "ENQUEUED" || d.status === "DEFERRED")
                    let user_stats: EnqueuedStats[] = []
                    data.forEach((queue_data: {[key: string]: any}) => {
                        const now: any = new Date()
                        const join: any = new Date(queue_data.join_time)
                        const waited = new Date(Math.abs(now - join))
                        queue_data.waited = `${Math.floor(waited.getMinutes())}`
                        queue_data.online = new Date(queue_data.last_online) === new Date()
                        const stats: SetStateAction<any> = Object.fromEntries(
                            ["userId", "name", "index", "waited", "online", "status"]
                            .filter(key => key in queue_data)
                            .map(key => [key, queue_data[key]]))
                        user_stats.push(stats)
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