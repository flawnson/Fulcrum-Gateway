import React, { SetStateAction, useEffect, useState } from "react";
import EnqueuedCatalogCardGroup from "../components/molecules/EnqueuedCatalogCardGroup";
import useInterval from "../utilities/useInterval";
import { EnqueuedStats } from "../../types";
import { useIsFocused } from "@react-navigation/native";


export default function () {
    const [props, setProps] = useState<EnqueuedStats[]>([])

    const query = `
        query get_users($queueId: QueueWhereUniqueInput! $orderBy: [UserOrderByWithRelationInput!]) {
            getQueue(where: $queueId) {
                users(orderBy: $orderBy) {
                    userId: id
                    name
                    join_time
                    last_online
                    status
                }
            }
        }
    `
    const variables = `{
        "queueId":
            {
                "id": "costco_queue1"
            },
        "orderBy":
            {
                "index": "desc"
            }
    }`

    async function fetchUserData () {
        try {
            const response = await fetch(`http://localhost:8080/api`,
                                     {
                                         method: 'POST',
                                         headers: {
                                             'Content-Type': 'application/json'
                                         },
                                         body: JSON.stringify({query: query, variables: variables})})
            await response.json().then(
                data => {
                    data = data.data.queue.users
                    data = data.filter((d: EnqueuedStats) => d.status === "ENQUEUED" || d.status === "DEFERRED")
                    let user_stats: EnqueuedStats[] = []
                    data.forEach((queue_data: {[key: string]: any}) => {
                        const now: any = new Date()
                        const join: any = new Date(queue_data.join_time)
                        const waited = new Date(Math.abs(now - join))
                        queue_data.waited = `${Math.floor(waited.getMinutes())}`
                        queue_data.online = new Date(queue_data.last_online) === new Date()
                        const stats: SetStateAction<any> = Object.fromEntries([
                            "userId",
                            "name",
                            "index",
                            "waited",
                            "online",
                            "state"]
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
    useEffect(() => {fetchUserData()}, [])
    // Poll only if user is currently on this screen
    // if (useIsFocused()) {useInterval(fetchUserData, 5000)}
    useInterval(fetchUserData, 5000)

    return (
        <EnqueuedCatalogCardGroup entities={props}/>
    )
}
