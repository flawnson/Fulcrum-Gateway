import * as React from "react"
import { Box, Heading,
        VStack, FormControl,
        Input, Button,
        Text, Link,
        HStack } from "native-base"
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";


type SignInFormType = {
    navigation: NativeStackScreenProps<RootStackParamList, 'HomePage'>['navigation']
    setShowModal: Function
}

export default ({navigation, setShowModal}: SignInFormType) => {

    const query = `
        mutation login_organizer($email: String!, $password: String!) {
            loginOrganizer(email: $email, password: $password){
                id
            }
        }
    `
    const variables = `{
            "email": "test@gmail.com",
            "password": "password123"
        }
    `

    async function joinQueue () {
        try {
            const response = await fetch(`http://localhost:8080/api`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({query: query, variables: variables})
            });
            return await response.json()
        } catch (error) {
            return error
        }
    }

    const onSignInPress = () => {
        setShowModal(false)
        navigation.navigate("QueueDashboard")
    }

    return (
        <Box safeArea p="2" py="8" w="90%" maxW="290">
            <VStack space={3} mt="5">
                <FormControl>
                    <FormControl.Label>Join code</FormControl.Label>
                    <Input />
                </FormControl>
                <FormControl>
                    <FormControl.Label>Password</FormControl.Label>
                    <Input type="password" />
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
                </FormControl>
                <Button
                    mt="2"
                    colorScheme="indigo"
                    onPress={() => (onSignInPress)}>
                    Sign in
                </Button>
                <HStack mt="6" justifyContent="center">
                    <Text
                        fontSize="sm"
                        color="coolGray.600"
                        _dark={{
                            color: "warmGray.200",
                        }}
                    >
                        I'm a new user.{" "}
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
