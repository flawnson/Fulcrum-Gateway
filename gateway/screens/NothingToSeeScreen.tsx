import React from 'react'
import {Center, Image, Text, VStack} from 'native-base'
import { StyleSheet } from "react-native";
import {scale} from "../utilities/scales";

export default function () {
    return (
        <Center>
            <VStack style={styles.pair}>
                <Image
                    src={require("../assets/images/cat-gif.gif")}
                    style={styles.image}
                    alt="Cute cat gif!"
                />
                <Text style={styles.text}>
                    Nothing to see here...
                </Text>
            </VStack>
        </Center>
    )
}

const styles = StyleSheet.create({
    pair: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        flex: 1,
        width: scale(300),
        height: scale(300)
    },
    text: {
        flex: 1,
        fontSize: 30
    }
})
