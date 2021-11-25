import React, {SetStateAction, useEffect, useState} from "react";
import CatalogEntityCardGroup from "../components/molecules/EnqueuedCatalogCardGroup";
import useInterval from "../utilities/useInterval";

export default function () {
    const [props, setProps] = useState({'entities': []})

    useEffect(() => {fetchQueuerData()}, [])

    const query = `
        query get_organizer($id: ID!) {
            organizer(organizer_id: $id) {
                enqueued {
                    name
                    online
                    join_time
                }
            }
        }
    `
    const variables = `{
        "id": "costco"
    }`

    async function fetchQueuerData () {
        try {
            const response = await fetch(`http://localhost:8080/api?query=${query}&variables=${variables}`)
            await response.json().then(
                data => {
                    data = data.data.queue
                    const stats: SetStateAction<any> = Object.fromEntries([
                        "num_noshows"]
                        .filter(key => key in data)
                        .map(key => [key, data[key]]))
                    setProps(stats)
                }
            )
        } catch(error) {
            console.log(error)
        }
    }

    useInterval(fetchQueuerData, 5000)

    return (
        <CatalogEntityCardGroup entities={props.entities}/>
    )
}
