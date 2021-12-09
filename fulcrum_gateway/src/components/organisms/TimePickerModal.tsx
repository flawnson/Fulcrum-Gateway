// Taken from react-native-paper-dates
import * as React from 'react'
import {
    Modal,
    StyleSheet,
    Animated,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
} from 'react-native'
import { View, Text } from 'native-base'
import { Button, overlay, useTheme } from 'react-native-paper'
import TimePicker from '../molecules/TimePicker'
import {
    clockTypes,
    PossibleClockTypes,
} from 'react-native-paper-dates/src/Time/timeUtils'
import { Center } from "native-base";

const supportedOrientations: any[] = [
    'portrait',
    'portrait-upside-down',
    'landscape',
    'landscape-left',
    'landscape-right',
]

export function TimePickerModal({
                                    visible,
                                    onDismiss,
                                    onConfirm,
                                    hours,
                                    minutes,
                                    label = 'Select time',
                                    uppercase = true,
                                    cancelLabel = 'Cancel',
                                    confirmLabel = 'Ok',
                                    animationType = 'none',
                                    locale,
                                }: {
    locale?: undefined | string
    label?: string
    uppercase?: boolean
    cancelLabel?: string
    confirmLabel?: string
    hours?: number | undefined
    minutes?: number | undefined
    visible: boolean | undefined
    onDismiss: () => any
    onConfirm: (hoursAndMinutes: { hours: number; minutes: number }) => any
    animationType?: 'slide' | 'fade' | 'none'
}) {
    const theme = useTheme()

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
    return (
        <Modal
            animationType={animationType}
            transparent={true}
            visible={visible}
            onRequestClose={onDismiss}
            presentationStyle="overFullScreen"
            supportedOrientations={supportedOrientations}
            //@ts-ignore
            statusBarTranslucent={true}
        >
            <>
                <TouchableWithoutFeedback onPress={onDismiss}>
                    <View
                        style={[
                            StyleSheet.absoluteFill,
                            styles.modalBackground,
                            { backgroundColor: theme.colors.backdrop },
                        ]}
                    />
                </TouchableWithoutFeedback>

                <View
                    style={[StyleSheet.absoluteFill, styles.modalRoot]}
                    pointerEvents="box-none"
                >
                    <KeyboardAvoidingView
                        style={styles.keyboardView}
                        behavior={'padding'}
                    >
                        <Animated.View
                            style={[
                                styles.modalContent,
                                {
                                    backgroundColor: theme.dark
                                        ? overlay(10, theme.colors.surface)
                                        : theme.colors.surface,
                                    borderRadius: theme.roundness,
                                },
                            ]}
                        >
                            <Center>
                                <View style={styles.labelContainer}>
                                    <Text style={[styles.label, { color: theme.colors.text }]}>
                                        {uppercase ? label.toUpperCase() : label}
                                    </Text>
                                </View>
                            </Center>
                            <View style={styles.timePickerContainer}>
                                <TimePicker
                                    locale={locale}
                                    focused={focused}
                                    hours={localHours}
                                    minutes={localMinutes}
                                    onChange={onChange}
                                    onFocusInput={onFocusInput}
                                />
                            </View>
                            <Center>
                                <View style={styles.bottom}>
                                    <View style={styles.fill} />
                                    <Button onPress={onDismiss} uppercase={uppercase}>{cancelLabel}</Button>
                                    <Button
                                        onPress={() =>
                                            onConfirm({ hours: localHours, minutes: localMinutes })
                                        }
                                        uppercase={uppercase}
                                    >
                                        {confirmLabel}
                                    </Button>
                                </View>
                            </Center>
                        </Animated.View>
                    </KeyboardAvoidingView>
                </View>
            </>
        </Modal>
    )
}

function getMinutes(minutes: number | undefined | null): number {
    return minutes === undefined || minutes === null
        ? new Date().getMinutes()
        : minutes
}
function getHours(hours: number | undefined | null): number {
    return hours === undefined || hours === null ? new Date().getHours() : hours
}

const styles = StyleSheet.create({
    modalRoot: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    keyboardView: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    modalBackground: {
        flex: 1,
    },
    modalContent: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
        minWidth: 287,
    },
    labelContainer: {
        height: 28,
        justifyContent: 'flex-end',
        paddingLeft: 24,
        paddingRight: 24,
    },
    label: {
        letterSpacing: 1,
        fontSize: 13,
    },
    timePickerContainer: { padding: 24 },
    bottom: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    inputTypeToggle: { margin: 4 },
    fill: { flex: 1 },
})

export default React.memo(TimePickerModal)
