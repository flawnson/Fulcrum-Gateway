/* Courtesy of useHooks.ts and their wonderful collection of typescript hooks */
import { useEffect, useRef } from 'react'

export default function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback)
    let counter = 0

    // Remember the latest callback if it changes.
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    // Set up the interval.
    useEffect(() => {
        // Don't schedule if no delay is specified.
        if (delay === null) {
            return
        }

        let id = setInterval(() => savedCallback.current(), 0)
        if (counter !== 0) {
            id = setInterval(() => savedCallback.current(), delay)
        }

        counter++
        return () => clearInterval(id)
    }, [delay])
}

