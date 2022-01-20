import React, { useState } from 'react';
import { StyleSheet } from 'react-native'
import { Center, Text } from 'native-base'
import EnqueueForm from '../organisms/EnqueueForm'
import { useNavigation, useRoute } from "@react-navigation/native";
import { HomeScreenProps } from "../../../types";
import { useTranslation } from "react-i18next";
import OrganizerLoginModal from "../../containers/LoginModal";
import OrganizerSignUpModal from "../../containers/OrganizerSignUpModal";


export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const route = useRoute<HomeScreenProps["route"]>();  // Don't need this but if I want to pass config or params...
    const { t, i18n } = useTranslation(["homePage", "common"]);
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [showSignUpModal, setShowSignUpModal] = useState(false)

    return (
        <Center style={styles.container}>
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
                <Text style={styles.linkText} onPress={() => navigation.navigate('LandingPage')}> fiefoe.com</Text>
            </Text>
            <OrganizerLoginModal showModal={showLoginModal} setShowModal={setShowLoginModal}/>
            <OrganizerSignUpModal showModal={showSignUpModal} setShowModal={setShowSignUpModal}/>
        </Center>
    )
}


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 250
    },
    subText: {
        marginTop: 200,
    },
    linkText: {
        fontWeight: 'bold',
    }
});


