import * as React from "react"
import { Box, Heading,
        VStack, FormControl,
        Input, Button,
        Text, Link,
        HStack } from "native-base"
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import { useState } from "react";
import { AuthContext } from "../../../App";


type LogInFormType = {
    navigation: NativeStackScreenProps<RootStackParamList, 'HomePage'>['navigation']
    setShowModal: Function
}

type OrganizerFormData = {
    email?: string,
    password?: string
}

type OrganizerLogInErrorData = {
    email?: string,
    password?: string
}

export default ({navigation, setShowModal}: LogInFormType) => {
    const { signIn } = React.useContext(AuthContext)
    const [formData, setData] = useState<OrganizerFormData>({});
    const [submitted, setSubmitted] = useState<boolean>(false)
    const [errors, setErrors] = useState<OrganizerLogInErrorData>({});

    const query = `
        mutation login_organizer($email: String!, $password: String!) {
            loginOrganizer(email: $email, password: $password){
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
                body: JSON.stringify({query: query, variables: formData}),
            });
            return await response.json()
        } catch (error) {
            return error
        }
    }

    const re = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
    const validate = () => {
        if (formData.email === undefined) {
            setErrors({
                ...errors,
                email: 'Oops! Looks like you forgot to provide an email...',
            });
            return false;
        } else if (!re.test(formData.email)){
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
        signIn('ORGANIZER')
        setShowModal(false)
        setSubmitted(false)
        // navigation.navigate("QueuesPage")  We are automatically sent to the QueuesPage
    }

    const onFailure = () => {
        setSubmitted(false)
    }

    const onLogInPress = () => {
        setSubmitted(true)
        validate() && logIn() ? onSuccess() : onFailure();
    }

    return (
        <Box safeArea p="2" py="8" w="90%" maxW="290">
            <VStack space={3} mt="5">
                <FormControl isInvalid={"email" in errors}>
                    <FormControl.Label>Email</FormControl.Label>
                    <Input
                        placeholder="Ex. your_email@example.com"
                        onChangeText={(value) => setData({ ...formData, email: value })}
                    />
                    <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{errors.email}</FormControl.ErrorMessage>
                </FormControl>
                <FormControl isInvalid={"password" in errors}>
                    <FormControl.Label>Password</FormControl.Label>
                    <Input
                        type="password"
                        placeholder="Definitely not 12345"
                        onChangeText={(value) => setData({ ...formData, password: value })}
                    />
                    <Link
                        _text={{
                            fontSize: "xs",
                            fontWeight: "500",
                            color: "indigo.500",
                        }}
                        alignSelf="flex-end"
                        mt="1"
                    >
                        Forget Password?
                    </Link>
                    <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{errors.password}</FormControl.ErrorMessage>
                </FormControl>
                <Button
                    mt="2"
                    colorScheme="indigo"
                    onPress={onLogInPress}
                    isLoading={submitted}
                    isLoadingText="Logging in..."
                >
                    Log in
                </Button>
                <HStack mt="6" justifyContent="center">
                    <Text
                        fontSize="sm"
                        color="coolGray.600"
                        _dark={{
                            color: "warmGray.200",
                        }}
                    >
                        I'm a new organizer.{" "}
                    </Text>
                    <Link
                        _text={{
                            color: "indigo.500",
                            fontWeight: "medium",
                            fontSize: "sm",
                        }}
                        href="#"
                    >
                        Sign Up
                    </Link>
                </HStack>
            </VStack>
        </Box>
    )
}
