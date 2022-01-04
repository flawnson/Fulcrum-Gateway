import React from "react";
import { VStack, FormControl,
        Input, Button,
        Center, Text } from "native-base";
import { HomeScreenProps } from "../../../types";
import { useTranslation } from "react-i18next";


type EnqueueFormProps = {
    navigation: HomeScreenProps["navigation"]
    setShowModal?: React.Dispatch<React.SetStateAction<boolean>>
}


export default function ({navigation, setShowModal}: EnqueueFormProps) {
    const [formData, setData] = React.useState<any>({submitted: false});
    const [errors, setErrors] = React.useState<object>({});
    const { t, i18n } = useTranslation(["homePage", "common"]);

    const query = `
        mutation create_user($joinCode: String!, $phoneNumber: String!, $name: String!) {
            createUser(joinCode: $joinCode, phoneNumber: $phoneNumber, name: $name){
                id
            }
        }
    `
    const variables = `{
        "joinCode": "123456",
        "name": "Darth vader",
        "phoneNumber": "1231114444"
    }`

    async function joinQueue () {
        try {
            const response = await fetch(`http://localhost:8080/api?query=${query}&variables=${variables}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            return await response.json()
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
        setData({...formData, submitted: true})
        navigation.navigate("UserDashboard")
        setData({...formData, submitted: false})  // In case user goes back to home page (probably wrong :P)
    }

    const onFailure = () => {
        setData({...formData, submitted: false})
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
                    onChangeText={(value) => setData({ ...formData, name: value })}
                />
                <Center>
                    <FormControl.HelperText _text={{fontSize: 'xs'}}>
                        {t('helper')}
                    </FormControl.HelperText>
                </Center>
                <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>Error Name</FormControl.ErrorMessage>
            </FormControl>
            <Button onPress={onSubmit} mt="5" isLoading={formData.submitted} isLoadingText="Submitting">
                <Text bold color={'white'}>
                    {t('submit', { ns: 'common' })}
                </Text>
            </Button>
        </VStack>
    );
}
