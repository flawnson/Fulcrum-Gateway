import React from 'react';
import QueuerDashboardStatsCardGroup from "../molecules/QueuerStatsCardGroup";
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
        <QueuerDashboardStatsCardGroup {...props.queuerDashboardProps}/>
    )
}






