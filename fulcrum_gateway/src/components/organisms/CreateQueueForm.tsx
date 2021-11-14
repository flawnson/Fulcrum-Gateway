import React, {useEffect, useState} from 'react'
import {Button, Center,
        FormControl, Input,
        Slider, Stack,
        Text, VStack,
        Select} from 'native-base'
import {HomeScreenProps} from "../../../types";
import {useTranslation} from "react-i18next";

type DefaultData = {
    submitted: boolean,
    name: string,
    maxSize: number,
    gracePeriod: number,
    partySize: number,
}

type DefaultErrors = {
    nameError?: string
    nameInvalid: boolean,
}

export default function ({navigation}: HomeScreenProps) {
    const defaultData = {submitted: false, name: "Sample Queue name", maxSize: 10, gracePeriod: 0, partySize: 1}
    const defaultErrors = {nameInvalid: false}
    const [formData, setData] = useState<DefaultData>(defaultData);
    const [errors, setError] = useState<DefaultErrors>(defaultErrors);
    const [onChangeValue, setOnChangeValue] = useState(500)
    const [onChangeEndValue, setOnChangeEndValue] = useState(500)
    const [gracePeriod, setGracePeriod] = useState(5)
    const { t, i18n } = useTranslation(["createQueuePage", "common"]);

    // Be careful with this it might trigger infinite render loop
    useEffect(() => {validate()}, [])

    const validate = () => {
        if (formData.name.length > 50) {
            setError({
                    ...errors,
                    nameError: 'Name is too short',
                });
                setError({...errors, nameInvalid: true})
        } else {
            setError({...errors, nameInvalid: false})
        }
    }

    const check = () => {
        if (formData.name === undefined) {
            setError({
                ...errors,
                nameError: 'Name is required',
            });
            setError({...errors, nameInvalid: true})
        }
        return true;
    };

    async function submit () {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            // enter you logic when the fetch is successful
            return await response.json()
        } catch(error) {
            // enter your logic for when there is an error (ex. error toast)
            return error
        }
    }

    const onSuccess = () => {
        setData({...formData, submitted: true})
        const submissionData = submit()
        console.log(submissionData);
        navigation.navigate("OrganizerDashboard")
        setData({...formData, submitted: false})
    }

    const onFailure = () => {
        console.log("you suck")
    }

    const onSubmit = () => {
        setData({...formData, submitted: true})
        check() ? onSuccess() : onFailure();

    };

    return (
        <VStack width="90%" mx="3">
            <FormControl isRequired isInvalid={errors.nameInvalid}>
                <Stack>
                    <Center>
                        <FormControl.Label _text={{bold: true}}>{t("business_name_label")}</FormControl.Label>
                    </Center>
                    <Center>
                        <FormControl.HelperText _text={{fontSize: 'xs'}}>
                            <Text>{t("business_name_helper")}</Text>
                        </FormControl.HelperText>
                    </Center>
                    <Input
                        placeholder={"Bob's Burgers"}
                        onChangeText={(value) => setData({ ...formData, name: value })}
                    />
                    <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{"Name Error"}</FormControl.ErrorMessage>
                </Stack>
            </FormControl>
            <FormControl isRequired isInvalid={errors.nameInvalid}>
                <Stack>
                    <Center>
                        <FormControl.Label _text={{bold: true}}>{t("queue_cap_label", {onChangeValue: onChangeValue})}</FormControl.Label>
                    </Center>
                    <Center>
                        <FormControl.HelperText _text={{fontSize: 'xs'}}>
                            <Text>{t("queue_cap_helper")}</Text>
                        </FormControl.HelperText>
                    </Center>
                    <Slider
                        defaultValue={500}
                        colorScheme="cyan"
                        onChange={(v) => {
                            setOnChangeValue(Math.floor(v))
                        }}
                        onChangeEnd={(v) => {
                            v && setOnChangeEndValue(Math.floor(v))
                            setData({...formData, maxSize: v})
                        }}
                        minValue={0}
                        maxValue={1000}
                    >
                        <Slider.Track>
                            <Slider.FilledTrack />
                        </Slider.Track>
                        <Slider.Thumb />
                    </Slider>
                    <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{"Name Error"}</FormControl.ErrorMessage>
                </Stack>
            </FormControl>
            <FormControl isRequired isInvalid={errors.nameInvalid}>
                <Stack>
                    <Center>
                        <FormControl.Label _text={{bold: true}}>{t("grace_period_label", {gracePeriod: formData.gracePeriod})}</FormControl.Label>
                    </Center>
                    <Center>
                        <FormControl.HelperText _text={{fontSize: 'xs'}}>
                            <Text>{t("grace_period_helper")}</Text>
                        </FormControl.HelperText>
                    </Center>
                    <Select
                        placeholder={"0"}
                        onValueChange={(value) => setData({ ...formData, gracePeriod: parseInt(value) })}
                    >
                        {[...Array(10).keys()].map(number => <Select.Item key={number} label={number.toString()} value="ux" />)}
                    </Select>
                <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{"Name Error"}</FormControl.ErrorMessage>
                </Stack>
            </FormControl>
            <FormControl isRequired isInvalid={errors.nameInvalid}>
                <Stack>
                    <Center>
                        <FormControl.Label _text={{bold: true}}>{t("party_size_label", {partySize: formData.partySize})}</FormControl.Label>
                    </Center>
                    <Center>
                        <FormControl.HelperText _text={{fontSize: 'xs'}}>
                            <Text>{t("party_size_helper")}</Text>
                        </FormControl.HelperText>
                    </Center>
                    <Select
                        placeholder={"0"}
                        onValueChange={(value) => setData({ ...formData, partySize: parseInt(value) })}
                    >
                        {[...Array(10).keys()].map(number => <Select.Item label={number.toString()} value="ux" />)}
                    </Select>
                    <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{"Name Error"}</FormControl.ErrorMessage>
                </Stack>
            </FormControl>
            <Button onPress={onSubmit} mt="5" colorScheme="cyan" isLoading={formData.submitted} isLoadingText="Submitting">
                Submit
            </Button>
        </VStack>
    )
}
