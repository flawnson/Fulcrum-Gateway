import React, { SetStateAction, useEffect, useState } from "react";
import useInterval from "../utilities/useInterval";
import {AbandonedStats, EnqueuedStats, HomeScreenProps, UserStats} from "../types";
import {useIsFocused, useRoute} from "@react-navigation/native";
import UserCatalogCardGroup from "../components/molecules/UserCatalogCardGroup";


export default function () {
    const [props, setProps] = useState<UserStats[]>([])
    const route = useRoute<HomeScreenProps["route"]>()

    const query = `
        query get_users($queueId: String, $orderBy: [UserOrderByWithRelationInput!]) {
            getQueue(queueId: $queueId) {
                users(orderBy: $orderBy) {
                    userId: id
                    name
                    joinTime: join_time
                    renegedTime: reneged_time
                    status
                }
            }
        }
    `
    //@ts-ignore
    const variables = route.params ? {"queueId": route.params?.queueId, "orderBy": {"index": "asc"}}
                                   : {"queueId": "123456", "orderBy": {"index": "asc"}}

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
                    data = data.filter((d: UserStats) => d.status === "ABANDONED" ||
                                                              d.status === "KICKED" ||
                                                              d.status === "NOSHOW")
                    let abandonedStats: UserStats[] = []
                    data.forEach((abandonedData: UserStats) => {
                        const joinTime: any = new Date(abandonedData.joinTime)
                        // Null assertion because renegedTime does not exist for Enqueued users
                        const renegedTime: any = new Date(abandonedData.renegedTime!)
                        const waited = new Date(Math.abs(renegedTime - joinTime))
                        abandonedData.waited = Math.floor(waited.getMinutes())
                        abandonedData.renegedTime = `${renegedTime.getHours()}:${renegedTime.getHours()}:${renegedTime.getHours()}`
                        abandonedStats.push(abandonedData)
                    })
                    setProps(abandonedStats)
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
        <UserCatalogCardGroup entities={props} setEntities={setProps}/>
    )
}
