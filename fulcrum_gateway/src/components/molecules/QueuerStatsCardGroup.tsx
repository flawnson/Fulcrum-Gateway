import React from 'react';
import DashboardStatsCard from "../atoms/DashboardStatsCard";
import {View} from "native-base";


type queuerStatsProps = {
    index: number,
    eta: number,
    waited: number,
    avg: number,
}

export default function (props: queuerStatsProps) {
    const queuerStatCards = Object.values(props).map((queuerStat) => <DashboardStatsCard stat={queuerStat}/>)

    return (
        <View>
            {queuerStatCards}
        </View>
    )
}



