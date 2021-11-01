import React from 'react';
import OrganizerDashboardStatsCardGroup from "../molecules/OrganizerStatsCardGroup";
import {SimpleGrid} from "native-base";

type Props = {
    OrganizerDashboardProps: {
        'enqueued': number,
        'serviced': number,
        'deferrals': number,
        'avg': number,
        'abandonments': number,
        'noshows': number
    }
}

export default function (props: Props) {
    return (
        <OrganizerDashboardStatsCardGroup {...props.OrganizerDashboardProps}/>
    )
}






