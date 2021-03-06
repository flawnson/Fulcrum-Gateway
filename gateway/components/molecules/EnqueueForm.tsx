import React, { useState, useEffect, useCallback } from "react";
import { VStack, FormControl,
        Input, Button,
        Center, Text,
        ScaleFade, useToast } from "native-base";
import { RootStackParamList, HomeScreenProps } from "../../types";
import { useTranslation } from "react-i18next";
import {AuthContext} from "../../utilities/AuthContext";
import LoadingSpinner from "../atoms/LoadingSpinner";
import baseURL from "../../utilities/baseURL";
import AreaCodeSelector from "../atoms/AreaCodeSelector";
import corsURL from "../../utilities/corsURL";
import {RouteProp} from "@react-navigation/native";
import LoginModal from "../../containers/LoginModal";


type EnqueueFormProps = {
    queueId?: string  // Only provided if enqueue form is in a modal and the user type is an ORGANIZER or ASSISTANT
    joinCode?: string  // Only provided if enqueue form is in a modal
    route?: RouteProp<RootStackParamList, "HomePage">  // Only provide if joining queue via link
    navigation: HomeScreenProps["navigation"]
    setShowModal?: React.Dispatch<React.SetStateAction<boolean>>  // Modal for Organizer/Assistant side user creation
}

type EnqueueFormData = {
    name?: string
    joinCode?: string
    phoneNumber?: string
}


