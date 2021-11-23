import React, { useState } from 'react'
import { Button, Menu, Pressable, HamburgerIcon } from 'native-base';
import {useNavigation} from "@react-navigation/native";
import {HomeScreenProps} from "../../types";

export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const [queuePaused, toggleQueuePaused] = useState<boolean>(false)

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

    return (
        <Menu w="190" trigger={(triggerProps) => { return (
                        <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                            <HamburgerIcon />
                        </Pressable>
                        )
                    }}
                >
            <Menu.Item>Edit Queue</Menu.Item>
            <Menu.Item onPress={() => navigation.navigate("EndScreen")}>End Queue</Menu.Item>
            <Menu.Item onPress={() => pauseQueue}>Pause Queue</Menu.Item>
            <Menu.Item>Announcement</Menu.Item>
            <Menu.Item onPress={() => navigation.navigate("ShareScreen")}>Share Queue</Menu.Item>
        </Menu>
    )
}



