import React, { useState, useEffect } from 'react';
import QueuesCatalogCard from "../atoms/QueuesCatalogCard";
import { View, VStack } from "native-base";
import { StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HomeScreenProps } from "../../../types";
import MultiSelectButtons from "../atoms/UserMultiSelectButtons";


type Entity = {
    userId: number,
    name: string,
    lifespan: number,
    state: string,
}

type ActiveQueuesStatsProps = {
    'entities': Array<Entity>
}

export default function (props: ActiveQueuesStatsProps) {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()

    const [selectedItems, setSelectedItems] = useState<Array<number>>([])

    // To remove header when organizer deselects all users
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
        navigation.navigate("OrganizerDashboardTabs")
    }

    const getSelected = (item: Entity) => selectedItems.includes(item.userId)

    const deSelectItems = () => {
        setSelectedItems([])
        navigation.setOptions({headerRight: undefined})
    }

    const selectItems = (item: Entity) => {
        navigation.setOptions({headerRight: (props) => <MultiSelectButtons {...props} /> })

        if (selectedItems.includes(item.userId)) {
            const newListItems = selectedItems.filter(
                (listItem: number) => listItem !== item.userId,
            )
            return setSelectedItems([...newListItems])
        }
        setSelectedItems([...selectedItems, item.userId])
    }

    const OrganizerStatCards = Object.entries(props.entities).map(([key, userStat]) =>
        <QueuesCatalogCard key={key}
                           onPress={() => handleOnPress(userStat)}
                           onLongPress={() => selectItems(userStat)}
                           selected={getSelected(userStat)}
                           entity={userStat}/>)

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

