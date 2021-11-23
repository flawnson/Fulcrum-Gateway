import React, {useEffect, useState} from "react";
import CatalogEntityCardGroup from "../components/molecules/EnqueuedCatalogCardGroup";
import useInterval from "../utilities/useInterval";

export default function () {
    const [props, setProps] = useState({'entities': []})

    useEffect(() => {fetchQueuerData()}, [])

    async function fetchQueuerData () {
        try {
            const response = await fetch('http://localhost:8080/organizer/ORGANIZERID/queues/QUEUEID/enqueued')
            setProps(await response.json())
        } catch(error) {
            console.log(error)
        }
    }

    useInterval(fetchQueuerData, 5000)

    return (
        <CatalogEntityCardGroup entities={props.entities}/>
    )
}
