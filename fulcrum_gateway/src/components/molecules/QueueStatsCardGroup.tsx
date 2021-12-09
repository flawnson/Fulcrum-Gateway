import React from 'react';
import DashboardStatsCard from "../atoms/DashboardStatsCard";
import { View, SimpleGrid } from "native-base";
import { StyleSheet } from "react-native";
import { QueueStats } from "../../../types";


type OrganizerStatsProps = QueueStats

export default function (props: OrganizerStatsProps) {
    const OrganizerStatCards = Object.entries(props).map(([key, queuerStat]) =>
        <DashboardStatsCard key={key} stat={queuerStat}/>)

    return (
        <SimpleGrid columns={2} spacingY={8} spacingX={4} style={styles.stats}>
            {OrganizerStatCards}
        </SimpleGrid>
    )
}


const styles = StyleSheet.create({
    stats: {
        marginTop: 25,
        marginBottom: 25,
    },
})

