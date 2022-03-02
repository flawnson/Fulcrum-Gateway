import React from 'react'
import {Center, Image, Text, VStack} from 'native-base'
import { StyleSheet } from "react-native";
import {scale} from "../utilities/scales";
import {useTranslation} from "react-i18next";

export default function () {
    const { t } = useTranslation(["nothingToSeeScreen"])

    return (
        <Center>
            <VStack style={styles.pair}>
                <Image
                    src={require("../assets/images/cat-gif.gif")}
                    style={styles.image}
                    alt={t("image_alt")}
                />
                <Text style={styles.text}>
                    {t("message")}
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
        width: scale(200),
        height: scale(200)
    },
    text: {
        flex: 1,
        fontSize: scale(16)
    }
})
