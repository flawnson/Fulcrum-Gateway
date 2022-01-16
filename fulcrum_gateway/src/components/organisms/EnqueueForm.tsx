import React, { useState } from "react";
import { VStack, FormControl,
        Input, Button,
        Center, Text,
        ScaleFade } from "native-base";
import { HomeScreenProps } from "../../../types";
import { useTranslation } from "react-i18next";
import CannotEnqueueAlert from "../atoms/CannotEnqueueAlert";
import {AuthContext} from "../../../App";


type EnqueueFormProps = {
    navigation: HomeScreenProps["navigation"]
}

type EnqueueFormData = {
    name?: string
    joinCode?: string
    phoneNumber?: string
}


export default function ({navigation}: EnqueueFormProps) {
    const [formData, setData] = useState<EnqueueFormData>({})
    const { signIn } = React.useContext(AuthContext)
    const [submitted, setSubmitted] = useState<boolean>(false)
    const [showAlert, setShowAlert] = useState<boolean>(false)
    const [isJoinCodeFormOpen, setJoinCodeFormOpen] = useState<boolean>(true)
    const [isNameFormOpen, setNameFormOpen] = useState<boolean>(false)
    const [isPhoneNumberFormOpen, setPhoneNumberFormOpen] = useState<boolean>(false)
    const [errors, setErrors] = useState<EnqueueFormData>({})
    const { t, i18n } = useTranslation(["homePage", "common"])

    const query = `
        mutation create_user($joinCode: String!, $phoneNumber: String!, $name: String!) {
            createUser(joinCode: $joinCode, phoneNumber: $phoneNumber, name: $name){
                id
            }
        }
    `

    async function joinQueue () {
        try {
            const response = await fetch(`http://localhost:8080/api`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({query: query, variables: formData})
            });
            await response.json().then(
                data => {
                    return data ? data : setShowAlert(true)
                }
            )
        } catch(error) {
            return error
        }
    }

    const validateJoinCode = () => {
        if (formData.joinCode === undefined) {
            setErrors({
                ...errors,
                joinCode: t('join_code_missing'),
            });
            return false;
        } else if (formData.joinCode.length !== 6) {
            setErrors({
                ...errors,
                joinCode: t('join_code_wrong'),
            });
            return false;
        }
        return true;
    };

    const validateName = () => {
        if (formData.name === undefined) {
            setErrors({
                ...errors,
                name: t('name_missing'),
            });
            return false;
        } else if (formData.name.length >= 20) {
            setErrors({
                ...errors,
                name: t('name_too_long'),
            });
            return false;
        }
        return true;
    };

    const validatePhoneNumber = () => {
        if (formData.phoneNumber === undefined) {
            setErrors({
                ...errors,
                phoneNumber: t('phone_number_missing'),
            });
            return false;
        } else if (formData.phoneNumber.length >= 10) {
            setErrors({
                ...errors,
                phoneNumber: t('phone_number_too_long'),
            });
            return false;
        }
        return true;
    };

    const onSuccess = () => {
        joinQueue()
        signIn('USER')
        setSubmitted(true)
        navigation.navigate("UserDashboard")
        // setSubmitted(false)  // In case user goes back to home page (probably wrong :P)
    }

    const onFailure = () => {
        setSubmitted(false)
        // setErrors({...errors, invalid: "invalid submission"})
    }

    const onSubmit = () => {
        // validate() ?  onSuccess() : onFailure();
    };

    return (
        <VStack width="90%" mx="3">
            {isJoinCodeFormOpen && (
                <>
                    <ScaleFade in={isJoinCodeFormOpen} duration={500}>
                        <FormControl isInvalid={"joinCode" in errors}>
                            <Center>
                                <FormControl.Label _text={{bold: true}}>
                                    {t("queue_id")}
                                </FormControl.Label>
                            </Center>
                            <Input
                                placeholder="Ex. 123456"
                                onChangeText={(value) => setData({ ...formData, joinCode: value })}
                            />
                            <Center>
                                <FormControl.HelperText _text={{fontSize: 'xs'}}>
                                    {t('helper')}
                                </FormControl.HelperText>
                            </Center>
                            <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>
                                {errors.joinCode}
                            </FormControl.ErrorMessage>
                        </FormControl>
                        <Button
                            onPress={() => {
                                validateJoinCode() ? setJoinCodeFormOpen(false) : null
                                validateJoinCode() ? setNameFormOpen(true) : null
                            }
                        }
                            mt="5"
                            isLoading={submitted}
                            isLoadingText="Submitting..."
                        >
                            <Text bold color={'white'}>
                                {t('submit', { ns: 'common' })}
                            </Text>
                        </Button>
                        <CannotEnqueueAlert showAlert={showAlert} setShowAlert={setShowAlert}/>
                    </ScaleFade>
                </>
            )}
            {isNameFormOpen && (
                <>
                    <ScaleFade in={isNameFormOpen} duration={500}>
                        <FormControl isInvalid={"name" in errors}>
                            <Center>
                                <FormControl.Label _text={{bold: true}}>
                                    {t("name")}
                                </FormControl.Label>
                            </Center>
                            <Input
                                placeholder="Bob Larry"
                                onChangeText={(value) => setData({ ...formData, name: value })}
                            />
                            <Center>
                                <FormControl.HelperText _text={{fontSize: 'xs'}}>
                                    {t('helper')}
                                </FormControl.HelperText>
                            </Center>
                            <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>
                                {errors.name}
                            </FormControl.ErrorMessage>
                        </FormControl>
                        <Button
                                onPress={() => {
                                    validateName() ? setNameFormOpen(false) : null
                                    validateName() ? setPhoneNumberFormOpen(true) : null
                                }
                            }
                                mt="5"
                                isLoading={submitted}
                                isLoadingText="Submitting...">
                            <Text bold color={'white'}>
                                {t('submit', { ns: 'common' })}
                            </Text>
                        </Button>
                        <CannotEnqueueAlert showAlert={showAlert} setShowAlert={setShowAlert}/>
                    </ScaleFade>
                </>
            )}
            {isPhoneNumberFormOpen && (
                <>
                    <ScaleFade in={isPhoneNumberFormOpen} duration={500}>
                        <FormControl isInvalid={"phoneNumber" in errors}>
                            <Center>
                                <FormControl.Label _text={{bold: true}}>
                                    {t("phone_number")}
                                </FormControl.Label>
                            </Center>
                            <Input
                                placeholder="Ex. 6477135354"
                                onChangeText={(value) => setData({ ...formData, phoneNumber: value })}
                            />
                            <Center>
                                <FormControl.HelperText _text={{fontSize: 'xs'}}>
                                    {t('helper')}
                                </FormControl.HelperText>
                            </Center>
                            <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>
                                {errors.phoneNumber}
                            </FormControl.ErrorMessage>
                        </FormControl>
                        <Button
                                onPress={() => {
                                    validatePhoneNumber() ? setPhoneNumberFormOpen(false) : null
                                    validatePhoneNumber() ? onSubmit() : null
                                }
                            }
                            mt="5"
                                isLoading={submitted}
                                isLoadingText="Submitting...">
                            <Text bold color={'white'}>
                                {t('submit', { ns: 'common' })}
                            </Text>
                        </Button>
                        <CannotEnqueueAlert showAlert={showAlert} setShowAlert={setShowAlert}/>
                    </ScaleFade>
                </>
            )}
        </VStack>
    );
}
