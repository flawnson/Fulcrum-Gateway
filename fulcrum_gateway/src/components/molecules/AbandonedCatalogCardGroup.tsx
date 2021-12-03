import React, { useState, useEffect } from 'react';
import AbandonedCatalogCard from "../atoms/AbandonedCatalogCard";
import { View, VStack } from "native-base";
import { StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HomeScreenProps } from "../../../types";
import MultiSelectButtons from "../atoms/MultiSelectButtons"


type AbandonedStats = {
    queuerId: number,
    name: string,
    waited: number,
}

type AbandonedStatsProps = {
    'entities': Array<AbandonedStats>
}

export default function (props: AbandonedStatsProps) {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()

    const [selectedItems, setSelectedItems] = useState<Array<number>>([])

    // To remove header when organizer deselects all queuers
    useEffect(() => {
        if (selectedItems.length === 0) {
            navigation.setOptions({headerRight: undefined})
        }
    }, [selectedItems])

    const handleOnPress = (item: AbandonedStats) => {
        if (selectedItems.length) {
            return selectItems(item)
        }

        // here you can add you code what do you want if user just do single tap
        navigation.navigate("QueuerDashboard")
    }

    const getSelected = (item: AbandonedStats) => selectedItems.includes(item.queuerId)

    const deSelectItems = () => {
        setSelectedItems([])
        navigation.setOptions({headerRight: undefined})
    }

    const selectItems = (item: AbandonedStats) => {
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
        <AbandonedCatalogCard key={key}
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

