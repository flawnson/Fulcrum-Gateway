import React, { useState } from 'react'
import { Button, Menu, Pressable, HamburgerIcon } from 'native-base';
import {useNavigation} from "@react-navigation/native";
import {HomeScreenProps} from "../../types";

export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead

    return (
        <Menu w="190" trigger={(triggerProps) => { return (
                        <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                        <HamburgerIcon />
                        </Pressable>
                        )
                    }}
                >
            <Menu.Item>End Queue</Menu.Item>
            <Menu.Item onPress={() => navigation.navigate("AbandonedScreen")}>Pause Queue</Menu.Item>
            <Menu.Item>Announcement</Menu.Item>
            <Menu.Item onPress={() => navigation.navigate("ShareScreen")}>Share Queue</Menu.Item>
        </Menu>
    )
}



