import React, {useEffect, useState} from "react";
import ActiveQueuesCatalogCardGroup from "../components/molecules/ActiveQueuesCatalogCardGroup";
import useInterval from "../utilities/useInterval";

export default function () {
    const [props, setProps] = useState({'entities': []})

    useEffect(() => {fetchServicedData()}, [])

    async function fetchServicedData () {
        try {
            const response = await fetch('http://localhost:8080/organizer/ORGANIZERID/queues/QUEUEID/serviced')
            setProps(await response.json())
        } catch(error) {
            console.log(error)
        }
    }

    useInterval(fetchServicedData, 5000)

    return (
        // Using active queues catalog cards because functionaly matches
        <ActiveQueuesCatalogCardGroup entities={props.entities}/>
    )
}
