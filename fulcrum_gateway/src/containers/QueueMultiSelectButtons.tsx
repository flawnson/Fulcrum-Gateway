import React from 'react'
import { HStack, Button,
        Text } from "native-base";
import {StyleSheet} from "react-native";

type MultiSelectButtonType = {
    onActionPress: Function
}

export default function (props: MultiSelectButtonType) {
    return (
        <Button.Group
            mx={{
                base: "auto",
                md: 0,
            }}
        >
            <Button style={styles.button} onPress={() => props.onActionPress("PAUSED")}>
                <Text bold color={'white'}>Pause Queues</Text>
            </Button>
            <Button style={styles.button} onPress={() => props.onActionPress("INACTIVE")}>
                <Text bold color={'white'}>Deactivate Queues</Text>
            </Button>
        </Button.Group>
    )
}


const styles = StyleSheet.create({
    button: {
        marginHorizontal: 10,
    },
})
