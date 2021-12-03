import React from 'react'
import { HStack, Button,
        Text } from "native-base";

type MultiSelectButtonType = {
    tintColor?: string
}

export default function (props: MultiSelectButtonType) {
    return (
        <HStack>
            <Button><Text>Kick Queuers</Text></Button>
            <Button><Text>Summon Queuers</Text></Button>
            <Button><Text>Service Queuers</Text></Button>
        </HStack>
    )
}
