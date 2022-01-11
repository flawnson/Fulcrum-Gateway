import React, { useState } from "react";
import { VStack, FormControl,
        Input, Button,
        Center, Text} from "native-base";
import { HomeScreenProps } from "../../../types";
import { useTranslation } from "react-i18next";
import CannotEnqueueAlert from "../atoms/CannotEnqueueAlert";


type EnqueueFormProps = {
    navigation: HomeScreenProps["navigation"]
    setShowModal?: React.Dispatch<React.SetStateAction<boolean>>
}

type EnqueueFormData = {
    name?: string
    joinCode?: string
    phoneNumber?: number
}


export default function ({navigation, setShowModal}: EnqueueFormProps) {
    const [formData, setData] = useState<EnqueueFormData>({})
    const [submitted, setSubmitted] = useState<boolean>(false)
    const [showAlert, setShowAlert] = useState<boolean>(false)
    const [errors, setErrors] = useState<object>({})
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
                    return data ? data : setErrors({...errors, login: 'Cannot login to paused or inactive queue'})
                }
            )
        } catch(error) {
            return error
        }
    }

    const validate = () => {
        if (formData.name === undefined) {
            setErrors({
                ...errors,
                name: 'ID is required',
            });
            return false;
        } else if (formData.name.length !== 10) {
            setErrors({
                ...errors,
                name: 'ID is too short',
            });
            return false;
        }
        return true;
    };

    const onSuccess = () => {
        setSubmitted(true)
        navigation.navigate("UserDashboard")
        setSubmitted(false)  // In case user goes back to home page (probably wrong :P)
    }

    const onFailure = () => {
        setSubmitted(false)
        setErrors({...errors, invalid: "invalid submission"})
    }

    const onSubmit = () => {
        validate() ?  onSuccess() : onFailure();
        joinQueue()
        if (setShowModal) {setShowModal(false)}
        navigation.navigate("UserDashboard")
    };

    return (
        <VStack width="90%" mx="3">
            <FormControl>
                <Center>
                    <FormControl.Label _text={{bold: true}}>{t("queue_id")}</FormControl.Label>
                </Center>
                <Input
                    placeholder="Ex. 6477135354"
                    onChangeText={(value) => setData({ ...formData, joinCode: value })}
                />
                <Center>
                    <FormControl.HelperText _text={{fontSize: 'xs'}}>
                        {t('helper')}
                    </FormControl.HelperText>
                </Center>
                <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>Error Name</FormControl.ErrorMessage>
            </FormControl>
            <Button onPress={onSubmit} mt="5" isLoading={submitted} isLoadingText="Submitting...">
                <Text bold color={'white'}>
                    {t('submit', { ns: 'common' })}
                </Text>
            </Button>
            <CannotEnqueueAlert showAlert={showAlert} setShowAlert={setShowAlert}/>
        </VStack>
    );
}
