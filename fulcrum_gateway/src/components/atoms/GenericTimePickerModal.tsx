import * as React from 'react'
import { Button } from 'react-native-paper'
import { TimePickerModal } from '../../containers/TimePickerModal'

type GenericTimePickerModalProps = {
    modalVisible: boolean
    setModalVisible: Function
}

export default function (props: GenericTimePickerModalProps) {
    const [visible, setVisible] = React.useState(false)
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
        <>
            <TimePickerModal
                visible={props.modalVisible}
                onDismiss={onDismiss}
                onConfirm={onConfirm}
                hours={12} // default: current hours
                minutes={14} // default: current minutes
                uppercase={false}
                label="How long would you like to defer for?" // optional, default 'Select time'
                cancelLabel="Cancel" // optional, default: 'Cancel'
                confirmLabel="Ok" // optional, default: 'Ok'
                animationType="fade" // optional, default is 'none'
                locale="en" // optional, default is automatically detected by your system
            />
        </>
    )
}
