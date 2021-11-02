import React, { useState } from "react";
import CatalogEntityCardGroup from "../components/molecules/CatalogEntityCardGroup";
import {VStack} from "native-base";

export default function () {
    const [props, setProps] = useState({'users': []})

    async function getQueueData () {
        try {
            const response = await fetch('http://localhost:8080/queue')
            setProps(await response.json())
        } catch(error) {
            console.log(error)
        }
    }

    return (
        <CatalogEntityCardGroup props={props}/>
    )
}
