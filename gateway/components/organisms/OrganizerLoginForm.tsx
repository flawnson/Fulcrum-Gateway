import * as React from "react"
import { Box, Heading,
        VStack, FormControl,
        Input, Button,
        Text, Link,
        HStack } from "native-base"
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import {useCallback, useState} from "react";
import {AuthContext} from "../../utilities/AuthContext";
import ForgotPasswordModal from "../../containers/ForgotPasswordModal";
import GeneralErrorAlert from "../atoms/GeneralErrorAlert";
import {useTranslation} from "react-i18next";


type LogInFormType = {
    navigation: NativeStackScreenProps<RootStackParamList, 'HomePage'>['navigation']
    setShowModal: Function
}

type OrganizerFormData = {
    email?: string,
    password?: string
}

type OrganizerLogInErrorData = {
    email?: string,
    password?: string
}

export default ({navigation, setShowModal}: LogInFormType) => {
    const { t } = useTranslation(["organizerLoginForm", "common"]);
    const { signIn } = React.useContext(AuthContext)
    const [formData, setData] = useState<OrganizerFormData>({});
    const [submitted, setSubmitted] = useState<boolean>(false)
    const [showAlert, setShowAlert] = useState<boolean>(false)
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState<boolean>(false)
    const [errors, setErrors] = useState<OrganizerLogInErrorData>({});

    useCallback(() => {
        // Alert will show if nothing has happened within 10 seconds of submitting the enqueue form.
        setTimeout(() => {
            if (submitted) {
                setSubmitted(false)
                setShowAlert(true)
            }
        }, 10000)
    }, [submitted])

    const query = `
        mutation login_organizer($email: String!, $password: String!) {
            loginOrganizer(email: $email, password: $password){
                ... on Organizer {
                    id
                }
                ... on Error {
                    error
                }
            }
        }
    `

    async function logIn () {
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
                setShowModal(false)
                setSubmitted(false)
                navigation.navigate("QueuesPage")
                }
            )
        } catch (error) {
            return error
        }
    }

    const re = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
    const validate = () => {
        if (formData.email === undefined) {
            setErrors({
                ...errors,
                email: t("email_not_defined_error"),
            });
            return false;
        } else if (!re.test(formData.email)){
            setErrors({
                ...errors,
                email: t("invalid_email_error"),
            });
            return false;
        } else if (formData.password === undefined) {
            setErrors({
                ...errors,
                password: t("password_not_defined_error"),
            });
            return false;
        }
        return true;
    };

    const onSuccess = () => {
        signIn('ORGANIZER')
        logIn().then()
    }

    const onFailure = () => {
        setSubmitted(false)
    }

    const onLogInPress = () => {
        setSubmitted(true)
        validate() ? onSuccess() : onFailure();
    }

    return (
        <>
            <GeneralErrorAlert
                showAlert={showAlert}
                setShowAlert={setShowAlert}
                message={t("cannot_enqueue_message")}
            />
            <Box safeArea p="2" py="8" w="90%" maxW="290">
                <VStack space={3} mt="5">
                    <FormControl isInvalid={"email" in errors}>
                        <FormControl.Label>{t("email")}</FormControl.Label>
                        <Input
                            placeholder={t("email_placeholder")}
                            onChangeText={(value) => setData({ ...formData, email: value })}
                        />
                        <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{errors.email}</FormControl.ErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={"password" in errors}>
                        <FormControl.Label>{t("password")}</FormControl.Label>
                        <Input
                            type="password"
                            placeholder={t("password_placeholder")}
                            onChangeText={(value) => setData({ ...formData, password: value })}
                        />
                        <Link
                            _text={{
                                fontSize: "xs",
                                fontWeight: "500",
                                color: "indigo.500",
                            }}
                            alignSelf="flex-end"
                            mt="1"
                            onPress={() => {setShowForgotPasswordModal(true)}}
                        >
                            {t("forgot_password")}
                        </Link>
                        <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{errors.password}</FormControl.ErrorMessage>
                    </FormControl>
                    <Button
                        mt="2"
                        colorScheme="indigo"
                        onPress={onLogInPress}
                        isLoading={submitted}
                        isLoadingText="Logging in..."
                    >
                        {t("login", {ns: "common"})}
                    </Button>
                    <HStack mt="6" justifyContent="center">
                        <Text
                            fontSize="sm"
                            color="coolGray.600"
                            _dark={{
                                color: "warmGray.200",
                            }}
                        >
                            {t("new_organizer")}
                        </Text>
                        <Link
                            _text={{
                                color: "indigo.500",
                                fontWeight: "medium",
                                fontSize: "sm",
                            }}
                            href="#"
                        >
                            {t("signup", {ns: "common"})}
                        </Link>
                    </HStack>
                </VStack>
            </Box>
            <ForgotPasswordModal showModal={showForgotPasswordModal} setShowModal={setShowForgotPasswordModal}/>
        </>
    )
}
