import React from 'react';
import OrganizerDashboardStatsCardGroup from "../molecules/OrganizerStatsCardGroup";
import {SimpleGrid} from "native-base";
import CatalogEntityCardGroup from "../molecules/CatalogEntityCardGroup";

type Props = {
    queuerDashboardProps: {
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
        <CatalogEntityCardGroup {...props.queuerDashboardProps}/>
    )
}






