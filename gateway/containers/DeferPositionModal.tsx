import * as React from 'react'
import { TimePickerModal } from './TimePickerModal'
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { HomeScreenProps } from "../types";

type GenericTimePickerModalProps = {
    modalVisible: boolean
    setModalVisible: Function
}

export default function (props: GenericTimePickerModalProps) {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const [visible, setVisible] = React.useState(false)
    const { t, i18n } = useTranslation(["deferPositionModal", "common"]);
    const onDismiss = React.useCallback(() => {
        props.setModalVisible(false)
    }, [setVisible])

    const query = `
        mutation defer_user($time: String!) {
            deferPosition(time: $time) {
                userId: id
                status
            }
        }
    `
    const variables = `{
        "time": "1970-01-01T00:00:00.000Z"
    }`

    async function deferPosition () {
        try {
            const response = await fetch(`http://localhost:8080/api`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({query: query, variables: variables})
            });
            return await response.json()
        } catch(error) {
            return error
        }
    }

    const onConfirm = React.useCallback(
        ({ hours, minutes }) => {
            props.setModalVisible(false);
            console.log({ hours, minutes });
            deferPosition()
            navigation.navigate("UserDashboard")
        },
        [setVisible]
    );


    return (
        <TimePickerModal
            visible={props.modalVisible}
            onDismiss={onDismiss}
            onConfirm={onConfirm}
            hours={12} // default: current hours
            minutes={14} // default: current minutes
            uppercase={false}
            label={t("label")} // optional, default 'Select time'
            cancelLabel={t("cancel", {ns: "common"})} // optional, default: 'Cancel'
            confirmLabel={t("ok", {ns: "common"})} // optional, default: 'Ok'
            animationType="fade" // optional, default is 'none'
        />
    )
}
