import React, { useState } from 'react'
import { Button, Menu, Pressable, HamburgerIcon, Fab } from 'native-base';
import { useNavigation } from "@react-navigation/native";
import { HomeScreenProps } from "../types";
import DeferPositionModal from "./DeferPositionModal";
import LeaveQueueAlert from "./LeaveQueueAlert";
import { useTranslation } from "react-i18next";

export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const { t, i18n } = useTranslation(["userDashboardMenu"]);
    const [deferModalVisible, setDeferModalVisible] = React.useState(false)
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

    const onLeaveQueuePress = () => {
        setIsAlertOpen(true)
        leaveQueue()
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
                <Menu.Item onPress={() => setDeferModalVisible(true)}>{t("defer")}</Menu.Item>
                <Menu.Item onPress={() => setIsAlertOpen(true)}>{t("leave")}</Menu.Item>
                <Menu.Item onPress={() => navigation.navigate("ShareScreen")}>{t("share")}</Menu.Item>
            </Menu>
            <DeferPositionModal modalVisible={deferModalVisible} setModalVisible={setDeferModalVisible}/>
            <LeaveQueueAlert isAlertOpen={isAlertOpen} setIsAlertOpen={setIsAlertOpen}/>
        </>
    )
}



