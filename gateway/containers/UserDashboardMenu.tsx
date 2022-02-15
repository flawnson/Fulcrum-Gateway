import React, {useEffect, useState} from 'react'
import { Text, Menu,
        HamburgerIcon, Fab,
        HStack } from 'native-base';
import {useIsFocused, useNavigation} from "@react-navigation/native";
import { HomeScreenProps, ShareData } from "../types";
import DeferPositionModal from "./DeferPositionModal";
import LeaveQueueAlert from "./LeaveQueueAlert";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { PreferencesContext } from "../utilities/PreferencesContext";
import {AuthContext} from "../utilities/AuthContext";

export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext)
    const { t, i18n } = useTranslation(["userDashboardMenu"]);
    const [showDeferPositionModal, setShowDeferPositionModal] = React.useState(false)
    const [isAlertOpen, setIsAlertOpen] = React.useState(false)
    const [errors, setError] = useState<any>([]);
    const [shareData, setShareData] = useState<ShareData>({currentQueueName: "Bob's burgers",
                                                                    currentQueueQR: 'Image address',
                                                                    currentQueueJoinCode: "1234567890"})
    const {auth} = React.useContext(AuthContext)
    console.log(auth)

    useEffect(() => {
        fetchShareData().then()
    }, [])

    const query = `
      query get_queue_stats {
          getQueue {
              ... on Queue {
                  name
                  joinCode: join_code
              }
              ... on Error {
                  error
              }
          }
      }
    `

    const fetchShareData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:19006/',
                },
                credentials: 'include',
                body: JSON.stringify({query: query})
            })
            await response.json().then(
                data => {
                    data = data.getQueue.queue
                    setShareData( {
                            ...shareData,
                            "currentQueueName": data.name,
                            "currentQueueQR": `http://localhost:8080/api/${data.joinCode}`,
                            "currentQueueJoinCode": data.joinCode
                        }
                    )
                }
            )
        } catch (error) {
            setError([...errors, error])
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
                            renderInPortal={useIsFocused()}  // So that the FAB only renders when screen is focused
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
                <Menu.Item onPress={() => navigation.navigate("ShareScreen", {shareData: shareData})}>
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
