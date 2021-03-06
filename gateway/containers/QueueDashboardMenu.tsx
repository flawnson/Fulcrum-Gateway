import React, { useEffect, useState } from 'react'
import {HStack, Menu, Divider, Fab, HamburgerIcon, Text, useToast} from 'native-base';
import {useNavigation, useRoute, StackActions, useIsFocused} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {HomeScreenProps, QueueState, ShareData} from "../types";
import CreateUserModal from "./CreateUserModal"
import { useTranslation } from "react-i18next";
import {AuthContext} from "../utilities/AuthContext";
import { MaterialCommunityIcons, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { PreferencesContext } from "../utilities/PreferencesContext";
import EndQueueAlert from "./EndQueueAlert";
import ChangeQueuePasswordModal from "./ChangeQueuePasswordModal";
import baseURL from "../utilities/baseURL";
import corsURL from "../utilities/corsURL";


export default function (props: {queueState: QueueState}) {
    const { t } = useTranslation(["queueDashboardMenu"]);
    const route = useRoute<HomeScreenProps["route"]>();  // Don't need this but if I want to pass config or params...
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const { signedInAs } = React.useContext(AuthContext)
    const { signOut } = React.useContext(AuthContext)
    const { isThemeDark } = React.useContext(PreferencesContext)
    const [queueState, setQueueState] = useState<QueueState>(props.queueState)
    const [showCreateUserModal, setShowCreateUserModal] = useState(false);
    const [showChangeQueuePasswordModal, setShowChangeQueuePasswordModal] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = React.useState(false)
    const [errors, setError] = useState<any>([]);
    const toast = useToast()
    // Share data defined and fetched at this level to avoid rerender hell in ShareScreen image component
    const [shareData, setShareData] = useState<ShareData>({currentQueueName: "Bob's burgers",
                                                                    currentQueueId: "",
                                                                    currentQueueQR: 'Image address',
                                                                    currentQueueJoinCode: "1234567890"})

    useEffect(() => {
        if (!!errors.length) {
            toast.show({
                title: t('something_went_wrong', {ns: "common"}),
                status: "error",
                description: t(!errors.length ? "cannot_fetch_share_data_message" : errors[0])
            })
        }
    }, [errors])  // Render alert if errors

    useEffect(() => {
        fetchShareData().then()
    }, [])

    const organizerQuery = `
        query get_queue_stats ($queueId: String){
            getQueue(queueId: $queueId) {
                ... on Queue {
                    queueId: id
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
                    queueId: id
                    name
                    state
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
    const variables = signedInAs === "ORGANIZER" ? {queueId: route.params!["queueId"]} : null

    const fetchShareData = async () => {
        try {
            fetch(baseURL(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': corsURL(),
                },
                credentials: 'include',
                body: JSON.stringify({query: query, variables: variables})
            }).then(response => response.json()).then(data => {
                    if (!!data.errors?.length) {
                        // Check for errors on response
                        setError([...errors, data.errors[0]])
                    } else {
                        data = data.data.getQueue
                        setQueueState(data.state)
                        setShareData({
                                ...shareData,
                                "currentQueueName": data.name,
                                "currentQueueId": data.queueId,
                                "currentQueueQR": `https://fiefoe.com/${data.joinCode}`,
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

    const organizerPauseQuery = `
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

    const assistantPauseQuery = `
        mutation change_queue_state($state: String!) {
            changeQueueState(state: $state) {
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

    const pauseQuery = signedInAs === "ORGANIZER" ? organizerPauseQuery : assistantPauseQuery
    const pauseVariables = signedInAs === "ORGANIZER" ? `{
            "queueId": "${route.params!["queueId"]}",
            "state": "${queueState === "ACTIVE" ? "PAUSED" : "ACTIVE"}"
        }` : `{
            "state": "${queueState === "ACTIVE" ? "PAUSED" : "ACTIVE"}"
        }`

    async function setQueuePaused () {
        try {
            const response = await fetch(baseURL(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': corsURL(),
                },
                credentials: 'include',
                body: JSON.stringify({query: pauseQuery, variables: pauseVariables})
            })
            return await response.json()
        } catch(error) {
            return error
        }
    }

    const pauseQueue = () => {
        // If queue state is active, set to paused and vice versa
        setQueueState(queueState === "ACTIVE" ? "PAUSED" : "ACTIVE")
        setQueuePaused().then()
    }

    const organizerLogoutQuery = `
        mutation logout_organizer {
            logoutOrganizer
        }
    `

    const assistantLogoutQuery = `
        mutation logout_queue {
            logoutQueue
        }
    `

    const logout = async () => {
        try {
            const response = await fetch(baseURL(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': corsURL(),
                },
                credentials: 'include',
                body: JSON.stringify({query: signedInAs === "ORGANIZER" ? organizerLogoutQuery : assistantLogoutQuery})
            });
            // enter you logic when the fetch is successful
            return await response.json().then(data => {
                    // Check for errors on response
                    if (!!data.errors?.length) {
                        setError(data.errors[0])
                    } else {
                        signOut()
                        navigation.reset({index: 1, routes: [{name: "HomePage"}]})
                        StackActions.popToTop() && navigation.navigate("HomePage")
                        AsyncStorage.clear().then()
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
                            name={queueState === "ACTIVE" ? 'pause-circle' : 'play-circle'}
                            size={20}
                            color={isThemeDark ? 'white': 'black'}
                        />
                        <Text>
                            {queueState === "ACTIVE" ? t("pause_queue") : t("unpause_queue")}
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
                {signedInAs === "ORGANIZER" ?
                    <Menu.Item isDisabled={signedInAs !== "ORGANIZER"} onPress={() => setShowChangeQueuePasswordModal(true)}>
                        <HStack space={3}>
                            <MaterialCommunityIcons
                                name={'form-textbox-password'}
                                size={20}
                                color={isThemeDark ? 'white' : 'black'}
                            />
                            <Text color={isThemeDark ? 'white' : 'black'}>
                                {t("change_password")}
                            </Text>
                        </HStack>
                    </Menu.Item>
                    : <></>}
                <Divider mt="3" w="100%" />
                {signedInAs === "ORGANIZER" ?
                    <Menu.Item isDisabled={signedInAs !== "ORGANIZER"} onPress={() => setIsAlertOpen(true)}>
                        <HStack space={3}>
                            <MaterialIcons
                                name={'delete-forever'}
                                size={20}
                                color={isThemeDark ? 'white' : 'black'}
                            />
                            <Text color={isThemeDark ? 'white' : 'black'}>
                                {t("delete_queue")}
                            </Text>
                        </HStack>
                    </Menu.Item>
                : <></>}
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
            </Menu>
            <CreateUserModal
                queueId={shareData.currentQueueId}
                joinCode={shareData.currentQueueJoinCode}
                navigation={navigation}
                showModal={showCreateUserModal}
                setShowModal={setShowCreateUserModal}
            />
            <ChangeQueuePasswordModal showModal={showChangeQueuePasswordModal}
                                      setShowModal={setShowChangeQueuePasswordModal}
            />
            <EndQueueAlert
                isAlertOpen={isAlertOpen}
                setIsAlertOpen={setIsAlertOpen}
            />
        </>
    )
}
