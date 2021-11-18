import React from 'react';
import {StyleSheet,
        View,
        Text} from 'react-native'
import {useNavigation} from "@react-navigation/native";
import {HomeScreenProps} from "../../types";
import {Center} from "native-base";
import {useTranslation} from "react-i18next";


export default function() {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const { t, i18n } = useTranslation("endScreen");

    return (
        <View>
            <Center style={styles.container}>
                <Text style={styles.header}>
                    {t('message')}
                </Text>
                <Text style={styles.subText}>
                    {t('footer')}
                <Text style={styles.linkText} onPress={() => navigation.navigate('LandingPage')}> fiefoe.com</Text>
                </Text>
            </Center>
        </View>
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
