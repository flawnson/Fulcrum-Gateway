import React from 'react';
import DashboardStatsCard from "../atoms/DashboardStatsCard";
import {View, SimpleGrid} from "native-base";
import {StyleSheet} from "react-native";


type userStatsProps = {
    index: number,
    eta: number,
    waited: number,
    avg: number,
}

export default function (props: userStatsProps) {
    const organizerStatCards = Object.entries(props).map(([key, userStat]) =>
        <DashboardStatsCard key={key} stat={userStat}/>)

    return (
        <SimpleGrid columns={2} spacingY={8} spacingX={4} style={styles.stats}>
            {organizerStatCards}
        </SimpleGrid>
    )
}


const styles = StyleSheet.create({
    stats: {
        marginTop: 25,
        marginBottom: 25,
    },
})

