import React from "react"
import { AlertDialog, Button, Center } from "native-base"
import {useNavigation} from "@react-navigation/native";
import {HomeScreenProps} from "../../types";
import {useTranslation} from "react-i18next";

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
        mutation leave_queue($id: String!, $status: String!) {
            changeStatus(where: $id, status: $status) {
                name
                status
            }
        }
    `
    const variables = `{
        "id": "user3",
        "status": "ABANDONED"
    }`

    async function leaveQueue (userId: string) {
        try {
            const response = await fetch(`http://localhost:8080/api?query=${query}&variables=${variables}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: userId})
            });
            return await response.json()
        } catch(error) {
            return error
        }
    }


    const onLeave = () => {
        props.setIsAlertOpen(false)
        navigation.navigate("AbandonedScreen")
    }

    const cancelRef = React.useRef(null)
    return (
        <Center>
            <AlertDialog
                leastDestructiveRef={cancelRef}
                isOpen={props.isAlertOpen}
                onClose={onClose}
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
                                onPress={onClose}
                                ref={cancelRef}
                            >
                                {t("cancel", {ns: "common"})}
                            </Button>
                            <Button colorScheme="danger" onPress={onLeave}>
                                {t("confirm", {ns: "common"})}
                            </Button>
                        </Button.Group>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>
        </Center>
    )
}
