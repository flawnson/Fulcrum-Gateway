import React, { useEffect, useState } from 'react'
import { HStack, Menu, Divider, Fab, HamburgerIcon, Text } from 'native-base';
import {useNavigation, useRoute, StackActions, useIsFocused} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {HomeScreenProps, ShareData} from "../types";
import CreateUserModal from "./CreateUserModal"
import { useTranslation } from "react-i18next";
import {AuthContext} from "../utilities/AuthContext";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { PreferencesContext } from "../utilities/PreferencesContext";
import EndQueueAlert from "./EndQueueAlert";
import GeneralErrorAlert from "../components/atoms/GeneralErrorAlert";

export default function () {
    const route = useRoute<HomeScreenProps["route"]>();  // Don't need this but if I want to pass config or params...
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const { auth, setAuth } = React.useContext(AuthContext)
    const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext)
    const { t, i18n } = useTranslation(["queueDashboardMenu"]);
    const [queuePaused, toggleQueuePaused] = useState<boolean>(false)
    const [showCreateUserModal, setShowCreateUserModal] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = React.useState(false)
    const [errors, setError] = useState<any>([]);
    const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false)
    // Share data defined and fetched at this level to avoid rerender hell in ShareScreen image component
    const [shareData, setShareData] = useState<ShareData>({currentQueueName: "Bob's burgers",
                                                                    currentQueueQR: 'Image address',
                                                                    currentQueueJoinCode: "1234567890"})
    useEffect(() => {if (!!errors.length) {setShowErrorAlert(true)}}, [errors])  // Render alert if errors

    useEffect(() => {
        fetchShareData().then()
    }, [])

    const organizerQuery = `
        query get_queue_stats ($queueId: String){
            getQueue(queueId: $queueId) {
                ... on Queue {
                    name
                    joinCode: join_code
                }
                ... on Error {
                    error
                }
            }
        }
    `

    const assistantQuery = `
        query get_queue_stats {
            getQueue {
                ... on Queue {
                    name
                    joinCode: join_code
                }
                ... on Error {
                    error
                }
            }
        }
    `

    const query = auth === "ORGANIZER" ? organizerQuery :
                  auth === "ASSISTANT" ? assistantQuery :
                  {null: null}
    // @ts-ignore
    const variables = auth === "ORGANIZER" ? {queueId: route.params!["queueId"]} : null

    const fetchShareData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:19006/',
                },
                credentials: 'include',
                body: JSON.stringify({query: query, variables: variables})
            })
            await response.json().then(
                data => {
                    if (!!data.errors?.length) {
                        // Check for errors on response
                        setError(data.errors[0])
                    } else {
                        data = data.data.getQueue
                        setShareData({
                                ...shareData,
                                "currentQueueName": data.name,
                                "currentQueueQR": `http://localhost:8080/api/${data.joinCode}`,
                                "currentQueueJoinCode": data.joinCode
                            }
                        )
                    }
                }
            )
        } catch (error) {
            setError([...errors, error])
        }
    }

    async function setQueuePaused () {
        try {
            const response = await fetch('http://localhost:8080/api')
            return await response.json()
        } catch(error) {
            return error
        }
    }

    const pauseQueue = () => {
        toggleQueuePaused(!queuePaused)
        setQueuePaused().then()
    }

    const logoutQuery = `
        mutation logout_organizer {
            logoutOrganizer
        }
    `

    const logout = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:19006/',
                },
                credentials: 'include',
                body: JSON.stringify({query: logoutQuery})
            });
            // enter you logic when the fetch is successful
            return await response.json().then(data => {
                    // Check for errors on response
                    if (!!data.errors?.length) {
                        setError(data.errors[0])
                    } else {
                        setAuth("NONE")
                        AsyncStorage.clear().then()
                        navigation.reset({index: 1, routes: [{name: "HomePage"}]})
                        StackActions.popToTop() && navigation.navigate("HomePage")
                    }
                }
            )
        } catch(error) {
            setError([...errors, error])
        }
    }

    function onLogoutPress () {
        logout().then()
    }

    return (
        <>
            <Menu
                w="190"
                trigger={(triggerProps) => {
                    return (
                        <Fab
                            position="absolute"
                            size='sm'
                            icon={<HamburgerIcon size="sm" />}
                            {...triggerProps}
                            style={{bottom: "7%", right: "3%"}}
                            renderInPortal={useIsFocused()}  // So that the FAB only renders when screen is focused
                        />
                    )
                }}
            >
                <Menu.Group title="Assistants">
                    <Menu.Item onPress={() => setShowCreateUserModal(true)}>
                        <HStack space={3}>
                            <Ionicons
                                name={'person-add'}
                                size={20}
                                color={isThemeDark ? 'white': 'black'}
                            />
                            <Text>
                                {t("create_user")}
                            </Text>
                        </HStack>
                    </Menu.Item>
                    <Menu.Item onPress={() => pauseQueue()}>
                        <HStack space={3}>
                            <MaterialCommunityIcons
                                name={'pause-circle'}
                                size={20}
                                color={isThemeDark ? 'white': 'black'}
                            />
                            <Text>
                                {t("pause_queue")}
                            </Text>
                        </HStack>
                    </Menu.Item>
                    <Menu.Item onPress={() => navigation.navigate("ShareScreen", {shareData: shareData})}>
                        <HStack space={3}>
                            <MaterialCommunityIcons
                                name={'share-variant'}
                                size={20}
                                color={isThemeDark ? 'white': 'black'}
                            />
                            <Text>
                                {t("share_queue")}
                            </Text>
                        </HStack>
                    </Menu.Item>
                    <Menu.Item onPress={() => onLogoutPress()}>
                        <HStack space={3}>
                            <MaterialCommunityIcons
                                name={'logout-variant'}
                                size={20}
                                color={isThemeDark ? 'white': 'black'}
                            />
                            <Text>
                                {t("logout_queue")}
                            </Text>
                        </HStack>
                    </Menu.Item>
                </Menu.Group>
                <Divider mt="3" w="100%" />
                <Menu.Group title="Organizers">
                    {/*Can only end (delete queue) if user is an organizer*/}
                    <Menu.Item isDisabled={auth !== "ORGANIZER"} onPress={() => setIsAlertOpen(true)}>
                        <HStack space={3}>
                            <Ionicons
                                name={'close-circle'}
                                size={20}
                                color={isThemeDark ? 'white': 'black'}
                            />
                            <Text style={auth !== "ORGANIZER" ? {color: "grey.400"} : {}}>
                                {t("end_queue")}
                            </Text>
                        </HStack>
                    </Menu.Item>
                    {/*Can only change queue password if you're the organizer*/}
                    <Menu.Item isDisabled={auth !== "ORGANIZER"} onPress={() => setIsAlertOpen(true)}>
                        <HStack space={3}>
                            <Ionicons
                                name={'close-circle'}
                                size={20}
                                color={isThemeDark ? 'white': 'black'}
                            />
                            <Text style={auth !== "ORGANIZER" ? {color: "grey.400"} : {}}>
                                {t("change_password")}
                            </Text>
                        </HStack>
                    </Menu.Item>
                </Menu.Group>
            </Menu>
            <CreateUserModal showModal={showCreateUserModal}
                            setShowModal={setShowCreateUserModal}
                            navigation={navigation}/>
            <EndQueueAlert
                isAlertOpen={isAlertOpen}
                setIsAlertOpen={setIsAlertOpen}
            />
            <GeneralErrorAlert
                showAlert={showErrorAlert}
                setShowAlert={setShowErrorAlert}
                message={t(!errors.length ? "cannot_fetch_share_data_message" : errors[0])} // Render default message
            />
        </>
    )
}
