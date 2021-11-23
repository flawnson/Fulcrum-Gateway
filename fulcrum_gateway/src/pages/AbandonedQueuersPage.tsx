import React, {useEffect, useState} from "react";
import ActiveQueuesCatalogCardGroup from "../components/molecules/ActiveQueuesCatalogCardGroup";
import useInterval from "../utilities/useInterval";

export default function () {
    const [props, setProps] = useState({'entities': []})

    useEffect(() => {fetchAbandonedData()}, [])

    async function fetchAbandonedData () {
        try {
            const response = await fetch('http://localhost:8080/organizer/ORGANIZERID/queues/QUEUEID/abandoned')
            setProps(await response.json())
        } catch(error) {
            console.log(error)
        }
    }

    useInterval(fetchAbandonedData, 5000)

    return (
        // Using active queues catalog cards because functionaly matches
        <ActiveQueuesCatalogCardGroup entities={props.entities}/>
    )
}
