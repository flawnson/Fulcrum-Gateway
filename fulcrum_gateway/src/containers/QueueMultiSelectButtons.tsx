import React from 'react'
import { HStack, Button,
        Text } from "native-base";

type MultiSelectButtonType = {
    onActionPress: Function
}

export default function (props: MultiSelectButtonType) {
    return (
        <HStack>
            <Button onPress={() => props.onActionPress("PAUSED")}><Text>Pause Queues</Text></Button>
            <Button onPress={() => props.onActionPress("INACTIVE")}><Text>Deactivate Queues</Text></Button>
        </HStack>
    )
}
