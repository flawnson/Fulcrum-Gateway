import React from 'react';
import UserDashboardStatsCardGroup from "../molecules/UserStatsCardGroup";
import { DashboardStat } from "../../types";


export default function (props: DashboardStat[]) {
    return (
        <UserDashboardStatsCardGroup {...props}/>
    )
}






