import React from 'react';
import AbandonedCatalogCard from "../atoms/AbandonedCatalogCard";
import { StyleSheet, Pressable } from "react-native";
import {HomeScreenProps, AbandonedStats, ServicedStats} from "../../../types";
import NothingToSeeScreen from "../../screens/NothingToSeeScreen";
import { FlatList } from "react-native-gesture-handler";


type AbandonedStatsProps = {
    'entities': Array<AbandonedStats>
}

export default function (props: AbandonedStatsProps) {

    return (
        props.entities.length === 0 ? <NothingToSeeScreen /> :
        <FlatList
            data={props.entities}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}: {item: AbandonedStats}) => {
                return <AbandonedCatalogCard
                    entity={item}/>
                }
            }
        />
    )
}


