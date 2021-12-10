import React from 'react';
import QueueDashboardStatsCardGroup from "../molecules/QueueStatsCardGroup";
import { QueueStats } from "../../../types";

type Props = {
    QueueDashboardProps: QueueStats
}

export default function (props: Props) {
    return (
        <QueueDashboardStatsCardGroup {...props.QueueDashboardProps}/>
    )
}






