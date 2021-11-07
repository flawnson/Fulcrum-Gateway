import React, {useEffect, useState} from "react";
import CatalogEntityCardGroup from "../components/molecules/CatalogEntityCardGroup";
import {VStack} from "native-base";

export default function () {
    const [props, setProps] = useState({'entities': []})

    useEffect(() => {fetchQueuerData()}, [])

    async function fetchQueuerData () {
        try {
            const response = await fetch('http://localhost:8080/queuers')
            setProps(await response.json())
        } catch(error) {
            console.log(error)
        }
    }

    return (
        <CatalogEntityCardGroup entities={props.entities}/>
    )
}
