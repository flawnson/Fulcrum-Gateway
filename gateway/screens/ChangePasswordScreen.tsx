import React, {useState, useEffect} from "react";
import {VStack, Center, Button, FormControl, Input} from "native-base";
import {Linking} from "react-native";
import {useTranslation} from "react-i18next";


type ChangePasswordData = {
    password?: string,
    confirmPassword?: string
    token?: string
}


export default function () {
    const { t } = useTranslation(["changePasswordScreen", "common"]);
    const [formData, setData] = useState<ChangePasswordData>({});
    const [errors, setErrors] = useState<ChangePasswordData>({});
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        // Run once to extract token from deep link provided in email to change password
        async function setInitialURLToken () {
            return await Linking.getInitialURL().then(data => {
                    const result = data!.substring(data!.lastIndexOf('/') + 1)
                    setData({...formData, token: result})
                }
            )
        }
        setInitialURLToken().then()
    }, [])

    const query = `
        mutation change_password($password: String!, $token: String!){
            changeOrganizerPassword(password: $password, token: $token){
                ... on Organizer {
                    id
                }
                ... on Error {
                    error
                }
            }
        }
    `

    async function changePassword () {
        try {
            const response = await fetch(`http://localhost:8080/api`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:19006/',
                },
                credentials: 'include',
                body: JSON.stringify({query: query, variables: formData}),
            });
            return await response.json().then(data => {
                    setSubmitted(false)
                }
            )
        } catch (error) {
            return error
        }
    }

    const validatePasswords = () => {
        if (formData.password === undefined) {
            setErrors({
                ...errors,
                confirmPassword: t('new_password_not_provided'),
            });
            return false;
        } else if (formData.confirmPassword === undefined) {
            setErrors({
                ...errors,
                password: t('confirm_password_not_provided'),
            })
            return false
        } else if (formData.password !== formData.confirmPassword) {
            setErrors({
                ...errors,
                confirmPassword: t('confirm_password_does_not_match'),
            })
            return false
        }
        return true;
    };

    const onSuccess = () => {
        changePassword().then()
    }

    const onFailure = () => {
        setSubmitted(false)
    }

    function onSubmitPress () {
        setSubmitted(true)
        validatePasswords() ? onSuccess() : onFailure();
    }



    return (
        <Center>
            <VStack>
                <FormControl isRequired>
                    <FormControl.Label _text={{
                        bold: true
                    }}>{t("new_password_label")}</FormControl.Label>
                    <Input placeholder={t("password_placeholder")} onChangeText={value => setData({ ...formData,
                        password: value
                    })} />
                    <FormControl.HelperText _text={{
                        fontSize: 'xs'
                    }}>
                        {t("password_helper")}
                    </FormControl.HelperText>
                    <FormControl.ErrorMessage _text={{
                        fontSize: 'xs'
                    }}>
                        {errors.password}
                    </FormControl.ErrorMessage>
                </FormControl>
                <FormControl isRequired>
                    <FormControl.Label _text={{
                        bold: true
                    }}>{t("new_password_label")}</FormControl.Label>
                    <Input placeholder={t("confirm_password_placeholder")} onChangeText={value => setData({ ...formData,
                        confirmPassword: value
                    })} />
                    <FormControl.HelperText _text={{
                        fontSize: 'xs'
                    }}>
                        {t("confirm_password_helper")}
                    </FormControl.HelperText>
                    <FormControl.ErrorMessage _text={{
                        fontSize: 'xs'
                    }}>
                        {errors.confirmPassword}
                    </FormControl.ErrorMessage>
                </FormControl>
                <Button
                    mt="2"
                    colorScheme="indigo"
                    onPress={onSubmitPress}
                    isLoading={submitted}
                    isLoadingText="Logging in..."
                >
                    {t("submit", {ns: "common"})}
                </Button>
            </VStack>
        </Center>
    )
}
