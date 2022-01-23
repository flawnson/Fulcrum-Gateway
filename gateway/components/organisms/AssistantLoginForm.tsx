import React, { useState } from "react"
import { Box, Heading,
        VStack, FormControl,
        Input, Button,
        Text, Link,
        HStack } from "native-base"
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { AuthContext } from "../../App";


type SignInFormType = {
    navigation: NativeStackScreenProps<RootStackParamList, 'HomePage'>['navigation']
    setShowModal: Function
}

type AssistantFormData = {
    joinCode?: string,
    password?: string
}

export default ({navigation, setShowModal}: SignInFormType) => {
    const { signIn } = React.useContext(AuthContext)
    const [formData, setData] = useState<AssistantFormData>({});
    const [submitted, setSubmitted] = useState<boolean>(false)
    const [errors, setErrors] = useState<object>({});

    const query = `
        mutation login_queue($joinCode: String!, $password: String!) {
            loginQueue(joinCode: $joinCode, password: $password){
                id
            }
        }
    `

    async function logIn () {
        try {
            const response = await fetch(`http://localhost:8080/api`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:19006/',
                },
                credentials: 'include',
                body: JSON.stringify({query: query, variables: formData})
            });
            return await response.json()
        } catch (error) {
            return error
        }
    }

    const validate = () => {
        if (formData.joinCode === undefined) {
            setErrors({
                ...errors,
                email: 'Oops! Looks like you forgot to provide a joinCode...',
            });
            return false;
        } else if (formData.joinCode?.length !== 6){
            setErrors({
                ...errors,
                email: "Oops! Looks like you didn't enter a valid email...",
            });
            return false;
        } else if (formData.password === undefined) {
            setErrors({
                ...errors,
                password: 'Oops! Looks like you forgot to provide a password...',
            });
            return false;
        }
        return true;
    };

    const onSuccess = () => {
        signIn('ASSISTANT')
        setShowModal(false)
        setSubmitted(false)
        navigation.navigate("QueueDashboard")
    }

    const onFailure = () => {
        setSubmitted(false)
    }

    const onSignInPress = () => {
        validate() && logIn() ? onSuccess() : onFailure();
    }

    return (
        <Box safeArea p="2" py="8" w="90%" maxW="290">
            <VStack space={3} mt="5">
                <FormControl>
                    <FormControl.Label>Join code</FormControl.Label>
                    <Input
                        placeholder="Ex. 777777"
                        onChangeText={(value) => setData({ ...formData, joinCode: value })}
                     />
                </FormControl>
                <FormControl>
                    <FormControl.Label>Password</FormControl.Label>
                    <Input
                        type="password"
                        placeholder="Shhh it's a secret"
                        onChangeText={(value) => setData({ ...formData, password: value })}
                    />
                </FormControl>
                <Button
                    mt="2"
                    colorScheme="indigo"
                    onPress={() => (onSignInPress)}
                    isLoading={submitted}
                    isLoadingText="Logging in..."
                >
                    Sign in
                </Button>
            </VStack>
        </Box>
    )
}
