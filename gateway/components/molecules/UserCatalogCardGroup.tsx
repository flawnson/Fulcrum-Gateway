import React, { useState, useEffect } from 'react';
import { Center } from "native-base";
import { FlatList } from "react-native-gesture-handler"
import { StyleSheet, Pressable, PressableStateCallbackType} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {UserStats, UserStatus, HomeScreenProps} from "../../types";
import UserCatalogCard from "../atoms/UserCatalogCard";
import CatalogCardMultiSelectButtons from "../../containers/CatalogCardMultiSelectButtons"
import NothingToSeeScreen from "../../screens/NothingToSeeScreen";


type UserCatalogCardProps = {
    entities: Array<UserStats>
    setEntities: React.Dispatch<React.SetStateAction<UserStats[]>>
    showConfirmDeleteAlert?: {show: boolean, callback: Function},
    setShowConfirmDeleteAlert?: React.Dispatch<React.SetStateAction<any>>
}
type Children = (boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | ((state: PressableStateCallbackType) => React.ReactNode) | null | undefined)
type ConditionalWrapperArgs = {
    condition: number | boolean,  // Uses 0 as false and any other number as true
    wrapper: (children: Children) => any
    children: any
}

export default function (props: UserCatalogCardProps) {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const parentNavigation = navigation.getParent()
    const [userStatus, setUserStatus] = useState<UserStatus | "SUMMONED">("ENQUEUED")
    const [selectedItems, setSelectedItems] = useState<Array<UserStats["userId"]>>([])

    useEffect(() => {
        onChangeUserStatus(userStatus)
    }, [userStatus])

    const summonUserQuery = `
        mutation toggle_summon_user($userId: String!, $summoned: Boolean!) {
            toggleSummon(userId: $userId, summoned: $summoned) {
                ... on User {
                    id
                    summoned
                }
                ... on Error {
                    error
                }
            }
        }
    `

    const changeStatusQuery = `
        mutation change_status($userId: String!, $status: String!) {
            changeStatus(userId: $userId status: $status) {
                ... on User {
                    id
                }
                ... on Error {
                    error
                }
            }
        }
    `

    async function changeQueueState (userId: UserStats["userId"], status: UserStatus | "SUMMONED") {
        try {
            const body = status === "KICKED"
                ? {query: changeStatusQuery, variables: {userId: userId, status: "KICKED"}}
                : status === "SERVICED"
                ? {query: changeStatusQuery, variables: {userId: userId, status: "SERVICED"}}
                : status === "SUMMONED"
                ? {query: summonUserQuery, variables: {userId: userId, summoned: true}}
                : {error: "error"}
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

    const onChangeUserStatus = (queueState: UserStatus | "SUMMONED") => {
        if (queueState === "KICKED"){
            props.setShowConfirmDeleteAlert ?
            props.setShowConfirmDeleteAlert(
                {
                    show: true,
                    callback: () => {
                        props.setEntities(
                            [...props.entities.filter(queue => !selectedItems.includes(queue.userId))]
                        )
                        for (const selectedItem of selectedItems) {
                            props.entities.find(user => user.userId === selectedItem)!.status = queueState
                            changeQueueState(selectedItem, queueState).then()
                        }
                    }
                }
            ) : null
        } else if (queueState === "SERVICED") {
            props.setEntities(
                [...props.entities.filter(queue => !selectedItems.includes(queue.userId))]
            )
            for (const selectedItem of selectedItems) {
                props.entities.find(user => user.userId === selectedItem)!.status = queueState
                changeQueueState(selectedItem, queueState).then()
            }
            deSelectItems()
        }
    }

    // To remove header when organizer deselects all users
    useEffect(() => {
        if (selectedItems.length === 0) {
            if (parentNavigation) {
                parentNavigation.setOptions({headerRight: undefined})
            }
        }
    }, [selectedItems])

    const handleOnPress = (item: UserStats) => {
        if (selectedItems.length) {
            return selectItems(item)
        }

        // here you can add you code what do you want if user just do single tap
    }

    const getSelected = (item: UserStats) => selectedItems.includes(item.userId)

    const deSelectItems = () => {
        setUserStatus("ENQUEUED")
        setSelectedItems([])
        navigation.setOptions({headerRight: undefined})
    }

    const selectItems = (item: UserStats) => {
        if (parentNavigation) {
            parentNavigation.setOptions({
                headerRight: () => <CatalogCardMultiSelectButtons onActionPress={setUserStatus}/>
            })
        }

        if (selectedItems.includes(item.userId)) {
            const newListItems = selectedItems.filter(
                (listItem: UserStats["userId"]) => listItem !== item.userId,
            )
            return setSelectedItems([...newListItems])
        }
        setSelectedItems([...selectedItems, item.userId])
    }

    const ConditionalWrapper = ({condition, wrapper, children}: ConditionalWrapperArgs) =>
        condition ? wrapper(children) : children;

    return (
        props.entities.length === 0 ? <NothingToSeeScreen /> :
        <Center>
            <ConditionalWrapper
                condition={selectedItems.length}
                wrapper={(children: Children) =>
                    <Pressable onPress={() => deSelectItems()} style={{flex: 1, padding: 15}} >
                        {children}
                    </Pressable>}
            >
                <FlatList
                    data={props.entities}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}: {item: UserStats}) => {
                        return <UserCatalogCard
                                    entities={props.entities}
                                    setEntities={props.setEntities}
                                    onPress={() => handleOnPress(item)}
                                    onLongPress={() => selectItems(item)}
                                    deSelectItems={() => deSelectItems()}
                                    selected={getSelected(item)}
                                    showConfirmDeleteAlert={props.showConfirmDeleteAlert}
                                    setShowConfirmDeleteAlert={props.setShowConfirmDeleteAlert}
                                    entity={item}/>
                        }
                    }
                />
            </ConditionalWrapper>
        </Center>
    )
}

