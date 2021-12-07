import React from 'react'
import { HStack, Button,
        Text } from "native-base";

type MultiSelectButtonType = {
    onKickedPress: Function
}

export default function (props: MultiSelectButtonType) {
    return (
        <HStack>
            <Button onPress={() => props.onKickedPress()}><Text>Kick Queuers</Text></Button>
            <Button><Text>Summon Queuers</Text></Button>
            <Button><Text>Service Queuers</Text></Button>
        </HStack>
    )
}
