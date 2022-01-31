import React from 'react'
import { ClockTypeMap } from "../types";
import { useTheme } from 'native-base'

export const clockTypes: ClockTypeMap = {
    minutes: 'minutes',
    hours: 'hours',
}

export function toHourOutputFormat(
    newHours: number,
    previousHours: number,
    is24Hour: boolean
): number {
    if (is24Hour) {
        return newHours
    }
    if (previousHours > 12 && newHours < 12) {
        return newHours + 12
    }
    return newHours
}

export function useLatest<T>(value: T) {
    const ref = React.useRef(value)
    ref.current = value
    return ref
}

export function useInputColors(highlighted: boolean) {
    const theme = useTheme()
    const backgroundColor = React.useMemo<string>(() => {
        if (theme.colors.dark) {
            if (highlighted) {
                return theme.colors.primary["400"]
            }
            return theme.colors.light["400"]
        }

        if (highlighted) {
            return theme.colors.primary["400"]
        }
        return theme.colors.light["400"]
    }, [highlighted, theme])

    const color = React.useMemo<string>(() => {
        if (highlighted && !theme.colors.dark) {
            return theme.colors.primary[400]
        }
        return theme.colors.darkText[400]
    }, [highlighted, theme])

    return { backgroundColor, color }
}

