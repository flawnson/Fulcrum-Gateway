import React from 'react'
import { Center, Text } from 'native-base'
import { useTranslation } from "react-i18next"
import {StyleSheet} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {HomeScreenProps} from "../types";


export default function () {
    const { t } = useTranslation(["errorScreen"]);
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead

    return (
        <Center>
            <Text style={styles.error}>404</Text>
            <Text>{t("message")}</Text>
            <Text style={styles.linkText} onPress={() => navigation.navigate('HomePage')}> fiefoe.com</Text>
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

    },
    linkText: {
        fontWeight: 'bold',
    }
})



