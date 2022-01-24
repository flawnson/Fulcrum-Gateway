import React from 'react';
import ServicedCatalogCard from "../atoms/ServicedCatalogCard";
import { Center } from "native-base";
import { ServicedStats } from "../../types";
import NothingToSeeScreen from "../../screens/NothingToSeeScreen";
import {FlatList} from "react-native-gesture-handler";


type ServicedStatsProps = {
    'entities': Array<ServicedStats>
}

export default function (props: ServicedStatsProps) {

    return (
        props.entities.length === 0 ? <NothingToSeeScreen /> :
        <Center>
            <FlatList
                data={props.entities}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}: {item: ServicedStats}) => {
                    return <ServicedCatalogCard
                        entity={item}/>
                    }
                }
            />
        </Center>
    )
}


