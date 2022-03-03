import React, { useState, useEffect } from 'react';
import QueuesCatalogCard from "../atoms/QueuesCatalogCard";
import {Center, ScrollView, Text, View, VStack} from "native-base";
import { StyleSheet, Pressable, PressableStateCallbackType } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {HomeScreenProps, QueueInfo, QueueState} from "../../types";
import { FlatList } from "react-native-gesture-handler";
import QueueMultiSelectButtons from "../organisms/QueueMultiSelectButtons";
import NothingToSeeScreen from "../../screens/NothingToSeeScreen";
import ConfirmDeleteAlert from "../../containers/ConfirmDeleteAlert";
import baseURL from "../../utilities/baseURL";
import corsURL from "../../utilities/corsURL";
import {scale} from "../../utilities/scales";
import useDimensions from "../../utilities/useDimensions";
import {useTranslation} from "react-i18next";


type QueuesStatsProps = {
    entities: QueueInfo[]
    setEntities: React.Dispatch<React.SetStateAction<QueueInfo[]>>
    showConfirmDeleteAlert: {show: boolean, callback: Function},
    setShowConfirmDeleteAlert: React.Dispatch<React.SetStateAction<any>>
}

type Children = (boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | ((state: PressableStateCallbackType) => React.ReactNode) | null | undefined)

type ConditionalWrapperArgs = {
    condition: number | boolean,  // Uses 0 as false and any other number as true
    wrapper: (children: Children) => any
    children: any
}


export default function (props: QueuesStatsProps) {
    const { t } = useTranslation("queuesCatalogCardGroup")
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const [queueState, setQueueState] = useState<QueueState>("ACTIVE")
    const [paused, setPaused] = useState<boolean>(true)
    const { width, height } = useDimensions()
    const [selectedItems, setSelectedItems] = useState<Array<QueueInfo["queueId"]>>([])

    useEffect(() => {
        onChangeQueueState(queueState)
    }, [queueState])

    const pauseQuery = `
        mutation change_queue_state($queueId: String, $state: String!) {
            changeQueueState(queueId: $queueId, state: $state) {
                ... on Queue {
                    id
                    state
                }
                ... on Error {
                    error
                }
            }
        }
    `
    const deleteQuery = `
        mutation delete_queue($queueId: String!) {
            deleteQueue(queueId: $queueId){
                ... on Queue {
                    id
                }
                ... on Error {
                    error
                }
            }
        }
    `

    async function changeQueueState (queueId: QueueInfo["queueId"], state: QueueState) {
        try {
            const body = state === "PAUSED"
                ? {query: pauseQuery, variables: {queueId: queueId, state: "PAUSED"}}
                : state === "DELETED"
                ? {query: deleteQuery, variables: {queueId: queueId}}
                : {error: "error"}  // Trigger error if state is not PAUSED or DELETED
            fetch(baseURL(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': corsURL(),
                },
                credentials: 'include',
                body: JSON.stringify(body)
            }).then(response => response.json()).then(data => {})
        } catch(error) {
            // enter your logic for when there is an error (ex. error toast)
            console.log(error)
        }
    }

    const onChangeQueueState = (queueState: QueueState) => {
        if (queueState === "DELETED"){
            props.setShowConfirmDeleteAlert(
                {
                    show: true,
                    callback: () => {
                        props.setEntities(
                            [...props.entities.filter(queue => !selectedItems.includes(queue.queueId))]
                        )
                        for (const selectedItem of selectedItems) {
                            props.entities.find(user => user.queueId === selectedItem)!.state = queueState
                            changeQueueState(selectedItem, queueState).then()
                        }
                    }
                }
            )
        } else if (queueState === "PAUSED") {
            setPaused(!paused)
            deSelectItems()
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
        navigation.navigate("QueueDashboard", {queueId: item.queueId})
    }

    const getSelected = (item: QueueInfo) => selectedItems.includes(item.queueId)

    const deSelectItems = () => {
        setSelectedItems([])
        setQueueState("ACTIVE")
        navigation.setOptions({headerRight: undefined})
    }

    const selectItems = (item: QueueInfo) => {
        navigation.setOptions(
            {headerRight: (props) => <QueueMultiSelectButtons onActionPress={setQueueState} /> }
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
                <View style={styles.container}>
                    <Text style={styles.queuesHeading}>
                        {t("your_queues")}
                    </Text>
                    <ConditionalWrapper
                        condition={selectedItems.length}
                        wrapper={(children: Children) => <Pressable
                                                             onPress={() => deSelectItems()}
                                                             style={{flex: 1, padding: 15}}
                                                         >
                                                             {children}
                                                         </Pressable>}
                    >
                        <ScrollView
                            // Not defining the dimensions of the ScrollView makes it default to the whole page
                            // maxW={scale(width / 2)}
                            // h={scale(height / 3.5)}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
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
                                        showConfirmDeleteAlert={props.showConfirmDeleteAlert}
                                        setShowConfirmDeleteAlert={props.setShowConfirmDeleteAlert}
                                        entity={item}/>
                                    }
                                }
                            />
                        </ScrollView>
                    </ConditionalWrapper>
                </View>
            </Center>
        )
    }


const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start"
    },
    queuesHeading: {
        flex: 1,
        fontSize: 24
    }
})
