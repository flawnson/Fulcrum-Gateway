import React from 'react';
import {StyleSheet, View, Text} from 'react-native'
import {StackActions, useNavigation} from "@react-navigation/native";
import {HomeScreenProps} from "../types";
import {Center} from "native-base";
import {useTranslation} from "react-i18next";


export default function() {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const { t } = useTranslation("abandonedScreen");

    return (
        <Center style={styles.container}>
            <Text style={styles.header}>
                {t('message')}
            </Text>
            <Text style={styles.subText}>
                {t('footer')}
            <Text style={styles.linkText} onPress={() => StackActions.popToTop() && navigation.navigate('HomePage')}> fiefoe.com</Text>
            </Text>
        </Center>
    )
}


const styles = StyleSheet.create({
    container: {
        margin: 200,
    },
    header: {
        margin: 10,
        fontSize: 40,
        textAlign: "center",
    },
    subText: {
        textAlign: "center",
        margin: 10,
    },
    linkText: {
        textAlign: "center",
        fontWeight: 'bold',
    }

})
