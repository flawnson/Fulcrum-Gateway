import React, { useState, useEffect, useCallback } from "react";
import { VStack, FormControl,
        Input, Button,
        Center, Text,
        ScaleFade, useToast } from "native-base";
import { HomeScreenProps } from "../../types";
import { useTranslation } from "react-i18next";
import {AuthContext} from "../../utilities/AuthContext";
import LoadingSpinner from "../atoms/LoadingSpinner";
import baseURL from "../../utilities/baseURL";
import AreaCodeSelector from "../atoms/AreaCodeSelector";


type EnqueueFormProps = {
    joinCode?: string
    navigation: HomeScreenProps["navigation"]
    setShowModal?: React.Dispatch<React.SetStateAction<boolean>>  // Modal for Organizer/Assistant side user creation
}

type EnqueueFormData = {
    name?: string
    joinCode?: string
    phoneNumber?: string
}


export default function ({joinCode, navigation, setShowModal}: EnqueueFormProps) {
    const { t } = useTranslation(["homePage", "common"])
    const [formData, setData] = useState<EnqueueFormData>({})
    const [areaCode, setAreaCode] = useState<string>("1")
    const { signIn } = React.useContext(AuthContext)
    const [submitted, setSubmitted] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [isJoinCodeFormOpen, setJoinCodeFormOpen] = useState<boolean>(true)
    const [isNameFormOpen, setNameFormOpen] = useState<boolean>(false)
    const [isPhoneNumberFormOpen, setPhoneNumberFormOpen] = useState<boolean>(false)
    const [errors, setErrors] = useState<EnqueueFormData>({})
    const toast = useToast()

    useEffect(() => {
        // If route contains params (from ShareScreen) then automatically input the joincode
        if (joinCode) {
            setJoinCodeFormOpen(false)
            setNameFormOpen(true)
            setData({...formData, joinCode: joinCode})
        }
    }, [])

    useCallback(() => {
        // Alert will show if nothing has happened within 10 seconds of submitting the enqueue form.
        setTimeout(() => {
            if (loading) {
                setLoading(false)
                setSubmitted(false)
                toast.show({
                    title: t('something_went_wrong', {ns: "common"}),
                    status: "error",
                    description: t("cannot_enqueue_message")
                })
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
            console.log("Joining Queue")
            const response = await fetch(baseURL(), {
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
                        setSubmitted(false) // turn back to false for when user revisits page
                    } else {
                        setSubmitted(false)
                        toast.show({
                            title: t('something_went_wrong', {ns: "common"}),
                            status: "error",
                            description: t("cannot_enqueue_message")
                        })
                    }
                    setJoinCodeFormOpen(true)
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
        } else if (formData.phoneNumber.length > 10) {
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
        // Append the area code to the phone number before sending request
        setData({...formData, phoneNumber: areaCode + formData.phoneNumber})
        // Attempt to join queue first, and if successful, update UI
        joinQueue().then()
    };

    return (
        <>
            <LoadingSpinner show={loading} light={false}/>
            {isJoinCodeFormOpen && (
                <>
                    <ScaleFade in={isJoinCodeFormOpen} duration={500}>
                        <FormControl isInvalid={"joinCode" in errors}>
                            <Center>
                                <FormControl.Label _text={{bold: true}}>
                                    {t("join_code")}
                                </FormControl.Label>
                            </Center>
                            <Input
                                placeholder="Ex. 123456"
                                onChangeText={(value) => setData({ ...formData, joinCode: value })}
                            />
                            <Center>
                                <FormControl.HelperText _text={{fontSize: 'xs'}}>
                                    {t('join_code_helper')}
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
                                    {t('name_helper')}
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
                                isLoadingText="Submitting..."
                        >
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
                                InputLeftElement={<AreaCodeSelector areaCode={areaCode} setAreaCode={setAreaCode}/>}
                                placeholder="Ex. 6477135354"
                                onChangeText={(value) => setData({ ...formData, phoneNumber: value })}
                            />
                            <Center>
                                <FormControl.HelperText _text={{fontSize: 'xs'}}>
                                    {t('phone_number_helper')}
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
                                isLoadingText="Submitting..."
                        >
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
