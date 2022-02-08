import React, { useEffect, useState } from 'react'
import { HStack, Menu, Fab, HamburgerIcon, Text } from 'native-base';
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {HomeScreenProps, ShareData} from "../types";
import CreateUserModal from "./CreateUserModal"
import { useTranslation } from "react-i18next";
import {AuthContext} from "../utilities/AuthContext";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { PreferencesContext } from "../utilities/PreferencesContext";
import LeaveQueueAlert from "./LeaveQueueAlert";

export default function () {
    const { signedInAs } = React.useContext(AuthContext)
    const route = useRoute<HomeScreenProps["route"]>();  // Don't need this but if I want to pass config or params...
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const { signOut } = React.useContext(AuthContext)
    const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext)
    const { t, i18n } = useTranslation(["queueDashboardMenu"]);
    const [queuePaused, toggleQueuePaused] = useState<boolean>(false)
    const [showCreateUserModal, setShowCreateUserModal] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = React.useState(false)
    const [errors, setError] = useState<any>([]);
    const [shareData, setShareData] = useState<ShareData>({currentQueueName: "Bob's burgers",
                                                                    currentQueueQR: 'Image address',
                                                                    currentQueueJoinCode: "1234567890"})
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

    const query = signedInAs === "ORGANIZER" ? organizerQuery :
                  signedInAs === "ASSISTANT" ? assistantQuery :
                  {null: null}
    // @ts-ignore
    const variables = signedInAs === "ORGANIZER" ? {queueId: route.params!["queueId"]} : null

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
                    data = data.data.getQueue
                    setShareData( {
                            ...shareData,
                            "currentQueueName": data.name,
                            "currentQueueQR": `http://localhost:8080/api/${data.joinCode}`,
                            "currentQueueJoinCode": data.joinCode
                        }
                    )
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
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({query: logoutQuery})
            });
            // enter you logic when the fetch is successful
            return await response.json()
        } catch(error) {
            console.log(error)
        }
    }

    function onLogoutPress () {
        signOut()
        logout().then()
        AsyncStorage.clear().then()
        navigation.navigate("EndScreen")
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
                        />
                    )
                }}
            >
                <Menu.Item onPress={() => setShowCreateUserModal(true)}>
                    <HStack space={3}>
                        <Ionicons
                            name={'person-add'}
                            size={20}
                            color={isThemeDark ? 'white': 'black'}
                        />
                        <Text>
                            {t("create")}
                        </Text>
                    </HStack>
                </Menu.Item>
                <Menu.Item isDisabled={signedInAs === "ORGANIZER"} onPress={() => setIsAlertOpen(true)}>
                    <HStack space={3}>
                        <Ionicons
                            name={'close-circle'}
                            size={20}
                            color={isThemeDark ? 'white': 'black'}
                        />
                        <Text>
                            {t("end")}
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
                            {t("pause")}
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
                            {t("share")}
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
                            {t("logout")}
                        </Text>
                    </HStack>
                </Menu.Item>
            </Menu>
            <CreateUserModal showModal={showCreateUserModal}
                            setShowModal={setShowCreateUserModal}
                            navigation={navigation}/>
            <LeaveQueueAlert
                isAlertOpen={isAlertOpen}
                setIsAlertOpen={setIsAlertOpen}
            />
        </>
    )
}
