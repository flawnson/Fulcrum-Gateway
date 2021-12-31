import React, {SetStateAction, useEffect, useState} from "react";
import CatalogEntityCardGroup from "../components/molecules/AbandonedCatalogCardGroup";
import useInterval from "../utilities/useInterval";
import {AbandonedStats, EnqueuedStats} from "../../types";

export default function () {
    const [props, setProps] = useState<AbandonedStats[]>([])

    const query = `
        query get_queue_stats($queue_id: QueueWhereUniqueInput!) {
            queue(where: $queue_id) {
                users {
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
    "queue_id": {
            "id": "costco_queue1"
        }
    }`

    async function fetchAbandonedData () {
        try {
            const response = await fetch(`http://localhost:8080/api?query=${query}&variables=${variables}`)
            await response.json().then(
                data => {
                    data = data.data.queue.users
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
    useEffect(() => {fetchAbandonedData()}, [])
    // Poll only if user is currently on this screen
    // if (useIsFocused()) {useInterval(fetchAbandonedData, 5000)}
    useInterval(fetchAbandonedData, 5000)

    return (
        // Using active queues catalog cards because functionaly matches
        <CatalogEntityCardGroup entities={props}/>
    )
}
