import React, {useState, useEffect} from 'react'
import {FormControl, VStack, Center, Input, Button, Stack, Text} from 'native-base'
import {HomeScreenProps} from "../../../types";
import InputGroup from "../molecules/InputGroup";

type defaultData = {
    submitted: boolean,
    name: string
}

type defaultErrors = {
    nameError?: string
    nameInvalid: boolean,
}

export default function ({navigation}: HomeScreenProps) {
    const defaultData = {submitted: false, name: "Sample Queue name"}
    const defaultErrors = {nameInvalid: false}
    const [formData, setData] = useState<defaultData>(defaultData);
    const [errors, setErrors] = useState<defaultErrors>(defaultErrors);

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

    const submit = () => {
        if (formData.name === undefined) {
            setErrors({
                ...errors,
                nameError: 'Name is required',
            });
            setErrors({...errors, nameInvalid: true})
        }
        return true;
    };

    const onSuccess = () => {
        setData({...formData, submitted: true})
        navigation.navigate("OrganizerDashboard")
        setData({...formData, submitted: false})
    }

    const onFailure = () => {
        console.log("you suck")
    }

    const onSubmit = () => {
        setData({...formData, submitted: true})
        submit() ? onSuccess() : onFailure();

    };

    const formText = [
        {
            label: "What's your name?",
            helper: "What's the name of your business, event, or venue?",
            placeholder: "Bob's Burgers",
            error: "Name Error",
        },
        {
            label: "What type of business are you?",
            helper: "How many people ",
            placeholder: "Bob's Burgers",
            error: "Name Error",
        }
    ]

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
            <Button onPress={onSubmit} mt="5" colorScheme="cyan" isLoading={formData.submitted} isLoadingText="Submitting">
                Submit
            </Button>
        </VStack>
    )
}
