import React, {useCallback, useState} from "react"
import { Box, VStack,
        FormControl, Input,
        Button, useToast } from "native-base"
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import {AuthContext} from "../../utilities/AuthContext";
import {useTranslation} from "react-i18next";
import baseURL from "../../utilities/baseURL";
import corsURL from "../../utilities/corsURL";


type SignInFormType = {
    navigation: NativeStackScreenProps<RootStackParamList, 'HomePage'>['navigation']
    setShowModal: Function
}

type AssistantFormData = {
    joinCode?: string,
    password?: string
}

export default ({navigation, setShowModal}: SignInFormType) => {
    const { t } = useTranslation(["assistantLoginForm", "common"]);
    const { signIn } = React.useContext(AuthContext)
    const [formData, setData] = useState<AssistantFormData>({});
    const [submitted, setSubmitted] = useState<boolean>(false)
    const [errors, setErrors] = useState<AssistantFormData>({});
    const [showPassword, setShowPassword] = React.useState(false);
    const toast = useToast()
    const toastId = "errorToast"

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    useCallback(() => {
        // Alert will show if nothing has happened within 10 seconds of submitting the enqueue form.
        setTimeout(() => {
            if (submitted) {
                setSubmitted(false)
                toast.show({
                    id: toastId,
                    title: t('something_went_wrong', {ns: "common"}),
                    status: "error",
                    description: t("cannot_login_message"),
                    duration: 10
                })
            }
        }, 10000)
    }, [submitted])

    const query = `
      mutation login_queue($joinCode: String!, $password: String!) {
          loginQueue(joinCode: $joinCode, password: $password){
              ... on Queue {
                  queueId: id
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
                body: JSON.stringify({query: query, variables: formData})
            }).then(response => response.json()).then(data => {
                if (data.data.loginQueue.error === "QUEUE_DOES_NOT_EXIST") {
                    toast.show({
                        title: t('something_went_wrong', {ns: "common"}),
                        status: "error",
                        description: t("queue_does_not_exist_error")
                    })
                } else if (data.data.loginOrganizer.error === "INCORRECT_PASSWORD") {
                    toast.show({
                        title: t('something_went_wrong', {ns: "common"}),
                        status: "error",
                        description: t("wrong_password_error")
                    })
                } else {
                    setShowModal(false)
                    navigation.navigate("QueueDashboard", {queueId: data.data.loginQueue.queueId})
                }
                setSubmitted(false)
                }
            )
        } catch (error) {
            return error
        }
    }

    const validate = () => {
        if (formData.joinCode === undefined) {
            setErrors({
                ...errors,
                joinCode: t("joinCode_not_defined_error"),
            });
            return false;
        } else if (formData.joinCode?.length !== 6){
            setErrors({
                ...errors,
                joinCode: t("invalid_joinCode_error"),
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
        logIn().then()
    }

    const onFailure = () => {
        setSubmitted(false)
    }

    const onSignInPress = () => {
        setSubmitted(true)
        validate() ? onSuccess() : onFailure();
    }

    return (
        <>
            <Box safeArea p="2" py="8" w="90%" maxW="290">
                <VStack space={3} mt="5">
                    <FormControl>
                        <FormControl.Label>{t("joinCode_title")}</FormControl.Label>
                        <Input
                            placeholder="Ex. 777777"
                            onChangeText={(value) => setData({ ...formData, joinCode: value })}
                         />
                        <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{errors.joinCode}</FormControl.ErrorMessage>
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>{t("password_title")}</FormControl.Label>
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
                        <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{errors.password}</FormControl.ErrorMessage>
                    </FormControl>
                    <Button
                        mt="2"
                        colorScheme="indigo"
                        onPress={() => (onSignInPress())}
                        isLoading={submitted}
                        isLoadingText={t("logging_in", {ns: "common"})}
                    >
                        {t("login", {ns: "common"})}
                    </Button>
                </VStack>
            </Box>
        </>
    )
}
