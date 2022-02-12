import React, { useEffect, useState } from 'react'
import { Button, FormControl,
        Slider, Stack,
        Text, VStack,
        Select, Input } from 'native-base'
import { HomeScreenProps, RootStackParamList } from "../../types";
import { useTranslation } from "react-i18next";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

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

type CreateQueueFormType = {
    setShowModal: Function
    navigation: NativeStackScreenProps<RootStackParamList, 'HomePage'>['navigation']
}

export default function ({navigation, setShowModal}: CreateQueueFormType) {
    const defaultData = {submitted: false, name: "Sample Queue name", maxSize: 10, gracePeriod: 0, partySize: 1}
    const defaultErrors = {nameInvalid: false}
    const [formData, setData] = useState<DefaultData>(defaultData);
    const [errors, setError] = useState<DefaultErrors>(defaultErrors);
    const [onChangeValue, setOnChangeValue] = useState(500)
    const [onChangeEndValue, setOnChangeEndValue] = useState(500)
    const { t, i18n } = useTranslation(["createQueuePage", "common"]);

    // Be careful with this it might trigger infinite render loop
    useEffect(() => {validate()}, [formData])

    const validate = () => {
        if (formData.name.length > 50) {
            setError({
                    ...errors,
                    nameError: 'Name is too long',
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
            return await response.json()
        } catch(error) {
            return error
        }
    }

    const onSuccess = () => {
        setData({...formData, submitted: true})
        const submissionData = submit()
        console.log(submissionData);
        setShowModal(false)
        navigation.navigate("QueuesPage")
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
                    <FormControl.Label _text={{bold: true}}>{t("business_name_label")}</FormControl.Label>
                    <FormControl.HelperText _text={{fontSize: 'xs'}}>
                        <Text>{t("business_name_helper")}</Text>
                    </FormControl.HelperText>
                    <Input
                        placeholder={"Bob's Burgers"}
                        onChangeText={(value) => setData({ ...formData, name: value })}
                    />
                    <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{"Name Error"}</FormControl.ErrorMessage>
                </Stack>
            </FormControl>
            <FormControl isRequired>
                <Stack>
                    <FormControl.Label _text={{bold: true}}>{t("queue_cap_label", {onChangeValue: onChangeValue})}</FormControl.Label>
                    <FormControl.HelperText _text={{fontSize: 'xs'}}>
                        <Text>{t("queue_cap_helper")}</Text>
                    </FormControl.HelperText>
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
                    <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{"Queue cap error"}</FormControl.ErrorMessage>
                </Stack>
            </FormControl>
            <FormControl isRequired>
                <Stack>
                    <FormControl.Label _text={{bold: true}}>{t("grace_period_label", {gracePeriod: formData.gracePeriod})}</FormControl.Label>
                    <FormControl.HelperText _text={{fontSize: 'xs'}}>
                        <Text>{t("grace_period_helper")}</Text>
                    </FormControl.HelperText>
                    <Select
                        onValueChange={(value) => setData({ ...formData, gracePeriod: parseInt(value) })}
                    >
                        {[...Array(10).keys()].map(number => <Select.Item key={number} label={number.toString()} value="ux" />)}
                    </Select>
                <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{"Grace period error"}</FormControl.ErrorMessage>
                </Stack>
            </FormControl>
            <FormControl isRequired>
                <Stack>
                    <FormControl.Label _text={{bold: true}}>{t("party_size_label", {partySize: formData.partySize})}</FormControl.Label>
                    <FormControl.HelperText _text={{fontSize: 'xs'}}>
                        <Text>{t("party_size_helper")}</Text>
                    </FormControl.HelperText>
                    <Select
                        onValueChange={(value) => setData({ ...formData, partySize: parseInt(value) })}
                    >
                        {[...Array(10).keys()].map(number => <Select.Item key={number} label={number.toString()} value="ux" />)}
                    </Select>
                    <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{"Party size error"}</FormControl.ErrorMessage>
                </Stack>
            </FormControl>
            <Button.Group space={2}>
                <Button
                    mt="5"
                    variant="ghost"
                    colorScheme="blueGray"
                    onPress={() => {
                        setShowModal(false)
                    }}
                >
                    Cancel
                </Button>
                <Button onPress={onSubmit} mt="5" colorScheme="cyan" isLoading={formData.submitted} isLoadingText="Submitting">
                    Submit
                </Button>
            </Button.Group>
        </VStack>
    )
}
