import React from 'react'
import { HStack, Button,
        Text } from "native-base";

type MultiSelectButtonType = {
    onActionPress: Function
}

export default function (props: MultiSelectButtonType) {
    return (
        <HStack>
            <Button onPress={() => props.onActionPress("KICKED")}><Text>Kick Queuers</Text></Button>
            <Button onPress={() => props.onActionPress("SUMMONED")}><Text>Summon Queuers</Text></Button>
            <Button onPress={() => props.onActionPress("SERVICED")}><Text>Service Queuers</Text></Button>
        </HStack>
    )
}
