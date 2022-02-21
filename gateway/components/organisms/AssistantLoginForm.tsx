import React, {useCallback, useState} from "react"
import { Box, VStack,
        FormControl, Input,
        Button, useToast } from "native-base"
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import {AuthContext} from "../../utilities/AuthContext";
import {useTranslation} from "react-i18next";
import baseURL from "../../utilities/baseURL";


type SignInFormType = {
    navigation: NativeStackScreenProps<RootStackParamList, 'HomePage'>['navigation']
    setShowModal: Function
}

type AssistantFormData = {
    joinCode?: string,
    password?: string
}

export default ({navigation, setShowModal}: SignInFormType) => {
    const { t } = useTranslation(["logInModal", "common"]);
    const { signIn } = React.useContext(AuthContext)
    const [formData, setData] = useState<AssistantFormData>({});
    const [submitted, setSubmitted] = useState<boolean>(false)
    const [errors, setErrors] = useState<object>({});
    const toast = useToast()

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
      mutation login_queue($joinCode: String!, $password: String!) {
          loginQueue(joinCode: $joinCode, password: $password){
              ... on Queue {
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
            const response = await fetch(baseURL(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:19006/',
                },
                credentials: 'include',
                body: JSON.stringify({query: query, variables: formData})
            });
            return await response.json()
        } catch (error) {
            return error
        }
    }

    const validate = () => {
        if (formData.joinCode === undefined) {
            setErrors({
                ...errors,
                email: t("joinCode_not_defined_error"),
            });
            return false;
        } else if (formData.joinCode?.length !== 6){
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
        signIn('ASSISTANT')
        setShowModal(false)
        setSubmitted(false)
        navigation.navigate("QueueDashboard")
    }

    const onFailure = () => {
        setSubmitted(false)
    }

    const onSignInPress = () => {
        validate() && logIn() ? onSuccess() : onFailure();
    }

    return (
        <>
            <Box safeArea p="2" py="8" w="90%" maxW="290">
                <VStack space={3} mt="5">
                    <FormControl>
                        <FormControl.Label>Join code</FormControl.Label>
                        <Input
                            placeholder="Ex. 777777"
                            onChangeText={(value) => setData({ ...formData, joinCode: value })}
                         />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>Password</FormControl.Label>
                        <Input
                            type="password"
                            placeholder="Shhh it's a secret"
                            onChangeText={(value) => setData({ ...formData, password: value })}
                        />
                    </FormControl>
                    <Button
                        mt="2"
                        colorScheme="indigo"
                        onPress={() => (onSignInPress)}
                        isLoading={submitted}
                        isLoadingText="Logging in..."
                    >
                        Sign in
                    </Button>
                </VStack>
            </Box>
        </>
    )
}
