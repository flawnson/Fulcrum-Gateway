import React, { SetStateAction , useEffect, useState} from "react";
import CatalogEntityCardGroup from "../components/molecules/AbandonedCatalogCardGroup";
import useInterval from "../utilities/useInterval";
import { AbandonedStats } from "../../types";

export default function () {
    const [props, setProps] = useState<AbandonedStats[]>([])

    useEffect(() => {fetchAbandonedData()}, [])

    const query = `
        query get_queue_stats($queue_id: QueueWhereUniqueInput!) {
            queue(where: $queue_id) {
                users {
                    userId: id
                    name
                    join_time
                    last_online
                    state
                }
            }
        }
    `
    const variables = `{
    "queue_id": {
            "id": 1
        }
    }`

    async function fetchAbandonedData () {
        try {
            const response = await fetch(`http://localhost:8080/api?query=${query}&variables=${variables}`)
            await response.json().then(
                data => {
                    data = data.data.queue.users
                    data = data.filter((d: AbandonedStats) => d.state === "ABANDONED")
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

    useInterval(fetchAbandonedData, 5000)

    return (
        // Using active queues catalog cards because functionaly matches
        <CatalogEntityCardGroup entities={props}/>
    )
}
