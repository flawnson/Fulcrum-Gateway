import React, {useEffect, useState} from "react";
import CatalogEntityCardGroup from "../components/molecules/CatalogEntityCardGroup";
import {VStack} from "native-base";
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
        <CatalogEntityCardGroup entities={props.entities}/>
    )
}
