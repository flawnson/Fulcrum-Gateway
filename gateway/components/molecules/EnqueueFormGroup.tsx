import React, { useState } from 'react';
import { StyleSheet } from 'react-native'
import { View, Text } from 'native-base'
import EnqueueForm from '../organisms/EnqueueForm'
import { useNavigation, useRoute } from "@react-navigation/native";
import { HomeScreenProps } from "../../types";
import { useTranslation } from "react-i18next";
import OrganizerLoginModal from "../../containers/LoginModal";
import OrganizerSignUpModal from "../../containers/OrganizerSignUpModal";
import LogoAndName from "../atoms/LogoAndName";
import {scale} from "../../utilities/scales";


export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const { t, i18n } = useTranslation(["homePage", "common"]);
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [showSignUpModal, setShowSignUpModal] = useState(false)

    return (
        <View style={styles.container}>
            <LogoAndName styles={styles.logo}/>
            <EnqueueForm navigation={navigation} />
            <Text style={styles.subText}>
                <Text style={styles.linkText} onPress={() => setShowLoginModal(true)}>
                    {t("login", {ns: "common"})}
                </Text>
                {t("or")}
                <Text style={styles.linkText} onPress={() => setShowSignUpModal(true)}>
                    {t("signup", {ns: "common"})}
                </Text>
                {t('footer')}
                <Text style={styles.linkText} onPress={() => navigation.navigate('HomePage')}> fiefoe.com</Text>
            </Text>
            <OrganizerLoginModal showModal={showLoginModal} setShowModal={setShowLoginModal}/>
            <OrganizerSignUpModal showModal={showSignUpModal} setShowModal={setShowSignUpModal}/>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 150
    },
    subText: {
        marginTop: 150,
        textAlign: "center"
    },
    linkText: {
        fontWeight: 'bold',
    },
    logo: {
        width: scale(100),
        height: scale(100),
    }
});


