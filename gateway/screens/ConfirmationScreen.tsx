import React, {useEffect, useState} from 'react'
import {View, Text, Button, useToast} from 'native-base'
import {useNavigation, useRoute} from "@react-navigation/native";
import {HomeScreenProps, UserStats, UserStatus} from "../types";
import baseURL from "../utilities/baseURL";
import corsURL from "../utilities/corsURL";
import {StyleSheet} from "react-native";
import RightHeaderGroup from "../components/molecules/RightHeaderGroup";
import {useTranslation} from "react-i18next";

export default function () {
    const { t } = useTranslation(["confirmationScreen"]);
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const route = useRoute<HomeScreenProps["route"]>();  // Don't need this but if I want to pass config or params...
    const [errors, setError] = useState<any>([]);
    const toast = useToast()
    const toastId = "errorToast"

    useEffect(() => {
        if (!!errors.length) {
            toast.show({
                id: toastId,
                title: t('something_went_wrong', {ns: "common"}),
                status: "error",
                description: t("cannot_confirm_organizer_message"),
                duration: 10
            })
        }
    }, [errors])  // Render alert if errors

    const confirmOrganizerQuery = `
        mutation confirm_organizer($token: String!){
            confirmOrganizer(token: $token) {
                ... on Organizer {
                    id
                }
                ... on Error {
                    error
                }
            }
        }
    `
    const confirmOrganizerVariables = `
            {
            "token": "${route.params!["organizer-confirmation"]}"
        }
    `

    async function confirmOrganizer () {
        try {
            const response = await fetch(baseURL(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': corsURL(),
                },
                credentials: 'include',
                body: JSON.stringify({query: confirmOrganizerQuery, variables: confirmOrganizerVariables})
            });
            return await response.json().then(data => {
                if (!!data.errors?.length) {
                    setError([...errors, data.errors[0]])
                } else if (data.data.confirmOrganizer.error === "ACCOUNT_CONFIRM_FAILED") {
                    setError([...errors, data.data.confirmOrganizer.error])
                } else {
                    navigation.navigate('HomePage')
                }
            })
        } catch(error) {
            setError([...errors, error])
        }
    }


    return (
        <View style={styles.container}>
            <Text style={styles.message}>
                {t("message")}
            </Text>
            <Button onPress={() => confirmOrganizer()} style={styles.button}>
                {t("confirm", {ns: "common"})}
            </Button>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
    },
    message: {
        flex: 1,
    },
    button: {
        flex: 1,
    },
});
