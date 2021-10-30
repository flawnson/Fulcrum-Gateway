import React, {useEffect, useState} from 'react'
import {Button, Center, FormControl, Input, Slider, Stack, Text, VStack} from 'native-base'
import {HomeScreenProps} from "../../../types";

type defaultData = {
    submitted: boolean,
    name: string,
    maxSize: number,
    gracePeriod: number,
}

type defaultErrors = {
    nameError?: string
    nameInvalid: boolean,
}

export default function ({navigation}: HomeScreenProps) {
    const defaultData = {submitted: false, name: "Sample Queue name", maxSize: 9, gracePeriod: 0}
    const defaultErrors = {nameInvalid: false}
    const [formData, setData] = useState<defaultData>(defaultData);
    const [errors, setErrors] = useState<defaultErrors>(defaultErrors);
    const [onChangeValue, setOnChangeValue] = useState(500)
    const [onChangeEndValue, setOnChangeEndValue] = useState(500)
    const [gracePeriod, setGracePeriod] = useState(5)

    useEffect(() => {validate()})

    const validate = () => {
        if (formData.name.length > 50) {
            setErrors({
                    ...errors,
                    nameError: 'Name is too short',
                });
                setErrors({...errors, nameInvalid: true})
        } else {
            setErrors({...errors, nameInvalid: false})
        }
    }

    const check = () => {
        if (formData.name === undefined) {
            setErrors({
                ...errors,
                nameError: 'Name is required',
            });
            setErrors({...errors, nameInvalid: true})
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
                        <FormControl.Label _text={{bold: true}}>What's your name?</FormControl.Label>
                    </Center>
                    <Center>
                        <FormControl.HelperText _text={{fontSize: 'xs'}}>
                            <Text>What's the name of your business, event, or venue?</Text>
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
                        <FormControl.Label _text={{bold: true}}>Cap the queue at {onChangeValue} queuers</FormControl.Label>
                    </Center>
                    <Center>
                        <FormControl.HelperText _text={{fontSize: 'xs'}}>
                            <Text>There is a maximum of 1000 queuers allowed</Text>
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
                        <FormControl.Label _text={{bold: true}}>Wait for {formData.gracePeriod} minutes when summoning a queuer</FormControl.Label>
                    </Center>
                    <Center>
                        <FormControl.HelperText _text={{fontSize: 'xs'}}>
                            <Text>Set a grace period for summoned queuers to reach your venue</Text>
                        </FormControl.HelperText>
                    </Center>
                    <Input
                        placeholder={"5"}
                        onChangeText={(value) => setData({ ...formData, gracePeriod: parseInt(value) })}
                    />
                    <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{"Name Error"}</FormControl.ErrorMessage>
                </Stack>
            </FormControl>
            <Button onPress={onSubmit} mt="5" colorScheme="cyan" isLoading={formData.submitted} isLoadingText="Submitting">
                Submit
            </Button>
        </VStack>
    )
}
