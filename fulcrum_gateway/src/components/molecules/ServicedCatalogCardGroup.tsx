import React, { useState, useEffect } from 'react';
import ServicedCatalogCard from "../atoms/ServicedCatalogCard";
import { View, VStack, Center } from "native-base";
import { StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HomeScreenProps } from "../../../types";
import { ServicedStats } from "../../../types";


type ServicedStatsProps = {
    'entities': Array<ServicedStats>
}

export default function (props: ServicedStatsProps) {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()

    const OrganizerStatCards = Object.entries(props.entities).map(([key, userStat]) =>
        <ServicedCatalogCard key={key}
                             entity={userStat}/>)

    return (
        <Center>
            <VStack style={styles.stats}>
                {OrganizerStatCards}
            </VStack>
        </Center>
    )
}


const styles = StyleSheet.create({
    stats: {
        marginTop: 25,
        marginBottom: 25,
    },
})

