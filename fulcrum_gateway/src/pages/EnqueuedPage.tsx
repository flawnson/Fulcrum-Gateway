import React, {SetStateAction, useEffect, useState} from "react";
import EnqueuedCatalogCardGroup from "../components/molecules/EnqueuedCatalogCardGroup";
import useInterval from "../utilities/useInterval";

type EnqueuedStats = {
    userId: string,
    name: string,
    online: boolean,
    index: number,
    waited: number,
    state: string
}

export default function () {
    const [props, setProps] = useState<EnqueuedStats[]>([])

    useEffect(() => {fetchUserData()}, [])

    const query = `
        query get_enqueued($queue_id: QueueWhereUniqueInput!) {
            queue(where: $queue_id) {
                users {
                    userId: id
                    name
                    index
                    last_online
                    join_time
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

    async function fetchUserData () {
        try {
            const response = await fetch(`http://localhost:8080/api?query=${query}&variables=${variables}`)
            await response.json().then(
                data => {
                    data = data.data.queue.users
                    let user_stats: EnqueuedStats[] = []
                    data.forEach((queue_data: any) => {
                        const now: any = new Date()
                        const join: any = new Date(queue_data.create_time)
                        const waited = new Date(Math.abs(now - join))
                        queue_data.waited = `${Math.floor(waited.getMinutes())}`
                        const stats: SetStateAction<any> = Object.fromEntries([
                            "userId",
                            "name",
                            "index",
                            "online",
                            "waited",
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

    useInterval(fetchUserData, 5000)

    return (
        <EnqueuedCatalogCardGroup entities={props}/>
    )
}
