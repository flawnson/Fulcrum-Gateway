import React, { SetStateAction, useEffect, useState } from "react";
import useInterval from "../utilities/useInterval";
import ServicedCatalogCardGroup from "../components/molecules/ServicedCatalogCardGroup";
import {HomeScreenProps, ServicedStats, EnqueuedStats, UserStatsTypes} from "../types";
import {useIsFocused, useRoute} from "@react-navigation/native";
import EnqueuedCatalogCardGroup from "../components/molecules/UserCatalogCardGroup";


export default function () {
    const [props, setProps] = useState<UserStatsTypes[]>([])
    const route = useRoute<HomeScreenProps["route"]>()

    const query = `
        query get_users($queueId: String! $orderBy: [UserOrderByWithRelationInput!]) {
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

    async function fetchServicedData () {
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
                    data = data.filter((d: ServicedStats) => d.status === "SERVICED")
                    let servicedStats: ServicedStats[] = []
                    data.forEach((servicedData: ServicedStats) => {
                        const joinTime: any = new Date(servicedData.joinTime)
                        const renegedTime: any = new Date(servicedData.renegedTime)
                        const servicedTime = new Date(Math.abs(renegedTime - joinTime))
                        servicedData.servicedTime = `${Math.floor(servicedTime.getMinutes())}`
                        servicedStats.push(servicedData)
                    })
                    setProps(servicedStats)
                }
            )
        } catch(error) {
            console.log(error)
        }
    }

    // Run on first render
    useEffect(() => {fetchServicedData().then(null)}, [])
    // Poll only if user is currently on this screen
    useInterval(fetchServicedData, useIsFocused() ? 5000 : null)

    return (
        <EnqueuedCatalogCardGroup entities={props} setEntities={setProps}/>
    )
}
