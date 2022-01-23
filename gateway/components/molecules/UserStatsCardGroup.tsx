import React from 'react';
import DashboardStatsCard from "../atoms/DashboardStatsCard";
import { View, SimpleGrid } from "native-base";
import { StyleSheet } from "react-native";
import { DashboardStat } from "../../types";
import { scale } from "../../utilities/scales";

export default function (props: DashboardStat[]) {
    const organizerStatCards = Object.entries(props).map(([key, userStat]) =>
        <DashboardStatsCard key={key} stat={userStat}/>)

    return (
        <SimpleGrid columns={2} spacingY={8} spacingX={4} style={styles.container}>
            {organizerStatCards}
        </SimpleGrid>
    )
}


const styles = StyleSheet.create({
    container: {
        margin: scale(25),
    },
})

