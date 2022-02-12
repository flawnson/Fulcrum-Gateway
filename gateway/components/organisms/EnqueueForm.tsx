import React, { useState, useEffect, useCallback } from "react";
import { VStack, FormControl,
        Input, Button,
        Center, Text,
        ScaleFade } from "native-base";
import { HomeScreenProps } from "../../types";
import { useTranslation } from "react-i18next";
import GeneralErrorAlert from "../atoms/GeneralErrorAlert";
import {AuthContext} from "../../utilities/AuthContext";
import LoadingSpinner from "../atoms/LoadingSpinner";
import {useRoute} from "@react-navigation/native";


type EnqueueFormProps = {
    navigation: HomeScreenProps["navigation"]
    setShowModal?: React.Dispatch<React.SetStateAction<boolean>>  // Modal for Organizer/Assistant side user creation
}

type EnqueueFormData = {
    name?: string
    joinCode?: string
    phoneNumber?: string
}


export default function ({navigation, setShowModal}: EnqueueFormProps) {
    const route = useRoute<HomeScreenProps["route"]>()
    const [formData, setData] = useState<EnqueueFormData>({})
    const { signIn } = React.useContext(AuthContext)
    const [submitted, setSubmitted] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [showAlert, setShowAlert] = useState<boolean>(false)
    const [isJoinCodeFormOpen, setJoinCodeFormOpen] = useState<boolean>(true)
    const [isNameFormOpen, setNameFormOpen] = useState<boolean>(false)
    const [isPhoneNumberFormOpen, setPhoneNumberFormOpen] = useState<boolean>(false)
    const [errors, setErrors] = useState<EnqueueFormData>({})
    const { t, i18n } = useTranslation(["homePage", "common"])

    if (route.params) {
        // If route contains params (from ShareScreen) then automatically input the joincode
        setJoinCodeFormOpen(false)
        setNameFormOpen(true)
        setData({...formData, joinCode: route.params!["joinCode"]})
        console.log("AUTOFILLED")
    }

    useCallback(() => {
        // Alert will show if nothing has happened within 10 seconds of submitting the enqueue form.
        setTimeout(() => {
            if (loading) {
                setLoading(false)
                setSubmitted(false)
                setShowAlert(true)
                setJoinCodeFormOpen(true)
            }
        }, 10000)
    }, [loading])

    const query = `
        mutation join_queue($joinCode: String!, $phoneNumber: String!, $name: String!) {
            joinQueue(joinCode: $joinCode, phoneNumber: $phoneNumber, name: $name){
                ... on User {
                    id
                }
                ... on Error {
                    error
                }
            }
        }
    `

    async function joinQueue () {
        setLoading(true)
        try {
            const response = await fetch(`http://localhost:8080/api`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({query: query, variables: formData})  // Directly pass formData as variables
            });
            await response.json().then(
                data => {
                    // If response is valid and returns an id, then set auth context, submit, and navigate to dashboard
                    if (data?.data?.createUser || data?.data?.joinQueue.id) {
                        signIn('USER')
                        setSubmitted(true)
                        navigation.navigate("UserDashboard")
                    } else {
                        setSubmitted(false)
                        setShowAlert(true)
                        setJoinCodeFormOpen(true)
                    }
                }
            )
            setLoading(false)
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
        } else if (isNaN(formData.phoneNumber as any)) {
            setErrors({
                ...errors,
                phoneNumber: t('phone_number_not_number'),
            });
            return false;
        }
        return true;
    };

    const onSubmit = () => {
        // Attempt to join queue first, and if successful, update UI
        joinQueue().then()
    };

    return (
        <>
            <GeneralErrorAlert
                showAlert={showAlert}
                setShowAlert={setShowAlert}
                message={t("cannot_enqueue_message")}
            />
            <LoadingSpinner show={loading} />
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
                                    // If form is in modal (and modal dispatch is provided in props) then close modal
                                    !!setShowModal ? setShowModal(false) : null
                                }
                            }
                                mt="5"
                                isLoading={submitted}
                                isLoadingText="Submitting...">
                            <Text bold color={'white'}>
                                {t('submit', { ns: 'common' })}
                            </Text>
                        </Button>
                    </ScaleFade>
                </>
            )}
        </>
    );
}
