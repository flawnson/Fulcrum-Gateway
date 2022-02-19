import React, {useEffect, useState} from "react"
import { AlertDialog, Button, Center } from "native-base"
import {useNavigation} from "@react-navigation/native";
import {HomeScreenProps} from "../types";
import {useTranslation} from "react-i18next";
import AsyncStorage from '@react-native-async-storage/async-storage';
import GeneralErrorAlert from "../components/atoms/GeneralErrorAlert";
import baseURL from "../utilities/baseURL";

type LeaveQueueAlertProps = {
    isAlertOpen: boolean,
    setIsAlertOpen: React.Dispatch<React.SetStateAction<boolean>>
}


export default (props: LeaveQueueAlertProps) => {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const [errors, setError] = useState<any>([]);
    const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false)
    const { t } = useTranslation(["endQueueAlert", "common"]);
    useEffect(() => {if (!!errors.length) {setShowErrorAlert(true)}}, [errors])  // Render alert if errors

    const deleteQueueQuery = `
        mutation delete_queue($queueId: String!) {
            deleteQueue(queueId: $queueId){
                ... on Queue {
                    id
                }
                ... on Error {
                    error
                }
            }
        }
    `
    const deleteQueueVariables = `{
    "queue_id": {
            "id": "costco_queue1"
        }
    }`

    const deleteQueue = async () => {
        try {
            const response = await fetch(baseURL(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:19006/',
                },
                credentials: 'include',
                body: JSON.stringify({query: deleteQueueQuery, variables: deleteQueueVariables})
            });
            // enter you logic when the fetch is successful
            return await response.json()
        } catch(error) {
            setError([...errors, error])
        }
    }


    const onClose = () => {
        props.setIsAlertOpen(false)
    }

    const onConfirm = () => {
        props.setIsAlertOpen(false)
        AsyncStorage.clear().then()
        deleteQueue().then()
        navigation.reset({index: 1, routes: [{name: "HomePage"}]})
        navigation.navigate("EndScreen")
    }

    const cancelRef = React.useRef(null)
    return (
        <Center>
            <GeneralErrorAlert
                showAlert={showErrorAlert}
                setShowAlert={setShowErrorAlert}
                message={t(!errors.length ? "cannot_end_queue_message" : errors[0])}
            />
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
                            <Button colorScheme="danger" onPress={() => onConfirm()}>
                                {t("confirm", {ns: "common"})}
                            </Button>
                        </Button.Group>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>
        </Center>
    )
}
