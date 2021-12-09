import React, { useState, useEffect } from 'react';
import ServicedCatalogCard from "../atoms/ServicedCatalogCard";
import { View, VStack } from "native-base";
import { StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HomeScreenProps } from "../../../types";


type ServicedStats = {
    userId: number,
    name: string,
    reneged: number,
}

type ServicedStatsProps = {
    'entities': Array<ServicedStats>
}

export default function (props: ServicedStatsProps) {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()

    const [selectedItems, setSelectedItems] = useState<Array<number>>([])

    // To remove header when organizer deselects all users
    useEffect(() => {
        if (selectedItems.length === 0) {
            navigation.setOptions({headerRight: undefined})
        }
    }, [selectedItems])

    const handleOnPress = (item: ServicedStats) => {
        if (selectedItems.length) {
            return selectItems(item)
        }

        // here you can add you code what do you want if user just do single tap
        navigation.navigate("UserDashboard")
    }

    const getSelected = (item: ServicedStats) => selectedItems.includes(item.userId)

    const deSelectItems = () => {
        setSelectedItems([])
        navigation.setOptions({headerRight: undefined})
    }

    const selectItems = (item: ServicedStats) => {

        if (selectedItems.includes(item.userId)) {
            const newListItems = selectedItems.filter(
                (listItem: number) => listItem !== item.userId,
            )
            return setSelectedItems([...newListItems])
        }
        setSelectedItems([...selectedItems, item.userId])
    }

    const OrganizerStatCards = Object.entries(props.entities).map(([key, userStat]) =>
        <ServicedCatalogCard key={key}
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

