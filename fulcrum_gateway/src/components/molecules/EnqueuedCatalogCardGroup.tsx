import React, { useState, useEffect } from 'react';
import CatalogEntityCard from "../atoms/EnqueuedCatalogCard";
import { View, VStack } from "native-base";
import { StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HomeScreenProps } from "../../../types";
import MultiSelectButtons from "../atoms/MultiSelectButtons"


type Entity = {
    queuerId: number,
    name: string,
    online: boolean,
    index: number,
    waited: number,
}

type EnqueuedStatsProps = {
    'entities': Array<Entity>
}

export default function (props: EnqueuedStatsProps) {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()

    const [selectedItems, setSelectedItems] = useState<Array<number>>([])

    // To remove header when organizer deselects all queuers
    useEffect(() => {
        if (selectedItems.length === 0) {
            navigation.setOptions({headerRight: undefined})
        }
    }, [selectedItems])

    const handleOnPress = (item: Entity) => {
        if (selectedItems.length) {
            return selectItems(item)
        }

        // here you can add you code what do you want if user just do single tap
        navigation.navigate("QueuerDashboard")
    }

    const getSelected = (item: Entity) => selectedItems.includes(item.queuerId)

    const deSelectItems = () => {
        setSelectedItems([])
        navigation.setOptions({headerRight: undefined})
    }

    const selectItems = (item: Entity) => {
        navigation.setOptions({headerRight: (props) => <MultiSelectButtons {...props} /> })

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

