import React, { useState, useEffect } from 'react';
import QueuesCatalogCard from "../atoms/QueuesCatalogCard";
import { View, VStack } from "native-base";
import { StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HomeScreenProps } from "../../../types";
import MultiSelectButtons from "../../containers/QueueMultiSelectButtons";


type QueueStats = {
    queueId: number,
    name: string,
    lifespan: number,
    state: string,
}

type ActiveQueuesStatsProps = {
    'entities': Array<QueueStats>
}

export default function (props: ActiveQueuesStatsProps) {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()

    const [selectedItems, setSelectedItems] = useState<Array<number>>([])

    // To remove header when organizer deselects all queues
    useEffect(() => {
        if (selectedItems.length === 0) {
            navigation.setOptions({headerRight: undefined})
        }
    }, [selectedItems])

    const handleOnPress = (item: QueueStats) => {
        if (selectedItems.length) {
            return selectItems(item)
        }

        // here you can add you code what do you want if quue just do single tap
        navigation.navigate("OrganizerDashboardTabs")
    }

    const getSelected = (item: QueueStats) => selectedItems.includes(item.queueId)

    const deSelectItems = () => {
        setSelectedItems([])
        navigation.setOptions({headerRight: undefined})
    }

    const selectItems = (item: QueueStats) => {
        navigation.setOptions({headerRight: (props) => <MultiSelectButtons {...props} /> })
        console.log(item)

        if (selectedItems.includes(item.queueId)) {
            const newListItems = selectedItems.filter(
                (listItem: number) => listItem !== item.queueId,
            )
            return setSelectedItems([...newListItems])
        }
        setSelectedItems([...selectedItems, item.queueId])
    }

    const OrganizerStatCards = Object.entries(props.entities).map(([key, queueStat]) =>
        <QueuesCatalogCard key={key}
                           onPress={() => handleOnPress(queueStat)}
                           onLongPress={() => selectItems(queueStat)}
                           selected={getSelected(queueStat)}
                           entity={queueStat}/>)

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

