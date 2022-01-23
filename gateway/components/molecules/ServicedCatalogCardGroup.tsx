import React, { useState, useEffect } from 'react';
import ServicedCatalogCard from "../atoms/ServicedCatalogCard";
import { View, VStack, Center } from "native-base";
import { StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {EnqueuedStats, HomeScreenProps} from "../../types";
import { ServicedStats } from "../../types";
import NothingToSeeScreen from "../../screens/NothingToSeeScreen";
import {FlatList} from "react-native-gesture-handler";
import EnqueuedCatalogCard from "../atoms/EnqueuedCatalogCard";


type ServicedStatsProps = {
    'entities': Array<ServicedStats>
}

export default function (props: ServicedStatsProps) {

    return (
        props.entities.length === 0 ? <NothingToSeeScreen /> :
        <FlatList
            data={props.entities}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}: {item: ServicedStats}) => {
                return <ServicedCatalogCard
                    entity={item}/>
                }
            }
        />
    )
}


