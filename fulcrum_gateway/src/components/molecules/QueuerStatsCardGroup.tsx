import React from 'react';
import DashboardStatsCard from "../atoms/DashboardStatsCard";
import {View, SimpleGrid} from "native-base";
import {StyleSheet} from "react-native";


type queuerStatsProps = {
    index: number,
    eta: number,
    waited: number,
    avg: number,
}

export default function (props: queuerStatsProps) {
    const queuerStatCards = Object.entries(props).map(([key, queuerStat]) =>
        <DashboardStatsCard key={key} stat={queuerStat}/>)

    return (
        <SimpleGrid columns={2} spacingY={8} spacingX={4} style={styles.stats}>
            {queuerStatCards}
        </SimpleGrid>
    )
}


const styles = StyleSheet.create({
    stats: {
        marginTop: 25,
        marginBottom: 25,
    },
})

