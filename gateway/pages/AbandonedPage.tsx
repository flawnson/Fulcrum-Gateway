import React, { SetStateAction, useEffect, useState } from "react";
import useInterval from "../utilities/useInterval";
import {AbandonedStats, EnqueuedStats, HomeScreenProps, UserStatsTypes} from "../types";
import {useIsFocused, useRoute} from "@react-navigation/native";
import UserCatalogCardGroup from "../components/molecules/UserCatalogCardGroup";


export default function () {
    const [props, setProps] = useState<UserStatsTypes[]>([])
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
                    data = data.filter((d: AbandonedStats) => d.status === "ABANDONED" ||
                                                              d.status === "KICKED" ||
                                                              d.status === "NOSHOW")
                    let abandoned_stats: AbandonedStats[] = []
                    data.forEach((abandoned_data: any) => {
                        const now: any = new Date()
                        const join: any = new Date(abandoned_data.create_time)
                        const waited = new Date(Math.abs(now - join))
                        abandoned_data.waited = `${Math.floor(waited.getMinutes())}`
                        const stats: SetStateAction<any> = Object.fromEntries([
                            "userId",
                            "name",
                            "state",
                            "waited"]
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
        <UserCatalogCardGroup entities={props} setEntities={setProps}/>
    )
}
