import React, { useState } from 'react'
import { Text, Menu,
        HamburgerIcon, Fab,
        HStack } from 'native-base';
import { useNavigation } from "@react-navigation/native";
import { HomeScreenProps } from "../types";
import DeferPositionModal from "./DeferPositionModal";
import LeaveQueueAlert from "./LeaveQueueAlert";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { PreferencesContext } from "../utilities/useTheme";

export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext)
    const { t, i18n } = useTranslation(["userDashboardMenu"]);
    const [showDeferPositionModal, setShowDeferPositionModal] = React.useState(false)
    const [isAlertOpen, setIsAlertOpen] = React.useState(false)

    const query = `
        mutation change_status($status: String!) {
            changeStatus(status: $status) {
                id
            }
        }
    `
    const variables = `{
        "status": "ABANDONED"
    }`

    async function leaveQueue () {
        try {
            const response = await fetch(`http://localhost:8080/api`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({query: query, variables: variables})
            });
            return await response.json()
        } catch(error) {
            return error
        }
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
                        />
                    )
                }}
            >
                <Menu.Item onPress={() => setShowDeferPositionModal(true)}>
                    <HStack space={3}>
                        <MaterialCommunityIcons
                            name={'account-switch'}
                            size={20}
                            color={isThemeDark ? 'white': 'black'}
                        />
                        <Text>
                            {t("defer")}
                        </Text>
                    </HStack>
                </Menu.Item>
                <Menu.Item onPress={() => setIsAlertOpen(true)}>
                    <HStack space={3}>
                        <Ionicons
                            name={'md-exit-outline'}
                            size={20}
                            color={isThemeDark ? 'white': 'black'}
                        />
                        <Text>
                            {t("leave")}
                        </Text>
                    </HStack>
                </Menu.Item>
                <Menu.Item onPress={() => navigation.navigate("ShareScreen")}>
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
            </Menu>
            <DeferPositionModal showModal={showDeferPositionModal} setShowModal={setShowDeferPositionModal}/>
            <LeaveQueueAlert isAlertOpen={isAlertOpen} setIsAlertOpen={setIsAlertOpen}/>
        </>
    )
}



