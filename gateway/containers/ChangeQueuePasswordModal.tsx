import React, {useState} from 'react'
import {VStack, FormControl, Input, Modal, Button} from 'native-base'
import { useTranslation } from "react-i18next";
import baseURL from "../utilities/baseURL";
import corsURL from "../utilities/corsURL";


type ChangeQueuePasswordProps = {
    showModal: boolean,
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
    // navigation: NativeStackNavigationProp<RootStackParamList, "HomePage">
}

type ChangeQueuePasswordData = {
    password?: string,
    confirmPassword?: string
}


export default function (props: ChangeQueuePasswordProps) {
    // const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const { t } = useTranslation(["changeQueuePasswordModal"]);
    const [formData, setData] = useState<ChangeQueuePasswordData>({});
    const [errors, setErrors] = useState<ChangeQueuePasswordData>({})
    const [submitted, setSubmitted] = useState(false)

    const query = `
        mutation change_queue_password($password: String!, $queueId: String!){
            changeQueuePassword(password: $password, queueId: $queueId){
                ... on Queue {
                    id
                }
                ... on Error {
                    error
                }
            }
        }
    `

    async function changePassword () {
        try {
            fetch(baseURL(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': corsURL(),
                },
                credentials: 'include',
                body: JSON.stringify({query: query, variables: formData}),
            }).then(response => response.json()).then(data => {
                    props.setShowModal(false)
                    setSubmitted(false)
                }
            )
        } catch (error) {
            return error
        }
    }

    const validatePasswords = () => {
        if (formData.password === undefined) {
            setErrors({
                ...errors,
                confirmPassword: t('new_password_not_provided'),
            });
            return false;
        } else if (formData.confirmPassword === undefined) {
            setErrors({
                ...errors,
                password: t('confirm_password_not_provided'),
            })
            return false
        } else if (formData.password !== formData.confirmPassword) {
            setErrors({
                ...errors,
                confirmPassword: t('confirm_password_does_not_match'),
            })
            return false
        }
        return true;
    };

    const onSuccess = () => {
        changePassword().then()
    }

    const onFailure = () => {
        setSubmitted(false)
    }

    function onSubmitPress () {
        setSubmitted(true)
        validatePasswords() ? onSuccess() : onFailure();
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
                            }}>{t("new_password_label")}</FormControl.Label>
                            <Input placeholder={t("new_password_placeholder")} onChangeText={value => setData({ ...formData,
                                password: value
                            })} />
                            <FormControl.HelperText _text={{
                                fontSize: 'xs'
                            }}>
                                {t("new_password_helper")}
                            </FormControl.HelperText>
                            <FormControl.ErrorMessage _text={{
                                fontSize: 'xs'
                            }}>
                                {errors.password}
                            </FormControl.ErrorMessage>
                        </FormControl>
                        <FormControl isRequired>
                            <FormControl.Label _text={{
                                bold: true
                            }}>{t("confirm_password_label")}</FormControl.Label>
                            <Input placeholder={t("confirm_password_placeholder")} onChangeText={value => setData({ ...formData,
                                confirmPassword: value
                            })} />
                            <FormControl.HelperText _text={{
                                fontSize: 'xs'
                            }}>
                                {t("confirm_password_helper")}
                            </FormControl.HelperText>
                            <FormControl.ErrorMessage _text={{
                                fontSize: 'xs'
                            }}>
                                {errors.confirmPassword}
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
