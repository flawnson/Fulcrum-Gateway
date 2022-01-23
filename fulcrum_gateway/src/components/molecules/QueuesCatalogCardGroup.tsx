import React, { useState, useEffect } from 'react';
import QueuesCatalogCard from "../atoms/QueuesCatalogCard";
import { Center, Text, View, VStack } from "native-base";
import { StyleSheet, Pressable, PressableStateCallbackType } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HomeScreenProps, QueueInfo } from "../../../types";
import { FlatList } from "react-native-gesture-handler";
import MultiSelectButtons from "../../containers/QueueMultiSelectButtons";
import NothingToSeeScreen from "../../screens/NothingToSeeScreen";

type State = "ACTIVE" | "PAUSED" | "INACTIVE"

type QueuesStatsProps = {
    entities: QueueInfo[]
    setEntities: React.Dispatch<React.SetStateAction<QueueInfo[]>>
}

type Children = (boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | ((state: PressableStateCallbackType) => React.ReactNode) | null | undefined)

type ConditionalWrapperArgs = {
    condition: number | boolean,  // Uses 0 as false and any other number as true
    wrapper: (children: Children) => any
    children: any
}


export default function (props: QueuesStatsProps) {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const [action, setAction] = useState<State>("ACTIVE")
    const [selectedItems, setSelectedItems] = useState<Array<string>>([])

    function onActionPress (action: State) {
        setAction(action)
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

        // Single tap code
        navigation.navigate("QueueDashboardTabs", {queueId: item.queueId})
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

    const ConditionalWrapper = ({condition, wrapper, children}: ConditionalWrapperArgs) =>
        condition ? wrapper(children) : children;

    return (
        props.entities.length === 0 ? <NothingToSeeScreen /> :
            <Center>
                <ConditionalWrapper
                    condition={selectedItems.length}
                    wrapper={(children: Children) => <Pressable onPress={deSelectItems} style={{flex: 1, padding: 15}}>{children}</Pressable>}
                >
                    <FlatList
                        data={props.entities}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item}: {item: QueueInfo}) => {
                            return <QueuesCatalogCard
                                entities={props.entities}
                                setEntities={props.setEntities}
                                onPress={() => handleOnPress(item)}
                                onLongPress={() => selectItems(item)}
                                deSelectItems={deSelectItems}
                                selected={getSelected(item)}
                                entity={item}/>
                            }
                        }
                    />
                </ConditionalWrapper>
            </Center>
        )
    }


const styles = StyleSheet.create({
})

