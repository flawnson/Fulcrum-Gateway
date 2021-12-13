import React from 'react';
import UserDashboardStatsCardGroup from "../molecules/UserStatsCardGroup";
import { UserStat } from "../../../types";


export default function (props: UserStat[]) {
    return (
        <UserDashboardStatsCardGroup {...props}/>
    )
}






