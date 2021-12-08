import React from 'react'
import { HStack, Button,
        Text } from "native-base";

type MultiSelectButtonType = {
    tintColor?: string
}

export default function (props: MultiSelectButtonType) {
    return (
        <HStack>
            <Button><Text>Pause Queues</Text></Button>
        </HStack>
    )
}
