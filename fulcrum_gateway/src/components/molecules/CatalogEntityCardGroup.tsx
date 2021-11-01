import React from 'react';
import CatalogEntityCard from "../atoms/CatalogEntityCard";
import {View, SimpleGrid} from "native-base";
import {StyleSheet} from "react-native";


type OrganizerStatsProps = {
    'enqueued': number,
    'serviced': number,
    'deferrals': number,
    'avg': number,
    'abandonments': number,
    'noshows': number
}

export default function (props: OrganizerStatsProps) {
    const OrganizerStatCards = Object.entries(props).map(([key, queuerStat]) =>
        <CatalogEntityCard key={key} stat={queuerStat}/>)

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

