import React from 'react';
import CatalogEntityCard from "../atoms/CatalogEntityCard";
import {View, VStack} from "native-base";
import {StyleSheet} from "react-native";


type OrganizerStatsProps = {
    props: {
        'users': object
    }
}

export default function (props: OrganizerStatsProps) {
    const OrganizerStatCards = Object.entries(props).map(([key, queuerStat]) =>
        <CatalogEntityCard key={key} user={queuerStat}/>)

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

