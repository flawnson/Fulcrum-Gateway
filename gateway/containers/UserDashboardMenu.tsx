import React, {useEffect, useState} from 'react'
import { Text, Menu,
        HamburgerIcon, Fab,
        HStack, useToast } from 'native-base';
import {useIsFocused, useNavigation} from "@react-navigation/native";
import { HomeScreenProps, ShareData } from "../types";
import DeferPositionModal from "./DeferPositionModal";
import LeaveQueueAlert from "./LeaveQueueAlert";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { PreferencesContext } from "../utilities/PreferencesContext";
import baseURL from "../utilities/baseURL";
import corsURL from "../utilities/corsURL";

export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const { isThemeDark } = React.useContext(PreferencesContext)
    const { t } = useTranslation(["userDashboardMenu"]);
    const [showDeferPositionModal, setShowDeferPositionModal] = React.useState(false)
    const [isLeaveQueueAlertOpen, setIsLeaveQueueAlertOpen] = React.useState(false)
    const [errors, setErrors] = useState<any>([]);
    const [shareData, setShareData] = useState<ShareData>({currentQueueName: "Bob's burgers",
                                                                    currentQueueId: 'some_id',
                                                                    currentQueueQR: 'Image address',
                                                                    currentQueueJoinCode: "1234567890"})
    const toast = useToast()
    const toastId = "errorToast"

    useEffect(() => {
        if (!!errors.length) {
            if (!toast.isActive(toastId)) {
                toast.show({
                    id: toastId,
                    title: t('something_went_wrong', {ns: "common"}),
                    status: "error",
                    description: t("cannot_fetch_share_data_message"),
                    duration: 10
                })
            }
        }
    }, [errors])  // Render alert if errors

    useEffect(() => {
        fetchShareData().then()
    }, [])

    const query = `
        query get_queue_stats {
            getUser {
                ... on User {
                    queue {
                        queueId: id
                        name
                        joinCode: join_code
                    }
                }
                ... on Error {
                    error
                }
            }
        }
    `

    const fetchShareData = async () => {
        try {
            fetch(baseURL(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': corsURL(),
                },
                credentials: 'include',
                body: JSON.stringify({query: query})
            }).then(response => response.json()).then(data => {
                    if (!!data.errors?.length) {
                        // Check for errors on response
                        setErrors([...errors, data.errors])
                    } else {
                        data = data.data.getUser.queue
                        setShareData( {
                                ...shareData,
                                "currentQueueName": data.name,
                                "currentQueueId": data.queueId,
                                "currentQueueQR": `https://fiefoe.com/${data.joinCode}`,
                                "currentQueueJoinCode": data.joinCode
                            }
                        )
                    }
                }
            )
        } catch (error) {
            setErrors([...errors, error])
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
                <Menu.Item onPress={() => setIsLeaveQueueAlertOpen(true)}>
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
            <LeaveQueueAlert isAlertOpen={isLeaveQueueAlertOpen} setIsAlertOpen={setIsLeaveQueueAlertOpen}/>
        </>
    )
}
