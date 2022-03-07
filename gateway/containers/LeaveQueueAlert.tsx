import React, {useEffect, useState} from "react"
import {AlertDialog, Button, Center, useToast} from "native-base"
import {useNavigation} from "@react-navigation/native";
import {HomeScreenProps} from "../types";
import {useTranslation} from "react-i18next";
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from "../utilities/baseURL";
import corsURL from "../utilities/corsURL";
import {AuthContext} from "../utilities/AuthContext";

type LeaveQueueAlertProps = {
    isAlertOpen: boolean,
    setIsAlertOpen: React.Dispatch<React.SetStateAction<boolean>>
}


export default (props: LeaveQueueAlertProps) => {
    const { t } = useTranslation(["leaveQueueAlert", "common"]);
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const [errors, setError] = useState<any>([]);
    const { signOut } = React.useContext(AuthContext)
    const toast = useToast()

    useEffect(() => {
        if (!!errors.length) {
            toast.show({
                title: t('something_went_wrong', {ns: "common"}),
                status: "error",
                description: t("cannot_leave_queue_message")
            })
        }
    }, [errors])  // Render alert if errors

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
            fetch(baseURL(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': corsURL(),
                },
                credentials: 'include',
                body: JSON.stringify({query: query, variables: variables})
            }).then(response => response.json()).then(data => {
                    if (!!data.errors?.length) {
                        setError([...errors, data.errors[0]])
                    } else {
                        signOut()
                        navigation.reset({index: 0, routes: [{name: "AbandonedScreen"}]})
                        AsyncStorage.clear().then()
                    }
                }
            )
        } catch(error) {
            setError([...errors, error])
        }
    }

    const onLeave = () => {
        props.setIsAlertOpen(false)
        leaveQueue().then()
    }

    const onClose = () => {
        props.setIsAlertOpen(false)
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
