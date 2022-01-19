import React, { SetStateAction, useEffect, useState } from "react";
import useInterval from "../utilities/useInterval";
import ServicedCatalogCardGroup from "../components/molecules/ServicedCatalogCardGroup";
import {HomeScreenProps, ServicedStats} from "../../types";
import {useIsFocused, useRoute} from "@react-navigation/native";


export default function () {
    const [props, setProps] = useState<ServicedStats[]>([])
    const route = useRoute<HomeScreenProps["route"]>()

    const query = `
        query get_users($queueId: String! $orderBy: [UserOrderByWithRelationInput!]) {
            getQueue(queueId: $queueId) {
                users(orderBy: $orderBy) {
                    user_id: id
                    name
                    index
                    last_online
                    join_time
                    status
                    estimated_wait
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
                                        body: JSON.stringify({query: query, variables: variables})})
            await response.json().then(
                data => {
                    data = data.data.getQueue.users
                    data = data.filter((d: ServicedStats) => d.status === "SERVICED")
                    let serviced_stats: ServicedStats[] = []
                    data.forEach((serviced_data: any) => {
                        const join_time: any = new Date(serviced_data.join_time)
                        const reneged_time: any = new Date(serviced_data.reneged_time)
                        const serviced_time = new Date(Math.abs(reneged_time - join_time))
                        serviced_data.serviced_time = `${Math.floor(serviced_time.getMinutes())}`
                        const stats: SetStateAction<any> = Object.fromEntries([
                            "userId",
                            "name",
                            "waited"]
                            .filter(key => key in serviced_data)
                            .map(key => [key, serviced_data[key]]))
                        serviced_stats.push(stats)
                    })
                    setProps(serviced_stats)
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
        // Using active queues catalog cards because functionaly matches
        <ServicedCatalogCardGroup entities={props}/>
    )
}
