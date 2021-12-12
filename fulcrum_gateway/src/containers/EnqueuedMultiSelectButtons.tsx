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
            <Button style={styles.button} onPress={() => props.onActionPress("KICKED")}>
                <Text bold color={'white'}>Kick Queuers</Text>
            </Button>
            <Button style={styles.button} onPress={() => props.onActionPress("SUMMONED")}>
                <Text bold color={'white'}>Toggle Summon</Text>
            </Button>
            <Button style={styles.button} onPress={() => props.onActionPress("SERVICED")}>
                <Text bold color={'white'}>Service Queuers</Text>
            </Button>
        </Button.Group>
    )
}


const styles = StyleSheet.create({
    button: {
        marginHorizontal: 10,
    },
})

