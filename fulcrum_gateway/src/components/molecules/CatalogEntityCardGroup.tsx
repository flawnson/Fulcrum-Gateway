import React, { useState } from 'react';
import CatalogEntityCard from "../atoms/CatalogEntityCard";
import { View, VStack } from "native-base";
import { StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HomeScreenProps } from "../../../types";
import {get} from "styled-system";


type Entity = {
    queuerId: number,
    name: string,
    index: string,
    waited: string,
    online: boolean,
}

type OrganizerStatsProps = {
    'entities': Array<Entity>
}

export default function (props: OrganizerStatsProps) {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()

    const [selectedItems, setSelectedItems] = useState<Array<number>>([])
    const handleOnPress = (item: Entity) => {
        if (selectedItems.length) {
            return selectItems(item)
        }

        // here you can add you code what do you want if user just do single tap
        navigation.navigate("QueuerDashboard")
    }

    const getSelected = (item: Entity) => selectedItems.includes(item.queuerId)

    const deSelectItems = () => setSelectedItems([])

    const selectItems = (item: Entity) => {
        navigation.setOptions({title: "POOP"})
        if (selectedItems.includes(item.queuerId)) {
            const newListItems = selectedItems.filter(
                (listItem: number) => listItem !== item.queuerId,
            )
            return setSelectedItems([...newListItems])
        }
        setSelectedItems([...selectedItems, item.queuerId])
    }

    const OrganizerStatCards = Object.entries(props.entities).map(([key, queuerStat]) =>
        <CatalogEntityCard key={key}
                           onPress={() => handleOnPress(queuerStat)}
                           onLongPress={() => selectItems(queuerStat)}
                           selected={getSelected(queuerStat)}
                           entity={queuerStat}/>)

    return (
        <Pressable onPress={deSelectItems} style={{flex: 1, padding: 15}}>
            <VStack style={styles.stats}>
                {OrganizerStatCards}
            </VStack>
        </Pressable>
    )
}


const styles = StyleSheet.create({
    stats: {
        marginTop: 25,
        marginBottom: 25,
    },
})

