import React from 'react';
import QueueDashboardStatsCardGroup from "../molecules/QueueStatsCardGroup";
import { DashboardStat } from "../../types";
import _ from 'lodash'


const QueueDashboardStats = (props: DashboardStat[]) => {
    return (
        <QueueDashboardStatsCardGroup {...props}/>
    )
}


export default React.memo(QueueDashboardStats, (prevProps, nextProps) => _.isEqual(prevProps, nextProps))

