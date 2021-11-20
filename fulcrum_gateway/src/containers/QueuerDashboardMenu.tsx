import React, { useState } from 'react'
import { Button, Menu, Pressable, HamburgerIcon } from 'native-base';
import {useNavigation} from "@react-navigation/native";
import {HomeScreenProps} from "../../types";
import DeferPositionModal from "./DeferPositionModal";

export default function () {
    const [deferModalVisible, setDeferModalVisible] = React.useState(false)
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead

    return (
        <>
            <Menu w="190" trigger={(triggerProps) => { return (
                            <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                                <HamburgerIcon />
                            </Pressable>
                            )
                        }}
                    >
                <Menu.Item onPress={() => setDeferModalVisible(true)}>Defer Position</Menu.Item>
                <Menu.Item onPress={() => navigation.navigate("AbandonedScreen")}>Leave Queue</Menu.Item>
                <Menu.Item>Get Directions</Menu.Item>
                <Menu.Item onPress={() => navigation.navigate("ShareScreen")}>Share Queue</Menu.Item>
            </Menu>
            <DeferPositionModal modalVisible={deferModalVisible} setModalVisible={setDeferModalVisible}/>
        </>
    )
}



