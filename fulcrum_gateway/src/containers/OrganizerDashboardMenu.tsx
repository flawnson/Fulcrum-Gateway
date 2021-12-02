import React, { useState } from 'react'
import { Button, Menu, Fab, HamburgerIcon, Alert } from 'native-base';
import {useNavigation, useRoute} from "@react-navigation/native";
import { HomeScreenProps } from "../../types";
import EditQueueModal from "./EditQueueModal";

export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const route = useRoute<HomeScreenProps["route"]>();  // Don't need this but if I want to pass config or params...
    const [queuePaused, toggleQueuePaused] = useState<boolean>(false)
    const [showModal, setShowModal] = useState(false);

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

    function onEndScreenPress () {

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
                <Menu.Item onPress={() => setShowModal(!showModal)}>Edit Queue</Menu.Item>
                <Menu.Item onPress={() => navigation.navigate("EndScreen")}>End Queue</Menu.Item>
                <Menu.Item onPress={() => pauseQueue}>Pause Queue</Menu.Item>
                <Menu.Item>Announcement</Menu.Item>
                <Menu.Item onPress={() => navigation.navigate("ShareScreen")}>Share Queue</Menu.Item>
            </Menu>
            <EditQueueModal showModal={showModal} setShowModal={setShowModal} route={route} navigation={navigation}/>
        </>
    )
}



