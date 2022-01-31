import React from 'react';
import QueueDashboardStatsCardGroup from "../molecules/QueueStatsCardGroup";
import { DashboardStat } from "../../types";


export default function (props: DashboardStat[]) {
    return (
        <QueueDashboardStatsCardGroup {...props}/>
    )
}






