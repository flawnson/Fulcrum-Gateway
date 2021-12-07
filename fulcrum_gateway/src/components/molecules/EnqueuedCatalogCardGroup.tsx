import React, { useState, useEffect } from 'react';
import EnqueuedCatalogCard from "../atoms/EnqueuedCatalogCard";
import { View, VStack } from "native-base";
import { StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HomeScreenProps } from "../../../types";
import UserMultiSelectButtons from "../../containers/UserMultiSelectButtons"


type Entity = {
    userId: string,  // Actually a string rn...
    name: string,
    online: boolean,
    index: number,
    waited: number,
    state: string
}

type EnqueuedStatsProps = {
    entities: Array<Entity>
}

export default function (props: EnqueuedStatsProps) {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()

    const [selectedItems, setSelectedItems] = useState<Array<string>>([])

    function onKickedPress () {
        const entities = props.entities.filter(entity => selectedItems.includes(entity.userId))
        console.log(selectedItems)
        console.log(entities)
        for (let entity of entities) {
            entity.state = "KICKED"
        }
        props.entities = entities
    }

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
        navigation.navigate("UserDashboard")
    }

    const getSelected = (item: Entity) => selectedItems.includes(item.userId)

    const deSelectItems = () => {
        setSelectedItems([])
        navigation.setOptions({headerRight: undefined})
    }

    const selectItems = (item: Entity) => {
        navigation.setOptions({headerRight: (props) => <UserMultiSelectButtons onKickedPress={onKickedPress} />})

        if (selectedItems.includes(item.userId)) {
            const newListItems = selectedItems.filter(
                (listItem: string) => listItem !== item.userId,
            )
            return setSelectedItems([...newListItems])
        }
        setSelectedItems([...selectedItems, item.userId])
    }

    const OrganizerStatCards = Object.entries(props.entities).map(([key, userStat]) =>
        <EnqueuedCatalogCard key={key}
                             onPress={() => handleOnPress(userStat)}
                             onLongPress={() => selectItems(userStat)}
                             selected={getSelected(userStat)}
                             entity={userStat}/>)

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

