import React, { useState, useEffect } from 'react';
import AbandonedCatalogCard from "../atoms/AbandonedCatalogCard";
import { View, VStack } from "native-base";
import { StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HomeScreenProps, AbandonedStats } from "../../../types";


type AbandonedStatsProps = {
    'entities': Array<AbandonedStats>
}

export default function (props: AbandonedStatsProps) {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()

    const OrganizerStatCards = Object.entries(props.entities).map(([key, userStat]) =>
        <AbandonedCatalogCard key={key}
                              entity={userStat}/>)

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

