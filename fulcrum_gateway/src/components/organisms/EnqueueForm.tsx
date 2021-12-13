import React from "react";
import { VStack, FormControl,
        Input, Button,
        Center, Text } from "native-base";
import { HomeScreenProps } from "../../../types";
import { useTranslation } from "react-i18next";


export default function ({navigation}: HomeScreenProps) {
    const [formData, setData] = React.useState<any>({submitted: false});
    const [errors, setErrors] = React.useState<object>({});
    const { t, i18n } = useTranslation(["homePage", "common"]);
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
