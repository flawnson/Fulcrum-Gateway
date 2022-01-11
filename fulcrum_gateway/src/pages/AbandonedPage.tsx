import React, { SetStateAction, useEffect, useState } from "react";
import CatalogEntityCardGroup from "../components/molecules/AbandonedCatalogCardGroup";
import useInterval from "../utilities/useInterval";
import { AbandonedStats, EnqueuedStats } from "../../types";
import {useIsFocused} from "@react-navigation/native";

export default function () {
    const [props, setProps] = useState<AbandonedStats[]>([])

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
    const variables = `{
        "queueId": "costco_queue1",
        "orderBy":
            {
                "index": "asc"
            }
    }`

    async function fetchAbandonedData () {
        try {
            const response = await fetch(`http://localhost:8080/api`,
                                         {
                                          method: 'POST',
                                          headers: {
                                                 'Content-Type': 'application/json',
                                                 'Access-Control-Allow-Origin': 'http://localhost:19006/',
                                                   },
                                             credentials: 'include',
                                             body: JSON.stringify({query: query, variables: variables})})
            await response.json().then(
                data => {
                    data = data.data.getQueue.users
                    data = data.filter((d: AbandonedStats) => d.state === "ABANDONED" ||
                                                              d.state === "KICKED" ||
                                                              d.state === "NOSHOW")
                    let abandoned_stats: AbandonedStats[] = []
                    data.forEach((abandoned_data: any) => {
                        const now: any = new Date()
                        const join: any = new Date(abandoned_data.create_time)
                        const lifespan = new Date(Math.abs(now - join))
                        abandoned_data.lifespan = `${Math.floor(lifespan.getMinutes())}`
                        const stats: SetStateAction<any> = Object.fromEntries([
                            "id",
                            "name",
                            "state",
                            "lifespan"]
                            .filter(key => key in abandoned_data)
                            .map(key => [key, abandoned_data[key]]))
                        abandoned_stats.push(stats)
                    })
                    setProps(abandoned_stats)
                }
            )
        } catch(error) {
            console.log(error)
        }
    }

    // Run on first render
    useEffect(() => {fetchAbandonedData().then(null)}, [])
    // Poll only if user is currently on this screen
    useInterval(fetchAbandonedData, useIsFocused() ? 5000 : null)

    return (
        // Using active queues catalog cards because functionally matches
        <CatalogEntityCardGroup entities={props}/>
    )
}
