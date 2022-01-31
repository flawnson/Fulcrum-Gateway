// Taken from react-native-paper-dates
import * as React from 'react'
import { View, StyleSheet, useWindowDimensions } from 'react-native'

import TimeInputs from '../molecules/TimeInputs'
import { Center } from "native-base";
import { PossibleClockTypes } from "../../types";

type onChangeFunc = ({
                         hours,
                         minutes,
                         focused,
                     }: {
    hours: number
    minutes: number
    focused?: undefined | PossibleClockTypes
}) => any

const circleSize = 215

function TimePicker({
                        hours,
                        minutes,
                        onFocusInput,
                        focused,
                        onChange,
                        locale,
                    }: {
    locale?: undefined | string
    focused: PossibleClockTypes
    hours: number
    minutes: number
    onFocusInput: (type: PossibleClockTypes) => any
    onChange: onChangeFunc
}) {
    const dimensions = useWindowDimensions()
    const isLandscape = dimensions.width > dimensions.height

    return (
        <View style={isLandscape ? styles.rootLandscape : styles.rootPortrait}>
            <Center>
                <TimeInputs
                    hours={hours}
                    minutes={minutes}
                    onChange={onChange}
                    onFocusInput={onFocusInput}
                    focused={focused}
                />
            </Center>
        </View>
    )
}

const styles = StyleSheet.create({
    rootLandscape: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 24 * 3 + 96 * 2 + 52 + circleSize,
    },
    rootPortrait: {},
    clockContainer: { paddingTop: 36, paddingLeft: 12, paddingRight: 12 },
})

export default React.memo(TimePicker)
