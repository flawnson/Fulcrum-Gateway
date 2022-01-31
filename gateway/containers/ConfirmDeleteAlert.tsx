import React from 'react'
import {AlertDialog, Button} from 'native-base'
import {useTranslation} from "react-i18next";


type ConfirmDeleteAlert = {
    showAlert: {show: boolean, callback: Function},
    setShowAlert: React.Dispatch<React.SetStateAction<any>>
}

export default function (props: ConfirmDeleteAlert) {
    const cancelRef = React.useRef(null)
    const { t, i18n } = useTranslation(["confirmDeleteAlert", "common"]);

    function onConfirmPress() {
        props.showAlert.callback()
        props.setShowAlert(false)
    }

    return (
        <AlertDialog
            leastDestructiveRef={cancelRef}
            isOpen={props.showAlert.show}
            onClose={() => {props.setShowAlert(false)}}
        >
            <AlertDialog.Content>
                <AlertDialog.CloseButton />
                <AlertDialog.Header>{t("header")}</AlertDialog.Header>
                <AlertDialog.Body>
                </AlertDialog.Body>
                <AlertDialog.Footer>
                    <Button onPress={onConfirmPress}>
                        CONFIRM
                    </Button>
                </AlertDialog.Footer>
            </AlertDialog.Content>
        </AlertDialog>
)
}
