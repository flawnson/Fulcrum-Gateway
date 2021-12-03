import React, {SetStateAction, useEffect, useState} from "react";
import useInterval from "../utilities/useInterval";
import ServicedCatalogCardGroup from "../components/molecules/ServicedCatalogCardGroup";


type ServicedStats = {
    queuerId: number,
    name: string,
    reneged: number,
}

export default function () {
    const [props, setProps] = useState<ServicedStats[]>([])

    useEffect(() => {fetchServicedData()}, [])

    const query = `
        query queue($id: ID!){
            queue(queue_id: $id){
                serviced {
                    id
                    name
                    index
                    online
                    join_time
                    reneged_time
                }
            }
        }
    `
    const variables = `{
        "id": "costco_queue2"
    }`

    async function fetchServicedData () {
        try {
            const response = await fetch(`http://localhost:8080/api?query=${query}&variables=${variables}`)
            await response.json().then(
                data => {
                    console.log(data)
                    data = data.data.queue.serviced
                    let serviced_stats: ServicedStats[] = []
                    data.forEach((serviced_data: any) => {
                        const join_time: any = new Date(serviced_data.join_time)
                        const reneged_time: any = new Date(serviced_data.reneged_time)
                        const serviced_time = new Date(Math.abs(reneged_time - join_time))
                        serviced_data.serviced_time = `${Math.floor(serviced_time.getMinutes())}`
                        const stats: SetStateAction<any> = Object.fromEntries([
                            "id",
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

    useInterval(fetchServicedData, 5000)

    return (
        // Using active queues catalog cards because functionaly matches
        <ServicedCatalogCardGroup entities={props}/>
    )
}
