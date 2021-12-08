import React from 'react';
import QueueDashboardStatsCardGroup from "../molecules/QueueStatsCardGroup";
import {SimpleGrid} from "native-base";

type Props = {
    QueueDashboardProps: {
        'enqueued': number,
        'serviced': number,
        'deferrals': number,
        'avg': number,
        'abandoned': number,
        'noshow': number
    }
}

export default function (props: Props) {
    return (
        <QueueDashboardStatsCardGroup {...props.QueueDashboardProps}/>
    )
}






