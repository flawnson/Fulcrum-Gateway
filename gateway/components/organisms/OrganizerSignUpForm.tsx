import * as React from "react"
import {
    Box, Heading,
    VStack, FormControl,
    Input, Button, Link, useToast
} from "native-base"
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../types";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import baseURL from "../../utilities/baseURL";
import corsURL from "../../utilities/corsURL";


type SignUpFormType = {
    navigation: NativeStackScreenProps<RootStackParamList, 'HomePage'>['navigation']
    setShowModal: Function
}

type OrganizerFormData = {
    name?: string,
    email?: string
    password?: string
    confirmPassword?: string
}

type OrganizerSignUpErrorData = {
    name?: string
    email?: string
    password?: string
}


export default ({navigation, setShowModal}: SignUpFormType) => {
    const { t } = useTranslation(["signUpForm", "common"]);
    const [formData, setData] = useState<OrganizerFormData>({});
    const [submitted, setSubmitted] = useState<boolean>(false)
    const [errors, setErrors] = useState<OrganizerSignUpErrorData | any>({});
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const toast = useToast()
    const toastId = "errorToast"

    useEffect(() => {
        if (!!errors.length) {
            toast.show({
                id: toastId,
                title: t('something_went_wrong', {ns: "common"}),
                status: "error",
                description: t("cannot_sign_up_organizer_message"),
                duration: 10
            })
        }
    }, [errors])  // Render alert if errors

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const query = `
      mutation create_organizer($email: String!, $name: String!, $password: String!){
          createOrganizer(email: $email, name: $name, password: $password){
              ... on Organizer {
                  id
              }
              ... on Error {
                  error
              }
          }
      }
    `

    async function signUp () {
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
                if (!!data.errors?.length) {
                    setSubmitted(false)
                    setErrors([...errors, data.errors[0]])
                } else if (data.data.createOrganizer.error === "ORGANIZER_ALREADY_EXISTS") {
                    setSubmitted(false)
                    setErrors([...errors, data.data.confirmOrganizer.error])
                } else if (data.data.createOrganizer.id) {
                    setShowModal(false)
                    setSubmitted(false)
                    toast.show({
                        title: t("check_your_email_title"),
                        status: "success",
                        description: t("check_your_email_message"),
                        duration: 10
                    })
                    }
                }
            )
        } catch (error) {
            setErrors([...errors, error])
        }
    }

    const re = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
    const validate = () => {
        if (formData.name === undefined) {
            setErrors({
                ...errors,
                name: t("nameUndefinedError"),
            });
            return false;
        } else if (!re.test(formData.email!)) {
            setErrors({
                ...errors,
                email: t("emailInvalidError"),
            });
            return false;
        } else if (formData.email === undefined) {
            setErrors({
                ...errors,
                email: t("emailInvalidError"),
            });
            return false;
        } else if (formData.password === undefined) {
            setErrors({
                ...errors,
                password: t("passwordUndefinedError"),
            });
            return false;
        } else if (formData.password !== formData.confirmPassword) {
            setErrors({
                ...errors,
                password: t("passwordUnmatchError"),
            });
            return false;
        }
        return true;
    }

    const onSuccess = () => {
        signUp().then()
    }

    const onFailure = () => {
        setSubmitted(false)
    }

    const onSignUpPress = () => {
        setSubmitted(true)
        validate() ? onSuccess() : onFailure();
    }

    return (
        <Box safeArea p="2" w="90%" maxW="290" py="8">
            <Heading
                size="lg"
                color="coolGray.800"
                _dark={{
                    color: "warmGray.50",
                }}
                fontWeight="semibold"
            >
                {t("welcome")}
            </Heading>
            <Heading
                mt="1"
                color="coolGray.600"
                _dark={{
                    color: "warmGray.200",
                }}
                fontWeight="medium"
                size="xs"
            >
                {t("message")}
            </Heading>
            <VStack space={3} mt="5">
                <FormControl isInvalid={"name" in errors}>
                    <FormControl.Label>{t("nameLabel")}</FormControl.Label>
                    <Input
                        placeholder={t("namePlaceholder")}
                        onChangeText={(value) => setData({ ...formData, name: value })}
                    />
                    <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{errors.name}</FormControl.ErrorMessage>
                </FormControl>
                <FormControl isInvalid={"email" in errors}>
                    <FormControl.Label>{t("emailLabel")}</FormControl.Label>
                    <Input
                        placeholder={t("emailPlaceholder")}
                        onChangeText={(value) => setData({ ...formData, email: value })}
                    />
                    <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{errors.email}</FormControl.ErrorMessage>
                </FormControl>
                <FormControl isInvalid={"password" in errors}>
                    <FormControl.Label>{t("passwordLabel")}</FormControl.Label>
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={t("passwordPlaceholder")}
                        onChangeText={(value) => setData({ ...formData, password: value })}
                        InputRightElement={
                            <Button size="xs" rounded="none" w="1/6" h="full" onPress={handleClickShowPassword}>
                                {showPassword ? "Hide" : "Show"}
                            </Button>
                        }
                    />
                    <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{errors.password}</FormControl.ErrorMessage>
                </FormControl>
                <FormControl isInvalid={"confirmPassword" in errors}>
                    <FormControl.Label>{t("confirmPasswordLabel")}</FormControl.Label>
                    <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={t("confirmPasswordPlaceholder")}
                        onChangeText={(value) => setData({ ...formData, confirmPassword: value })}
                        InputRightElement={
                            <Button size="xs" rounded="none" w="1/6" h="full" onPress={handleClickShowConfirmPassword}>
                                {showConfirmPassword ? "Hide" : "Show"}
                            </Button>
                        }
                    />
                    <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{errors.password}</FormControl.ErrorMessage>
                </FormControl>
                <Button
                    mt="2"
                    colorScheme="indigo"
                    onPress={() => onSignUpPress()}
                    isLoading={submitted}
                    isLoadingText={t("isLoadingText")}
                >
                    {t("signup", {ns: "common"})}
                </Button>
            </VStack>
        </Box>
    )
}
