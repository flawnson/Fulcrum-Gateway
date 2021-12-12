import React, { useState } from 'react'
import {Button, Menu, Pressable, HamburgerIcon, Fab} from 'native-base';
import {useNavigation} from "@react-navigation/native";
import {HomeScreenProps} from "../../types";
import DeferPositionModal from "./DeferPositionModal";
import LeaveQueueAlert from "./LeaveQueueAlert";

export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
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
                <Menu.Item onPress={() => setDeferModalVisible(true)}>Defer Position</Menu.Item>
                <Menu.Item onPress={onLeaveQueuePress}>Leave Queue</Menu.Item>
                <Menu.Item onPress={() => navigation.navigate("ShareScreen")}>Share Queue</Menu.Item>
            </Menu>
            <DeferPositionModal modalVisible={deferModalVisible} setModalVisible={setDeferModalVisible}/>
            <LeaveQueueAlert isAlertOpen={isAlertOpen} setIsAlertOpen={setIsAlertOpen}/>
        </>
    )
}



