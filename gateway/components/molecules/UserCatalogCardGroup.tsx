import React, { useState, useEffect } from 'react';
import {Center, useToast} from "native-base";
import { FlatList } from "react-native-gesture-handler"
import { StyleSheet, Pressable, PressableStateCallbackType} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {UserStats, UserStatus, HomeScreenProps} from "../../types";
import UserCatalogCard from "../atoms/UserCatalogCard";
import CatalogCardMultiSelectButtons from "../organisms/CatalogCardMultiSelectButtons"
import NothingToSeeScreen from "../../screens/NothingToSeeScreen";
import baseURL from "../../utilities/baseURL";
import corsURL from "../../utilities/corsURL";
import {useTranslation} from "react-i18next";
import _ from 'lodash'


type UserCatalogCardProps = {
    entities: Array<UserStats>
    setEntities: React.Dispatch<React.SetStateAction<UserStats[]>>
    showConfirmActionAlert?: {show: boolean, callback: Function},
    setShowConfirmActionAlert?: React.Dispatch<React.SetStateAction<any>>
}
type Children = (boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | ((state: PressableStateCallbackType) => React.ReactNode) | null | undefined)
type ConditionalWrapperArgs = {
    condition: number | boolean,  // Uses 0 as false and any other number as true
    wrapper: (children: Children) => any
    children: any
}

const UserCatalogCardGroup = (props: UserCatalogCardProps) => {
    const { t } = useTranslation(["userCatalogCardGroup"]);
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const parentNavigation = navigation.getParent()
    const [userStatus, setUserStatus] = useState<UserStatus | "SUMMONED">("ENQUEUED")
    const [selectedItems, setSelectedItems] = useState<Array<UserStats["userId"]>>([])
    const [errors, setError] = useState<any>([]);
    const toast = useToast()
    const toastId = "errorToast"

    useEffect(() => {
        if (!!errors.length) {
            if (!toast.isActive(toastId)) {
                toast.show({
                    id: toastId,
                    title: t('something_went_wrong', {ns: "common"}),
                    status: "error",
                    description: t("cannot_change_status_message"),
                    duration: 10
                })
            }
        }
    }, [errors])  // Render alert if errors

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

    async function changeUserStatus (userId: UserStats["userId"], status: UserStatus | "SUMMONED") {
        try {
            const body = status === "KICKED"
                ? {query: changeStatusQuery, variables: {userId: userId, status: "KICKED"}}
                : status === "SERVICED"
                ? {query: changeStatusQuery, variables: {userId: userId, status: "SERVICED"}}
                : status === "SUMMONED"
                ? {query: summonUserQuery, variables: {userId: userId, summoned: true}}
                : {error: "error"}
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
            setError([...errors, error])
        }
    }

    const onChangeUserStatus = (queueState: UserStatus | "SUMMONED") => {
        if (queueState === "KICKED"){
            props.setShowConfirmActionAlert ?
            props.setShowConfirmActionAlert(
                {
                    show: true,
                    callback: () => {
                        props.setEntities(
                            [...props.entities.filter(queue => !selectedItems.includes(queue.userId))]
                        )
                        for (const selectedItem of selectedItems) {
                            props.entities.find(user => user.userId === selectedItem)!.status = queueState
                            changeUserStatus(selectedItem, queueState).then()
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
                changeUserStatus(selectedItem, queueState).then()
            }
        } else if (queueState === "SUMMONED") {
            // Figure out logic for batch toggle summon
        }
        deSelectItems()  // Deselect Items after removing cards
    }

    // To remove header when organizer deselects all users
    useEffect(() => {
        if (selectedItems.length === 0) {
            if (parentNavigation) {
                // For when used in a standalone page
                parentNavigation.setOptions({headerRight: undefined})
            } else {
                // For when used as a component within a page, like in Queue Dashboard
                navigation.setOptions({headerRight: undefined})
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
            // For when used in a standalone page
            parentNavigation.setOptions({
                headerRight: () => <CatalogCardMultiSelectButtons onActionPress={setUserStatus}/>
            })
        } else {
            // For when used as a component within a page, like in Queue Dashboard
            navigation.setOptions({
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
                            showConfirmActionAlert={props.showConfirmActionAlert}
                            setShowConfirmActionAlert={props.setShowConfirmActionAlert}
                            entity={item}/>
                        }
                    }
                />
            </ConditionalWrapper>
        </Center>
    )
}



export default React.memo(UserCatalogCardGroup, (prevProps, nextProps) => _.isEqual(prevProps, nextProps))


