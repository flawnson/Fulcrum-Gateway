import React from 'react';
import { StyleSheet } from 'react-native'
import { Center, Text } from 'native-base'
import EnqueueForm from '../organisms/EnqueueForm'
import { useNavigation, useRoute } from "@react-navigation/native";
import { HomeScreenProps } from "../../../types";
import { useTranslation } from "react-i18next";


export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const route = useRoute<HomeScreenProps["route"]>();  // Don't need this but if I want to pass config or params...
    const { t, i18n } = useTranslation("homePage");

    return (
        <Center style={styles.container}>
            <EnqueueForm route={route} navigation={navigation} />
            <Text style={styles.subText}>
                {t('footer')}
                <Text style={styles.linkText} onPress={() => navigation.navigate('LandingPage')}> fiefoe.com</Text>
            </Text>
        </Center>
    )
}


const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: 200,
        marginLeft: -100,
    },
    subText: {
        position: "absolute",
        top: 300,
        textAlign: "center",
        marginTop: 50,
    },
    linkText: {
        fontWeight: 'bold',
    }
});


