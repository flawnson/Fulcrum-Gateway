import React, {SetStateAction, useEffect, useState} from "react";
import CatalogEntityCardGroup from "../components/molecules/EnqueuedCatalogCardGroup";
import useInterval from "../utilities/useInterval";

type EnqueuedStats = {
    queuerId: number,
    name: string,
    online: boolean,
    index: number,
    waited: number,
}

export default function () {
    const [props, setProps] = useState<EnqueuedStats[]>([])

    useEffect(() => {fetchQueuerData()}, [])

    const query = `
        query queue($id: ID!){
            queue(queue_id: $id){
                enqueued {
                    id
                    name
                    index
                    online
                    join_time
                }
            }
        }
    `
    const variables = `{
        "id": "costco_queue1"
    }`

    async function fetchQueuerData () {
        try {
            const response = await fetch(`http://localhost:8080/api?query=${query}&variables=${variables}`)
            await response.json().then(
                data => {
                    data = data.data.queue.enqueued
                    let queuer_stats: EnqueuedStats[] = []
                    data.forEach((queue_data: any) => {
                        const now: any = new Date()
                        const join: any = new Date(queue_data.create_time)
                        const waited = new Date(Math.abs(now - join))
                        queue_data.waited = `${Math.floor(waited.getMinutes())}`
                        const stats: SetStateAction<any> = Object.fromEntries([
                            "id",
                            "name",
                            "index",
                            "online",
                            "waited"]
                            .filter(key => key in queue_data)
                            .map(key => [key, queue_data[key]]))
                        queuer_stats.push(stats)
                    })
                    setProps(queuer_stats)
                }
            )
        } catch(error) {
            console.log(error)
        }
    }

    useInterval(fetchQueuerData, 5000)

    return (
        <CatalogEntityCardGroup entities={props}/>
    )
}
