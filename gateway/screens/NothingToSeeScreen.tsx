import React from 'react'
import { Center, Text } from 'native-base'
import { StyleSheet } from "react-native";

export default function () {
    return (
        <Center style={styles.container}>
            <Text style={styles.text}>
                Nothing to see here...
            </Text>
        </Center>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        flex: 1,
        fontSize: 30
    }
})
