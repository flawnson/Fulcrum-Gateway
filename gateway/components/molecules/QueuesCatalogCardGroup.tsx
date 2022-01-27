import React, { useState, useEffect } from 'react';
import QueuesCatalogCard from "../atoms/QueuesCatalogCard";
import { Center, Text, View, VStack } from "native-base";
import { StyleSheet, Pressable, PressableStateCallbackType } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {HomeScreenProps, QueueInfo, QueueState} from "../../types";
import { FlatList } from "react-native-gesture-handler";
import MultiSelectButtons from "../../containers/QueueMultiSelectButtons";
import NothingToSeeScreen from "../../screens/NothingToSeeScreen";
import ConfirmDeleteAlert from "../../containers/ConfirmDeleteAlert";


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
    const [action, setAction] = useState<QueueState>("ACTIVE")
    const [paused, setPaused] = useState<boolean>(true)
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState<boolean>(false)
    const [selectedItems, setSelectedItems] = useState<Array<QueueInfo["queueId"]>>([])

    useEffect(() => {
        onChangeState(action)
    }, [action])

    const pauseQuery = `
        mutation change_queue_state($queueId: String, $state: String!) {
            changeQueueState(queueId: $queueId, state: $state) {
                id
                state
            }
        }
    `
    const deleteQuery = `
        mutation delete_queue($queueId: String!) { 
            deleteQueue(queueId: $queueId) { 
                id
            }
        }
    `

    async function changeQueueState (queueId: QueueInfo["queueId"], state: QueueState) {
        try {
            const body = state === "PAUSED"
                ? {query: pauseQuery, variables: {queueId: queueId, state: "PAUSED"}}
                : state === "DELETED" ? {query: deleteQuery, variables: {queueId: queueId}}
                    : {error: "error"}  // Trigger error if state is not PAUSED or DELETED
            const response = await fetch(`http://localhost:8080/api`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:19006/',
                },
                credentials: 'include',
                body: JSON.stringify(body)
            });
            // enter you logic when the fetch is successful
            return await response.json()
        } catch(error) {
            // enter your logic for when there is an error (ex. error toast)
            return error
        }
    }

    const onChangeState = (state: QueueState) => {
        if (state === "DELETED"){
            console.log([...props.entities.filter(queue => !selectedItems.includes(queue.queueId))])
            props.setEntities(
                [...props.entities.filter(queue => !selectedItems.includes(queue.queueId))]
            )
            // setShowConfirmDeleteModal(true)
        } else if (state === "PAUSED") {
            setPaused(!paused)
        }
        deSelectItems()
        for (const selectedItem of selectedItems) {
            props.entities.find(user => user.queueId === selectedItem)!.state = state
            changeQueueState(selectedItem, state).then()
        }
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
        navigation.setOptions(
            {headerRight: (props) => <MultiSelectButtons onActionPress={setAction} /> }
        )

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
                <ConfirmDeleteAlert showAlert={showConfirmDeleteModal} setShowAlert={setShowConfirmDeleteModal}/>
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

