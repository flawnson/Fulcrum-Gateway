// @typescript-eslint/no-unused-vars

import * as React from 'react'
import {
    View,
    StyleSheet,
    useWindowDimensions,
    TextInput as TextInputNative,
} from 'react-native'
import { useTheme } from 'react-native-paper'

import {
    clockTypes,
    PossibleClockTypes,
    toHourOutputFormat,
} from 'react-native-paper-dates/src/Time/timeUtils'
import TimeInput from 'react-native-paper-dates/src/Time/TimeInput'
import AmPmSwitcher from 'react-native-paper-dates/src/Time/AmPmSwitcher'
import { useLatest } from 'react-native-paper-dates/src/utils'

function TimeInputs({
                        hours,
                        minutes,
                        onFocusInput,
                        focused,
                        onChange,
                    }: {
    focused: PossibleClockTypes
    hours: number
    minutes: number
    onFocusInput: (type: PossibleClockTypes) => any
    onChange: (hoursMinutesAndFocused: {
        hours: number
        minutes: number
        focused?: undefined | PossibleClockTypes
    }) => any
}) {
    const startInput = React.useRef<TextInputNative | null>(null)
    const endInput = React.useRef<TextInputNative | null>(null)
    const dimensions = useWindowDimensions()
    const isLandscape = dimensions.width > dimensions.height
    const theme = useTheme()

    const onSubmitStartInput = React.useCallback(() => {
        if (endInput.current) {
            endInput.current.focus()
        }
    }, [endInput])

    const onSubmitEndInput = React.useCallback(() => {
        // TODO: close modal and persist time
    }, [])

    const minutesRef = useLatest(minutes)
    const onChangeHours = React.useCallback(
        (newHours: number) => {
            onChange({
                hours: newHours,
                minutes: minutesRef.current,
                focused: clockTypes.hours,
            })
        },
        [onChange, minutesRef]
    )

    function toHourOutputFormat(
        newHours: number,
        previousHours: number,
    ): number {
        if (previousHours > 12 && newHours < 12) {
            return newHours + 12
        }
        return newHours
    }

    return (
        <View
            style={[
                styles.inputContainer,
                isLandscape && styles.inputContainerLandscape,
            ]}
        >
            <TimeInput
                ref={startInput}
                placeholder={'00'}
                value={hours}
                clockType={clockTypes.hours}
                pressed={focused === clockTypes.hours}
                onPress={onFocusInput}
                inputType={'keyboard'}  // either keyboard or selector
                returnKeyType={'next'}
                onSubmitEditing={onSubmitStartInput}
                blurOnSubmit={false}
                onChanged={(newHoursFromInput) => {
                    let newHours = toHourOutputFormat(newHoursFromInput, hours)
                    if (newHoursFromInput > 24) {
                        newHours = 24
                    }
                    onChange({
                        hours: newHours,
                        minutes,
                    })
                }}
                // onChangeText={onChangeStartInput}
            />
            <View style={styles.hoursAndMinutesSeparator}>
                <View style={styles.spaceDot} />
                <View style={[styles.dot, { backgroundColor: theme.colors.text }]} />
                <View style={styles.betweenDot} />
                <View style={[styles.dot, { backgroundColor: theme.colors.text }]} />
                <View style={styles.spaceDot} />
            </View>
            <TimeInput
                ref={endInput}
                placeholder={'00'}
                value={minutes}
                clockType={clockTypes.minutes}
                pressed={focused === clockTypes.minutes}
                onPress={onFocusInput}
                inputType={'keyboard'}  // either keyboard or selector
                onSubmitEditing={onSubmitEndInput}
                onChanged={(newMinutesFromInput) => {
                    let newMinutes = newMinutesFromInput
                    if (newMinutesFromInput > 60) {
                        newMinutes = 60
                    }
                    onChange({
                        hours,
                        minutes: newMinutes,
                    })
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    spaceBetweenInputsAndSwitcher: { width: 12 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputContainerLandscape: {
        flex: 1,
    },
    hoursAndMinutesSeparator: {
        fontSize: 65,
        width: 24,
        alignItems: 'center',
    },
    spaceDot: {
        flex: 1,
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 7 / 2,
    },
    betweenDot: {
        height: 12,
    },
})

export default React.memo(TimeInputs)
