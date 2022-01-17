import React, { useState, useEffect } from 'react';
import EnqueuedCatalogCard from "../atoms/EnqueuedCatalogCard";
import { Center } from "native-base";
import { FlatList } from "react-native-gesture-handler"
import { StyleSheet, Pressable, PressableStateCallbackType} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HomeScreenProps } from "../../../types";
import EnqueuedMultiSelectButtons from "../../containers/EnqueuedMultiSelectButtons"
import { EnqueuedStats } from "../../../types";
import {UserStatus} from "../../../types";


type EnqueuedStatsProps = {
    entities: Array<EnqueuedStats>
    setEntities: React.Dispatch<React.SetStateAction<EnqueuedStats[]>>
}
type Children = (boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | ((state: PressableStateCallbackType) => React.ReactNode) | null | undefined)
type ConditionalWrapperArgs = {
    condition: number | boolean,  // Uses 0 as false and any other number as true
    wrapper: (children: Children) => any
    children: any
}

export default function (props: EnqueuedStatsProps) {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const parentNavigation = navigation.getParent()
    const [action, setAction] = useState<UserStatus | "SUMMONED">("ENQUEUED")
    const [selectedItems, setSelectedItems] = useState<Array<EnqueuedStats["userId"]>>([])

    function onActionPress(actionStatus: UserStatus | "SUMMONED") {
        setAction(actionStatus)
    }

    // To remove header when organizer deselects all users
    useEffect(() => {
        if (selectedItems.length === 0) {
            if (parentNavigation) {
                parentNavigation.setOptions({headerRight: undefined})
            }
        }
    }, [selectedItems])

    const handleOnPress = (item: EnqueuedStats) => {
        if (selectedItems.length) {
            return selectItems(item)
        }

        // here you can add you code what do you want if user just do single tap
    }

    const getSelected = (item: EnqueuedStats) => selectedItems.includes(item.userId)

    const deSelectItems = () => {
        setAction("ENQUEUED")
        setSelectedItems([])
        navigation.setOptions({headerRight: undefined})
    }

    const selectItems = (item: EnqueuedStats) => {
        if (parentNavigation) {
            parentNavigation.setOptions({
                headerRight: () => <EnqueuedMultiSelectButtons onActionPress={onActionPress}/>
            })
        }

        if (selectedItems.includes(item.userId)) {
            const newListItems = selectedItems.filter(
                (listItem: EnqueuedStats["userId"]) => listItem !== item.userId,
            )
            return setSelectedItems([...newListItems])
        }
        setSelectedItems([...selectedItems, item.userId])
    }

    const ConditionalWrapper = ({condition, wrapper, children}: ConditionalWrapperArgs) =>
        condition ? wrapper(children) : children;

    return (
        <Center>
            <ConditionalWrapper
                condition={selectedItems.length}
                wrapper={(children: Children) => <Pressable onPress={deSelectItems} style={{flex: 1, padding: 15}}>{children}</Pressable>}
            >
                <FlatList
                    data={props.entities}
                    renderItem={({item}: {item: EnqueuedStats}) => {
                        return <EnqueuedCatalogCard
                                    entities={props.entities}
                                    setEntities={props.setEntities}
                                    onPress={() => handleOnPress(item)}
                                    onLongPress={() => selectItems(item)}
                                    deSelectItems={deSelectItems}
                                    selected={getSelected(item)}
                                    entity={item}/>
                        }
                    }
                    keyExtractor={(item, index) => index.toString()}
                />
            </ConditionalWrapper>
        </Center>
    )
}

