import React from 'react'
import { Center, Text } from 'native-base'
import { useTranslation } from "react-i18next"
import {StyleSheet} from "react-native";


export default function () {
    const { t, i18n } = useTranslation(["errorScreen"]);
    console.log("Something went wrong!")

    return (
        <Center>
            <Text style={styles.error}>404</Text>
            <Text>{t("message")}</Text>
        </Center>
    )
}


const styles = StyleSheet.create({
    error: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        fontSize: 200
    },
    message: {

    }
})



