import React from 'react';
import QueuerDashboardStatsCardGroup from "../molecules/QueuerStatsCardGroup";
import {View} from "native-base";

export default function () {
    const tempProps = {
        index: 3,
        eta: 15,
        waited: 5,
        avg: 10,
        values: Function,  // Not sure if this is the best way to be doing this...
    }
    return (
        <View>
            <QueuerDashboardStatsCardGroup {...tempProps}/>
        </View>
    )
}






