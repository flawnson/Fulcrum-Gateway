import React, {useEffect, useState} from "react";
import CatalogEntityCardGroup from "../components/molecules/CatalogEntityCardGroup";
import {VStack} from "native-base";
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
        <CatalogEntityCardGroup entities={props.entities}/>
    )
}
