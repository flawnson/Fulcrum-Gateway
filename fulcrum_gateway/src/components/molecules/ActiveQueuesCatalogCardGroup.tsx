import React, { useState, useEffect } from 'react';
import ActiveQueuesCatalogCard from "../atoms/ActiveQueuesCatalogCard";
import { View, VStack } from "native-base";
import { StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HomeScreenProps } from "../../../types";


type Entity = {
    queuerId?: number,
    name: string,
    lifespan: number,
    state: string,
}

type ActiveQueuesStatsProps = {
    'entities': Array<Entity>
}

export default function (props: ActiveQueuesStatsProps) {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()

    const handleOnPress = () => {
        navigation.navigate("OrganizerDashboardTabs")
    }

    const OrganizerStatCards = Object.entries(props.entities).map(([key, queuerStat]) =>
        <ActiveQueuesCatalogCard key={key}
                                 onPress={() => handleOnPress()}
                                 entity={queuerStat}/>)

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

