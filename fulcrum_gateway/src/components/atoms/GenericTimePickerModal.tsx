import * as React from 'react'
import { Button, Modal } from 'native-base'
import { useTranslation } from "react-i18next";
import { TimePickerModal } from 'react-native-paper-dates'
import TimePicker from 'react-native-paper-dates/src/Time/TimePicker'
import TimeInputs from 'react-native-paper-dates/src/Time/TimeInputs'
import {
    clockTypes,
    inputTypeIcons,
    inputTypes,
    PossibleClockTypes,
    PossibleInputTypes,
    reverseInputTypes,
} from 'react-native-paper-dates/src/Time/timeUtils'

type GenericTimePickerModalProps = {
    modalVisible: boolean
    setModalVisible: Function
}

function getMinutes(minutes: number | undefined | null): number {
    return minutes === undefined || minutes === null
        ? new Date().getMinutes()
        : minutes
}
function getHours(hours: number | undefined | null): number {
    return hours === undefined || hours === null ? new Date().getHours() : hours
}

export default function (props: GenericTimePickerModalProps) {
    const [visible, setVisible] = React.useState(false)
    const { t, i18n } = useTranslation()
    const locale = i18n.language
    const date = new Date()
    const hours = date.getHours()
    const minutes = date.getMinutes()
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

    // const theme = useTheme()

    const [inputType, setInputType] = React.useState<PossibleInputTypes>(
        inputTypes.picker
    )
    const [focused, setFocused] = React.useState<PossibleClockTypes>(
        clockTypes.hours
    )
    const [localHours, setLocalHours] = React.useState<number>(getHours(hours))
    const [localMinutes, setLocalMinutes] = React.useState<number>(
        getMinutes(minutes)
    )

    React.useEffect(() => {
        setLocalHours(getHours(hours))
    }, [setLocalHours, hours])

    React.useEffect(() => {
        setLocalMinutes(getMinutes(minutes))
    }, [setLocalMinutes, minutes])

    const onFocusInput = React.useCallback(
        (type: PossibleClockTypes) => setFocused(type),
        []
    )
    const onChange = React.useCallback(
        (params: {
            focused?: PossibleClockTypes | undefined
            hours: number
            minutes: number
        }) => {
            if (params.focused) {
                setFocused(params.focused)
            }

            setLocalHours(params.hours)
            setLocalMinutes(params.minutes)
        },
        [setFocused, setLocalHours, setLocalMinutes]
    )

    const is24Hour = React.useMemo(() => {
        const formatter = new Intl.DateTimeFormat(locale, {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC',
        })
        const formatted = formatter.format(new Date(Date.UTC(2020, 1, 1, 23)))
        return formatted.includes('23')
    }, [locale])

    return (
        <>
            <Modal
                isOpen={props.modalVisible}
                onClose={onDismiss}
            >
                <TimeInputs
                    inputType={inputType}
                    hours={hours}
                    minutes={minutes}
                    is24Hour={is24Hour}
                    onChange={onChange}
                    onFocusInput={onFocusInput}
                    focused={focused}
                />
                <Button onPress={onConfirm} />
            </Modal>
            {/*<TimePickerModal*/}
            {/*    visible={props.modalVisible}*/}
            {/*    onDismiss={onDismiss}*/}
            {/*    onConfirm={onConfirm}*/}
            {/*    hours={12} // default: current hours*/}
            {/*    minutes={14} // default: current minutes*/}
            {/*    label="Select time" // optional, default 'Select time'*/}
            {/*    cancelLabel="Cancel" // optional, default: 'Cancel'*/}
            {/*    confirmLabel="Ok" // optional, default: 'Ok'*/}
            {/*    animationType="fade" // optional, default is 'none'*/}
            {/*    locale="en" // optional, default is automatically detected by your system*/}
            {/*/>*/}
        </>
    )
}
