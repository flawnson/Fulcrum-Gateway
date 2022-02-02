import React, { SetStateAction, useState } from 'react'
import { HStack, Menu, Fab, HamburgerIcon, Text } from 'native-base';
import { useNavigation, useRoute } from "@react-navigation/native";
import { HomeScreenProps } from "../types";
import EditQueueModal from "./EditQueueModal";
import CreateUserModal from "./CreateUserModal"
import { useTranslation } from "react-i18next";
import { AuthContext } from "../App";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { PreferencesContext } from "../utilities/useTheme";

export default function () {
    const route = useRoute<HomeScreenProps["route"]>();  // Don't need this but if I want to pass config or params...
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const { signOut } = React.useContext(AuthContext)
    const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext)
    const { t, i18n } = useTranslation(["queueDashboardMenu"]);
    const [queuePaused, toggleQueuePaused] = useState<boolean>(false)
    // const [showEditQueueModal, setShowEditQueueModal] = useState(false);
    const [showCreateUserModal, setShowCreateUserModal] = useState(false);

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
        setQueuePaused()
    }

    const deleteQueueQuery = `
        mutation deleteQueue($id: String!) {
            deleteQueue(id: $id) {
            id
            }
        }
    `
    const deleteQueueVariables = `{
    "queue_id": {
            "id": "costco_queue1"
        }
    }`

    const deleteQueue = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({query: deleteQueueQuery, variables: deleteQueueVariables})
            });
            // enter you logic when the fetch is successful
            return await response.json()
        } catch(error) {
            console.log(error)
        }
    }

    function onEndScreenPress () {
        deleteQueue()
        navigation.navigate("EndScreen")
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
                {/*<Menu.Item onPress={() => setShowEditQueueModal(true)}>{t("edit")}</Menu.Item>*/}
                <Menu.Item onPress={() => onEndScreenPress()}>
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
                <Menu.Item onPress={() => navigation.navigate("ShareScreen", {queueId: route.params!["queueId"]})}>
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
            {/*<EditQueueModal showModal={showEditQueueModal}*/}
            {/*                setShowModal={setShowEditQueueModal}*/}
            {/*                navigation={navigation}/>*/}
        </>
    )
}



