import React from 'react'
import {AlertDialog} from 'native-base'
import {useTranslation} from "react-i18next";


type ConfirmDeleteAlert = {
    showAlert: boolean,
    setShowAlert: React.Dispatch<React.SetStateAction<boolean>>
}

export default function (props: ConfirmDeleteAlert) {
    const cancelRef = React.useRef(null)
    const { t, i18n } = useTranslation(["confirmDeleteAlert", "common"]);

    return (
        <AlertDialog
            leastDestructiveRef={cancelRef}
            isOpen={props.showAlert}
            onClose={() => {props.setShowAlert(false)}}
        >
            <AlertDialog.Content>
                <AlertDialog.CloseButton />
                <AlertDialog.Header>{t("header")}</AlertDialog.Header>
                <AlertDialog.Body>
                </AlertDialog.Body>
                <AlertDialog.Footer>
                </AlertDialog.Footer>
            </AlertDialog.Content>
        </AlertDialog>
)
}
