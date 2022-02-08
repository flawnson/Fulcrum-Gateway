import * as React from "react"
import {
    Box, Heading,
    VStack, FormControl,
    Input, Button, Link
} from "native-base"
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../types";
import {useState} from "react";
import {useTranslation} from "react-i18next";


type SignUpFormType = {
    navigation: NativeStackScreenProps<RootStackParamList, 'HomePage'>['navigation']
    setShowModal: Function
}

type OrganizerFormData = {
    email?: string
    password?: string
    confirmPassword?: string
}

type OrganizerSignUpErrorData = {
    email?: string
    password?: string
}


export default ({navigation, setShowModal}: SignUpFormType) => {
    const [formData, setData] = useState<OrganizerFormData>({});
    const { t, i18n } = useTranslation(["signUpForm"]);
    const [submitted, setSubmitted] = useState<boolean>(false)
    const [errors, setErrors] = useState<OrganizerSignUpErrorData>({});

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
            const response = await fetch(`http://localhost:8080/api`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:19006/',
                },
                credentials: 'include',
                body: JSON.stringify({query: query, variables: formData}),
            });
            return await response.json()
        } catch (error) {
            return error
        }
    }

    const re = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
    const validate = () => {
        if (formData.email === undefined) {
            setErrors({
                ...errors,
                email: t("emailUndefinedError"),
            });
            return false;
        } else if (!re.test(formData.email)) {
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
        setShowModal(false)
        setSubmitted(false)
        navigation.navigate("QueuesPage")
    }

    const onFailure = () => {
        setSubmitted(false)
    }

    const onSignUpPress = () => {
        setSubmitted(true)
        validate() && signUp() ? onSuccess() : onFailure();
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
                        type="password"
                        placeholder={t("passwordPlaceholder")}
                        onChangeText={(value) => setData({ ...formData, password: value })}
                    />
                    <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{errors.password}</FormControl.ErrorMessage>
                </FormControl>
                <FormControl isInvalid={"confirmPassword" in errors}>
                    <FormControl.Label>{t("confirmPasswordLabel")}</FormControl.Label>
                    <Input
                        type="password"
                        placeholder={t("confirmPasswordPlaceholder")}
                        onChangeText={(value) => setData({ ...formData, confirmPassword: value })}
                    />
                    <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{errors.password}</FormControl.ErrorMessage>
                </FormControl>
                <Button
                    mt="2"
                    colorScheme="indigo"
                    onPress={onSignUpPress}
                    isLoading={submitted}
                    isLoadingText={t("isLoadingText")}
                >
                    Sign up
                </Button>
            </VStack>
        </Box>
    )
}
