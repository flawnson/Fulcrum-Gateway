import React, {useCallback, useEffect, useState} from 'react';
import { Button, Link,
        Modal, Center,
        useToast, View,
        Heading, Text } from 'native-base'
import { StyleSheet, SafeAreaView } from 'react-native';
import { CodeField, Cursor,
        useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { useTranslation } from "react-i18next";
import { UserInfo } from "../types"
import {scale} from "../utilities/scales";
import corsURL from "../utilities/corsURL";
import baseURL from "../utilities/baseURL";


const CELL_COUNT = 6

type VerifySMSModalProps = {
    userInfo: UserInfo
    showModal: boolean,
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function (props: VerifySMSModalProps) {
    const { t } = useTranslation(["verifySMSModal"]);
    const [value, setValue] = useState('');
    const [submitted, setSubmitted] = useState<boolean>(false)
    const [errors, setErrors] = useState<any>([]);
    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [cellOnLayoutHandler, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });
    const toast = useToast()

    useEffect(() => {
        if (!!errors.length) {
            toast.show({
                title: t('something_went_wrong', {ns: "common"}),
                status: "error",
                description: t("cannot_fetch_verify_sms_message")
            })
        }
    }, [errors])  // Render alert if errors

    useCallback(() => {
        // Alert will show if nothing has happened within 10 seconds of submitting the enqueue form.
        setTimeout(() => {
            if (submitted) {
                setSubmitted(false)
                toast.show({
                    title: t('something_went_wrong', {ns: "common"}),
                    status: "error",
                    description: t("cannot_fetch_verify_sms_message")
                })
            }
        }, 10000)
    }, [submitted])

    const query = `
        mutation confirm_user($confirmCode: String!) {
            confirmUser(confirmCode: $confirmCode){
                ... on User {
                    id
                }
                ... on Error {
                    error
                }
            }
        }
    `

    const submitSMSVerification = async () => {
        try {
            fetch(baseURL(),
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': corsURL(),
                    },
                    credentials: 'include',
                    body: JSON.stringify({query: query, variables: {confirmCode: value}})
        }).then(response => response.json()).then(data => {
                if (!!data.errors) {
                    setErrors([...errors, data.errors])
                } else if (data.data.confirmUser.error === "USER_CONFIRM_FAILED") {
                    // Check for known error (when confirm code is wrong)
                    setErrors([...errors, data.data.confirmUser.error])
                    setSubmitted(false)
                } else {
                    // If successfully verified SMS
                    setValue('')
                    setSubmitted(false)  // To reset form in case unverified again
                    props.setShowModal(false)
                }
            })
        } catch(error) {
            console.log("Verify SMS error");
            console.log(error);
            setErrors([...errors, error])
        }
    }

    function resendSMS () {

    }

    function onSubmit () {
        submitSMSVerification().then()
    }

    useEffect(() => {
        // To automatically submit the code when confirmation code provided is the correct length
        if (value.length === 6) {
            onSubmit()
        }
    }, [value])

    return (
        <>
            <Modal
                isOpen={props.showModal}
                onClose={() => props.setShowModal(false)}
                closeOnOverlayClick={false}
                isKeyboardDismissable={false}
            >
                <Modal.Content maxWidth="500px">
                    <Modal.Header>{t("title")}</Modal.Header>
                    <Modal.Body>
                        <SafeAreaView style={styles.root}>
                            <Heading
                                size="lg"
                                fontWeight="600"
                                style={styles.title}
                            >
                                {t("hello_message", {user_name: props.userInfo.user_name})}
                            </Heading>
                            <Heading
                                mt="1"
                                _dark={{
                                    color: "warmGray.200",
                                }}
                                color="coolGray.600"
                                fontWeight="medium"
                                size="xs"
                                style={styles.subtitle}
                            >
                                {t("message", {phone_number: props.userInfo.phone_number})}
                            </Heading>
                            <Center>
                                <CodeField
                                    ref={ref}
                                    {...cellOnLayoutHandler}
                                    value={value}
                                    onChangeText={setValue}
                                    cellCount={CELL_COUNT}
                                    rootStyle={styles.codeFieldRoot}
                                    keyboardType="number-pad"
                                    textContentType="oneTimeCode"
                                    renderCell={({index, symbol, isFocused}: {index: number, symbol: string, isFocused: boolean})=> (
                                        <View
                                            // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
                                            onLayout={() => getCellOnLayoutHandler(index)}
                                            key={index}
                                            style={[styles.cellRoot, isFocused && styles.focusCell]}>
                                            <Text style={styles.cellText}>
                                                {symbol || (isFocused ? <Cursor /> : null)}
                                            </Text>
                                        </View>
                                    )}
                                />
                            </Center>
                        </SafeAreaView>
                        <Link
                            _text={{
                                fontSize: "xs",
                                fontWeight: "500",
                                color: "indigo.500",
                            }}
                            alignSelf="flex-end"
                            mt="1"
                            onPress={() => resendSMS()}
                        >
                            {t("did_not_get_message")}
                        </Link>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            onPress={() => onSubmit()}
                            isLoading={submitted}
                            isLoadingText="Logging in..."
                        >
                            <Text style={{color: "white"}}>
                                Submit
                            </Text>
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    root: {
        padding: 20,
        minHeight: 300
    },
    title: {
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
    },
    codeFieldRoot: {
        marginTop: 20,
    },
    cellRoot: {
        width: scale(30),
        height: scale(30),
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    cellText: {
        color: '#000',
        fontSize: scale(30),
        textAlign: 'center',
    },
    focusCell: {
        borderBottomColor: '#007AFF',
        borderBottomWidth: 2,
    },
});
