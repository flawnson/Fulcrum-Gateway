import React from 'react'
import { Center, Text } from 'native-base'
import {StyleSheet} from "react-native";
import {scale} from "../utilities/scales";


export default function () {
    return (
        <Center style={styles.container}>
            <Text style={styles.text}>Loading...</Text>
        </Center>
    );
}


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        flex: 1,
        fontSize: scale(30)
    }
})
