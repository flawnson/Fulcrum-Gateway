import React, {useState} from 'react'
import {VStack, FormControl, Input, Modal, Button} from 'native-base'
import { useTranslation } from "react-i18next";


type CreateUserModalProps = {
    showModal: boolean,
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
    // navigation: NativeStackNavigationProp<RootStackParamList, "HomePage">
}


export default function (props: CreateUserModalProps) {
    // const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const { t } = useTranslation(["createUserModal", "common"]);
    const [formData, setData] = useState<{email?: string}>({});
    const [errors, setErrors] = useState<{email?: string}>({});
    const [submitted, setSubmitted] = useState(false)

    const query = `
        mutation forgot_password($email: String!){
            forgotOrganizerPassword(email: $email){
                ... on Organizer {
                    id
                }
                ... on Error {
                    error
                }
            }
        }
    `

    async function resetPassword () {
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
            return await response.json().then(data => {
                    props.setShowModal(false)
                    setSubmitted(false)
                }
            )
        } catch (error) {
            return error
        }
    }

    const re = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
    const validateEmail = () => {
        if (formData.email === undefined) {
            setErrors({
                ...errors,
                email: t("email_not_provided"),
            });
            return false;
        } else if (!re.test(formData.email)){
            setErrors({
                ...errors,
                email: t("email_not_valid"),
            });
            return false;
        }
        return true;
    };

    const onSuccess = () => {
        resetPassword().then()
    }

    const onFailure = () => {
        setSubmitted(false)
    }

    function onSubmitPress () {
        setSubmitted(true)
        validateEmail() ? onSuccess() : onFailure();
    }


    return (
        <Modal isOpen={props.showModal} onClose={() => props.setShowModal(false)}>
            <Modal.Content maxWidth="500px">
                <Modal.CloseButton />
                <Modal.Header>{t("title")}</Modal.Header>
                <Modal.Body>
                    <VStack width="90%" mx="3" maxW="300px">
                        <FormControl isRequired>
                            <FormControl.Label _text={{
                                bold: true
                            }}>{t("title")}</FormControl.Label>
                            <Input placeholder="your_email@example.com" onChangeText={value => setData({ ...formData,
                                email: value
                            })} />
                            <FormControl.HelperText _text={{
                                fontSize: 'xs'
                            }}>
                                {t("email_helper")}
                            </FormControl.HelperText>
                            <FormControl.ErrorMessage _text={{
                                fontSize: 'xs'
                            }}>
                                {errors.email}
                            </FormControl.ErrorMessage>
                        </FormControl>
                        <Button
                            mt="2"
                            colorScheme="indigo"
                            onPress={onSubmitPress}
                            isLoading={submitted}
                            isLoadingText="Logging in..."
                        >
                            {t("submit", {ns: "common"})}
                        </Button>
                    </VStack>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    )
}
