import * as React from 'react'
import { TimePickerModal } from '../components/organisms/TimePickerModal'
import { useTranslation } from "react-i18next";

type GenericTimePickerModalProps = {
    modalVisible: boolean
    setModalVisible: Function
}

export default function (props: GenericTimePickerModalProps) {
    const [visible, setVisible] = React.useState(false)
    const { t, i18n } = useTranslation(["deferPositionModal", "common"]);
    const onDismiss = React.useCallback(() => {
        props.setModalVisible(false)
    }, [setVisible])

    const onConfirm = React.useCallback(
        ({ hours, minutes }) => {
            props.setModalVisible(false);
            console.log({ hours, minutes });
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
