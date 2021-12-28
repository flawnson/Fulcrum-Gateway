import React, { useState } from 'react'
import { Button, Menu, Pressable, HamburgerIcon, Fab } from 'native-base';
import { useNavigation } from "@react-navigation/native";
import { HomeScreenProps } from "../../types";
import DeferPositionModal from "./DeferPositionModal";
import LeaveQueueAlert from "./LeaveQueueAlert";
import { useTranslation } from "react-i18next";

export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const { t, i18n } = useTranslation(["enqueuedMultiSelectButtons"]);
    const [deferModalVisible, setDeferModalVisible] = React.useState(false)
    const [isAlertOpen, setIsAlertOpen] = React.useState(false)

    function onLeaveQueuePress () {
        setIsAlertOpen(true)
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
                <Menu.Item onPress={onLeaveQueuePress}>{t("leave")}</Menu.Item>
                <Menu.Item onPress={() => navigation.navigate("ShareScreen")}>{t("share")}</Menu.Item>
            </Menu>
            <DeferPositionModal modalVisible={deferModalVisible} setModalVisible={setDeferModalVisible}/>
            <LeaveQueueAlert isAlertOpen={isAlertOpen} setIsAlertOpen={setIsAlertOpen}/>
        </>
    )
}



