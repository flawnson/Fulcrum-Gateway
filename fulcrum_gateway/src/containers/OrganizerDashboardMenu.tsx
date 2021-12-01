import React, {SetStateAction, useState} from 'react'
import { Button, Menu, Fab, HamburgerIcon } from 'native-base';
import {useNavigation, useRoute} from "@react-navigation/native";
import { HomeScreenProps } from "../../types";
import EditQueueModal from "./EditQueueModal";

type OrganizerDashboardMenuProps = {
    showModal: boolean
    setShowModal:  React.Dispatch<React.SetStateAction<boolean>>
}

export default function (props: OrganizerDashboardMenuProps) {
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
            <Menu.Item onPress={() => props.setShowModal(!props.showModal)}>Edit Queue</Menu.Item>
            <Menu.Item onPress={() => navigation.navigate("EndScreen")}>End Queue</Menu.Item>
            <Menu.Item onPress={() => pauseQueue}>Pause Queue</Menu.Item>
            <Menu.Item>Announcement</Menu.Item>
            <Menu.Item onPress={() => navigation.navigate("ShareScreen")}>Share Queue</Menu.Item>
        </Menu>
    )
}



