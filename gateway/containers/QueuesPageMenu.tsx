import React, { useEffect, useState } from 'react'
import {HStack, Menu, Divider, Fab, HamburgerIcon, Text, useToast} from 'native-base';
import {useNavigation, useRoute, StackActions, useIsFocused} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {HomeScreenProps, ShareData} from "../types";
import { useTranslation } from "react-i18next";
import {AuthContext} from "../utilities/AuthContext";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { PreferencesContext } from "../utilities/PreferencesContext";
import baseURL from "../utilities/baseURL";
import corsURL from "../utilities/corsURL";
import CreateQueueModal from "./CreateQueueModal";

export default function () {
    const { t } = useTranslation(["queuesPageMenu"]);
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const { signedInAs } = React.useContext(AuthContext)
    const { signOut } = React.useContext(AuthContext)
    const { isThemeDark } = React.useContext(PreferencesContext)
    const [showCreateQueueModal, setShowCreateQueueModal] = useState<boolean>(false);
    const [errors, setError] = useState<any>([]);
    const toast = useToast()

    useEffect(() => {
        if (!!errors.length) {
            toast.show({
                title: t('something_went_wrong', {ns: "common"}),
                status: "error",
                description: t(!errors.length ? "cannot_fetch_share_data_message" : errors[0])
            })
        }
    }, [errors])  // Render alert if errors

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
            fetch(baseURL(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': corsURL(),
                },
                credentials: 'include',
                body: JSON.stringify({query: signedInAs === "ORGANIZER" ? organizerLogoutQuery : assistantLogoutQuery})
            }).then(response => response.json()).then(data => {
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
                <Menu.Item onPress={() => setShowCreateQueueModal(!showCreateQueueModal)}>
                    <HStack space={3}>
                        <Ionicons
                            name={'person-add'}
                            size={20}
                            color={isThemeDark ? 'white': 'black'}
                        />
                        <Text>
                            {t("create_queue")}
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
            </Menu>
            <CreateQueueModal
                showModal={showCreateQueueModal}
                setShowModal={setShowCreateQueueModal}
            />
        </>
    )
}
