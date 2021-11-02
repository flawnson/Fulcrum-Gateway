import React from 'react';
import CatalogEntityCard from "../atoms/CatalogEntityCard";
import {View, VStack} from "native-base";
import {StyleSheet} from "react-native";


type Entity = {
    name: string,
    index: string,
    waited: string,
}

type OrganizerStatsProps = {
    'entities': Array<Entity>
}

export default function (props: OrganizerStatsProps) {
    const OrganizerStatCards = Object.entries(props.entities).map(([key, queuerStat]) =>
        <CatalogEntityCard key={key} entity={queuerStat}/>)

    return (
        <VStack style={styles.stats}>
            {OrganizerStatCards}
        </VStack>
    )
}


const styles = StyleSheet.create({
    stats: {
        marginTop: 25,
        marginBottom: 25,
    },
})

