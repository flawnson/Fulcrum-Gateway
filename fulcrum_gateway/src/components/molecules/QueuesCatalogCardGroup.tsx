import React, { useState, useEffect } from 'react';
import QueuesCatalogCard from "../atoms/QueuesCatalogCard";
import { View, VStack } from "native-base";
import { StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HomeScreenProps, QueueInfo } from "../../../types";
import MultiSelectButtons from "../../containers/QueueMultiSelectButtons";

type State = "ACTIVE" | "PAUSED" | "INACTIVE"

type ActiveQueuesStatsProps = {
    'entities': Array<QueueInfo>
}

export default function (props: ActiveQueuesStatsProps) {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const [action, setAction] = useState<State>("ACTIVE")
    const [selectedItems, setSelectedItems] = useState<Array<string>>([])

    function onActionPress (action: State) {
        setAction(action)
    }

    const getModified = (item: QueueInfo) => {
        if (getSelected(item)) {
            return action
        }
        return "ACTIVE"
    }

    // To remove header when organizer deselects all queues
    useEffect(() => {
        if (selectedItems.length === 0) {
            navigation.setOptions({headerRight: undefined})
        }
    }, [selectedItems])

    const handleOnPress = (item: QueueInfo) => {
        if (selectedItems.length) {
            return selectItems(item)
        }

        // here you can add you code what do you want if quue just do single tap
        navigation.navigate("QueueDashboardTabs")
    }

    const getSelected = (item: QueueInfo) => selectedItems.includes(item.queueId)

    const deSelectItems = () => {
        setSelectedItems([])
        setAction("ACTIVE")
        navigation.setOptions({headerRight: undefined})
    }

    const selectItems = (item: QueueInfo) => {
        navigation.setOptions({headerRight: (props) => <MultiSelectButtons onActionPress={onActionPress} /> })

        if (selectedItems.includes(item.queueId)) {
            const newListItems = selectedItems.filter(
                (listItem: string) => listItem !== item.queueId,
            )
            return setSelectedItems([...newListItems])
        }
        setSelectedItems([...selectedItems, item.queueId])
    }

    const OrganizerStatCards = Object.entries(props.entities).map(([key, queueStat]) =>
        <QueuesCatalogCard key={key}
                           onPress={() => handleOnPress(queueStat)}
                           onLongPress={() => selectItems(queueStat)}
                           deSelectItems={deSelectItems}
                           selected={getSelected(queueStat)}
                           modified={getModified(queueStat)}
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

