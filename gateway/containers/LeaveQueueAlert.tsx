import React from "react"
import { AlertDialog, Button, Center } from "native-base"
import {useNavigation} from "@react-navigation/native";
import {HomeScreenProps} from "../types";
import {useTranslation} from "react-i18next";
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from "../utilities/baseURL";

type LeaveQueueAlertProps = {
    isAlertOpen: boolean,
    setIsAlertOpen: React.Dispatch<React.SetStateAction<boolean>>
}


export default (props: LeaveQueueAlertProps) => {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const { t, i18n } = useTranslation(["leaveQueueAlert", "common"]);

    const onClose = () => {
        props.setIsAlertOpen(false)
    }

    const query = `
        mutation change_status($status: String!) {
            changeStatus(status: $status) {
                ... on User {
                    id
                }
                ... on Error {
                    error
                }
            }
        }
    `
    const variables = `{
        "status": "ABANDONED"
    }`

    async function leaveQueue () {
        try {
            const response = await fetch(baseURL(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:19006/',
                },
                credentials: 'include',
                body: JSON.stringify({query: query, variables: variables})
            });
            return await response.json()
        } catch(error) {
            return error
        }
    }


    const onLeave = () => {
        props.setIsAlertOpen(false)
        AsyncStorage.clear().then()
        leaveQueue().then()
        navigation.reset({index: 1, routes: [{name: "HomePage"}]})
        navigation.navigate("AbandonedScreen")
    }

    const cancelRef = React.useRef(null)
    return (
        <Center>
            <AlertDialog
                leastDestructiveRef={cancelRef}
                isOpen={props.isAlertOpen}
                onClose={() => onClose()}
            >
                <AlertDialog.Content>
                    <AlertDialog.CloseButton />
                    <AlertDialog.Header>{t("header")}</AlertDialog.Header>
                    <AlertDialog.Body>
                        {t("dialog")}
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                        <Button.Group space={2}>
                            <Button
                                variant="unstyled"
                                colorScheme="coolGray"
                                onPress={() => onClose()}
                                ref={cancelRef}
                            >
                                {t("cancel", {ns: "common"})}
                            </Button>
                            <Button colorScheme="danger" onPress={() => onLeave()}>
                                {t("confirm", {ns: "common"})}
                            </Button>
                        </Button.Group>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>
        </Center>
    )
}
