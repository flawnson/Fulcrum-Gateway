import React, { SetStateAction, useState } from 'react'
import { Button, Menu, Fab, HamburgerIcon, Alert } from 'native-base';
import { useNavigation, useRoute } from "@react-navigation/native";
import { HomeScreenProps } from "../../types";
import EditQueueModal from "./EditQueueModal";
import { useTranslation } from "react-i18next";

export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const { t, i18n } = useTranslation(["queueDashboardMenu"]);
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

    const query = `
        mutation deleteQueue($id: String!) {
            deleteQueue(id: $id) {
            id
            }
        }
    `
    const variables = `{
    "queue_id": {
            "id": "costco_queue1"
        }
    }`

    const deleteQueue = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api?query=${query}&variables=${variables}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            // enter you logic when the fetch is successful
            return await response.json()
        } catch(error) {
            console.log(error)
        }
    }

    function onEndScreenPress () {
        deleteQueue()
        navigation.navigate("EndScreen")
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
                <Menu.Item onPress={() => setShowModal(!showModal)}>{t("edit")}</Menu.Item>
                <Menu.Item onPress={() => onEndScreenPress}>{t("end")}</Menu.Item>
                <Menu.Item onPress={() => pauseQueue}>{t("pause")}</Menu.Item>
                <Menu.Item onPress={() => navigation.navigate("ShareScreen")}>{t("share")}</Menu.Item>
            </Menu>
            <EditQueueModal showModal={showModal} setShowModal={setShowModal} route={route} navigation={navigation}/>
        </>
    )
}



