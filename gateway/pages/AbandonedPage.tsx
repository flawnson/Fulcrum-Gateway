import React, { useEffect, useState } from "react";
import useInterval from "../utilities/useInterval";
import {HomeScreenProps, UserStats} from "../types";
import {useIsFocused, useRoute} from "@react-navigation/native";
import UserCatalogCardGroup from "../components/molecules/UserCatalogCardGroup";
import {ScrollView} from "native-base";


export default function () {
    const [props, setProps] = useState<UserStats[]>([])
    const route = useRoute<HomeScreenProps["route"]>()

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
                        // Null assertion because finishTime does not exist for Enqueued users
                        const finishTime: any = new Date(abandonedData.finishTime!)
                        const waited = new Date(Math.abs(finishTime - joinTime))
                        abandonedData.waited = Math.floor(waited.getMinutes())
                        abandonedData.finishTime = `${finishTime.getHours()}:${finishTime.getHours()}:${finishTime.getHours()}`
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
        <ScrollView>
            <UserCatalogCardGroup entities={props} setEntities={setProps}/>
        </ScrollView>
    )
}
