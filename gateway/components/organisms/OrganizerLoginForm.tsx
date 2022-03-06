import * as React from "react"
import {
    Box, Heading,
    VStack, FormControl,
    Input, Button,
    Text, Link,
    HStack, useToast
} from "native-base"
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import {useCallback, useState} from "react";
import {AuthContext} from "../../utilities/AuthContext";
import ForgotPasswordModal from "../../containers/ForgotPasswordModal";
import {useTranslation} from "react-i18next";
import baseURL from "../../utilities/baseURL";
import corsURL from "../../utilities/corsURL";


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
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState<boolean>(false)
    const [errors, setErrors] = useState<OrganizerLogInErrorData>({});
    const [showPassword, setShowPassword] = React.useState(false);
    const toast = useToast()

    const handleClickShowPassword = () => setShowPassword(!showPassword);


    useCallback(() => {
        // Alert will show if nothing has happened within 10 seconds of submitting the enqueue form.
        setTimeout(() => {
            if (submitted) {
                setSubmitted(false)
                toast.show({
                    title: t('something_went_wrong', {ns: "common"}),
                    status: "error",
                    description: t("cannot_login_message")
                })
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
            fetch(baseURL(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': corsURL(),
                },
                credentials: 'include',
                body: JSON.stringify({query: query, variables: formData}),
            }).then(response => response.json()).then(data => {
                    setShowModal(false)
                    setSubmitted(false)
                    navigation.navigate("QueuesPage")
                }
            )
        } catch (error) {
            console.log("Organizer Login Form Error");
            console.log(error);
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
                            type={showPassword ? "text" : "password"}
                            placeholder={t("password_placeholder")}
                            onChangeText={(value) => setData({ ...formData, password: value })}
                            InputRightElement={
                                <Button size="xs" rounded="none" w="1/6" h="full" onPress={handleClickShowPassword}>
                                    {showPassword ? "Hide" : "Show"}
                                </Button>
                            }
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
                        isLoadingText={t("logging_in", {ns: "common"})}
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
