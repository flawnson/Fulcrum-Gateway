import React from 'react';
import UserDashboardStatsCardGroup from "../molecules/UserStatsCardGroup";

type Props = {
    userDashboardProps: {
        index: number,
        eta: number,
        waited: number,
        avg: number,
    }
}

export default function (props: Props) {
    return (
        <UserDashboardStatsCardGroup {...props.userDashboardProps}/>
    )
}






