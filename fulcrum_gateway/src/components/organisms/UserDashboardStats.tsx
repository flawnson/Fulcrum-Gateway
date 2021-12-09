import React from 'react';
import UserDashboardStatsCardGroup from "../molecules/UserStatsCardGroup";
import { UserStats } from "../../../types";

type Props = {
    userDashboardProps: UserStats
}

export default function (props: Props) {
    return (
        <UserDashboardStatsCardGroup {...props.userDashboardProps}/>
    )
}






