import React from 'react';
import OrganizerDashboardStatsCardGroup from "../molecules/OrganizerStatsCardGroup";
import {SimpleGrid} from "native-base";

type Props = {
    queuerDashboardProps: {
        index: number,
        eta: number,
        waited: number,
        avg: number,
    }
}

export default function (props: Props) {
    return (
        <OrganizerDashboardStatsCardGroup {...props.queuerDashboardProps}/>
    )
}