export default function ({queueId, joinCode, route, navigation, setShowModal}: EnqueueFormProps) {
    const { t } = useTranslation(["homePage", "common"])
    const [formData, setData] = useState<EnqueueFormData>({})
    const [areaCode, setAreaCode] = useState<string>("1")
    const { signIn, signedInAs } = React.useContext(AuthContext)
    const [submitted, setSubmitted] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [isJoinCodeFormOpen, setJoinCodeFormOpen] = useState<boolean>(true)
    const [isNameFormOpen, setNameFormOpen] = useState<boolean>(false)
    const [isPhoneNumberFormOpen, setPhoneNumberFormOpen] = useState<boolean>(false)
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [errors, setError] = useState<any>([]);
    const [formErrors, setFormErrors] = useState<EnqueueFormData>({})
    const toast = useToast()
    const toastId = "errorToast"

    useEffect(() => {
        if (!!errors.length) {
            if (!toast.isActive(toastId)) {
                toast.show({
                    id: toastId,
                    title: t('something_went_wrong', {ns: "common"}),
                    status: "error",
                    description: t("cannot_enqueue_message"),
                    duration: 10
                })
            }
        }
    }, [errors])  // Render alert if errors

    useEffect(() => {
        // If route contains params (from ShareScreen) then automatically input the joincode
        if (joinCode || route?.params) {
            setJoinCodeFormOpen(false)
            setNameFormOpen(true)
            setData({...formData, joinCode: !!joinCode ? joinCode : route?.params!["joinCode"]})
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

    const joinQueueQuery = `
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

    const organizerCreateUserQuery = `
        mutation create_user($queueId: String!, $phoneNumber: String, $name: String!) {
            createUser(queueId: $queueId, phoneNumber: $phoneNumber, name: $name){
                ... on User {
                    id
                }
                ... on Error {
                    error
                }
            }
        }
    `

    const assistantCreateUserQuery = `
        mutation create_user($phoneNumber: String, $name: String!) {
            createUser(phoneNumber: $phoneNumber, name: $name){
                ... on User {
                    id
                }
                ... on Error {
                    error
                }
            }
        }
    `

    const body = signedInAs === "ORGANIZER" ? {query: organizerCreateUserQuery, variables: {queueId: queueId,
                                                                                            phoneNumber: formData.phoneNumber,
                                                                                            name: formData.name}}
               : signedInAs === "ASSISTANT" ? {query: assistantCreateUserQuery, variables: {phoneNumber: formData.phoneNumber,
                                                                                            name: formData.name}}
               : {query: joinQueueQuery, variables: formData}

    async function joinQueue () {
        setLoading(true)
        try {
            fetch(baseURL(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': corsURL(),
                },
                credentials: 'include',
                body: JSON.stringify(body)  // Directly pass formData as variables
            }).then(response => response.json()).then(data => {
                    // If response is valid and returns an id, then set auth context, submit, and navigate to dashboard
                    if (!!data.errors?.length) {
                        // Check for errors on response
                        setError([...errors, data.errors])
                    } else if (data.data.joinQueue?.error === "QUEUE_DOES_NOT_EXIST") {
                        // Check if user exists on backend
                        toast.show({
                            title: t('queue_does_not_exist_title'),
                            status: "error",
                            description: t("queue_does_not_exist_message", {joinCode: formData.joinCode}),
                            duration: 10
                        })
                    } else if (data.data.joinQueue?.error === "USER_ALREADY_EXISTS") {
                        // Check if user exists on backend
                        toast.show({
                            title: t('already_enqueued_title'),
                            status: "error",
                            description: t("already_enqueued_message"),
                            duration: 10
                        })
                        signIn('USER')
                        // RECONSIDER THIS BECAUSE THEY DON'T NEED TO RESUBMIT SMS VERIFICATION IF THEY ALREADY EXIST
                        navigation.navigate("UserDashboard", {name: formData.name!, phoneNumber: formData.phoneNumber!})
                    } else if (data?.data?.createUser) {
                        // Case if Organizer or Assistant creates user
                    } else if (data?.data?.joinQueue.id) {
                        signIn('USER')
                        navigation.navigate("UserDashboard", {name: formData.name!, phoneNumber: formData.phoneNumber!})
                    }
                    // turn back to false for when user revisits page
                    setSubmitted(false)
                    // Reopen Join code form in case of revisit
                    setJoinCodeFormOpen(true)
                }
            )
            setLoading(false)
        } catch(error) {
            setError([...errors, error])
        }
    }

    const validateJoinCode = () => {
        if (formData.joinCode === undefined) {
            setFormErrors({
                ...formErrors,
                joinCode: t('join_code_missing'),
            });
            return false;
        } else if (formData.joinCode.length !== 6) {
            setFormErrors({
                ...formErrors,
                joinCode: t('join_code_wrong'),
            });
            return false;
        }
        return true;
    };

    const validateName = () => {
        if (formData.name === undefined) {
            setFormErrors({
                ...formErrors,
                name: t('name_missing'),
            });
            return false;
        } else if (formData.name.length >= 20) {
            setFormErrors({
                ...formErrors,
                name: t('name_too_long'),
            });
            return false;
        }
        return true;
    };

    const validatePhoneNumber = () => {
        if (formData.phoneNumber === undefined) {
            setFormErrors({
                ...formErrors,
                phoneNumber: t('phone_number_missing'),
            });
            return false;
        } else if (isNaN(formData.phoneNumber as any)) {
            setFormErrors({
                ...formErrors,
                phoneNumber: t('phone_number_not_number'),
            });
            return false;
        }
        return true;
    };

    const onSubmit = () => {
        // Attempt to join queue first, and if successful, update UI
        setSubmitted(true)
        joinQueue().then()
    };

    return (
        <>
            <LoadingSpinner show={loading} light={false}/>
            {isJoinCodeFormOpen && (
                <>
                    <ScaleFade in={isJoinCodeFormOpen} duration={500}>
                        <FormControl isInvalid={"joinCode" in formErrors}>
                            <Center>
                                <FormControl.Label _text={{bold: true}}>
                                    {t("join_code")}
                                </FormControl.Label>
                            </Center>
                            <Input
                                autoFocus={true}
                                keyboardType="numeric"
                                placeholder="Ex. 123456"
                                onChangeText={(value) => setData({ ...formData, joinCode: value })}
                                onKeyPress={(event) => {
                                    if (event.nativeEvent.key === "Enter") {
                                        validateJoinCode() ? setJoinCodeFormOpen(false) : null
                                        validateJoinCode() ? setNameFormOpen(true) : null
                                    }
                                }
                            }
                            />
                            <Center>
                                <FormControl.HelperText _text={{fontSize: 'xs'}}>
                                    {t('join_code_helper')}
                                </FormControl.HelperText>
                            </Center>
                            <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>
                                {formErrors.joinCode}
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
                        <FormControl isInvalid={"name" in formErrors}>
                            <Center>
                                <FormControl.Label _text={{bold: true}}>
                                    {t("name")}
                                </FormControl.Label>
                            </Center>
                            <Input
                                autoFocus={true}
                                placeholder="Bob Larry"
                                onChangeText={(value) => setData({ ...formData, name: value })}
                                onKeyPress={(event) => {
                                    if (event.nativeEvent.key === "Enter") {
                                        validateName() ? setNameFormOpen(false) : null
                                        validateName() ? setPhoneNumberFormOpen(true) : null
                                    }
                                }
                            }
                            />
                            <Center>
                                <FormControl.HelperText _text={{fontSize: 'xs'}}>
                                    {t('name_helper')}
                                </FormControl.HelperText>
                            </Center>
                            <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>
                                {formErrors.name}
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
                        <FormControl isInvalid={"phoneNumber" in formErrors}>
                            <Center>
                                <FormControl.Label _text={{bold: true}}>
                                    {t("phone_number")}
                                </FormControl.Label>
                            </Center>
                            <Input
                                autoFocus={true}
                                InputLeftElement={<AreaCodeSelector areaCode={areaCode} setAreaCode={setAreaCode}/>}
                                placeholder="Ex. 6477135354"
                                onChangeText={(value) => setData({ ...formData, phoneNumber: areaCode + value })}
                                onKeyPress={(event) => {
                                    if (event.nativeEvent.key === "Enter") {
                                        validatePhoneNumber() ? setPhoneNumberFormOpen(false) : null
                                        validatePhoneNumber() ? onSubmit() : null
                                        // If form is in modal (and modal dispatch is provided in props) then close modal
                                        !!setShowModal ? setShowModal(false) : null
                                    }
                                }
                            }
                            />
                            <Center>
                                <FormControl.HelperText _text={{fontSize: 'xs'}}>
                                    {t('phone_number_helper')}
                                </FormControl.HelperText>
                            </Center>
                            <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>
                                {formErrors.phoneNumber}
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
            <Text bold mt="5" color={'black'}>
                {t("organizer_login")}
            </Text>
            <Button
                width="215"
                onPress={() => setShowLoginModal(true)}
                mt="5"
            >
                <Text bold color={'white'}>
                    {t('login', { ns: 'common' })}
                </Text>
            </Button>
            <LoginModal showModal={showLoginModal} setShowModal={setShowLoginModal}/>
        </>
    );
}
