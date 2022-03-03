import React, {useCallback, useEffect, useState} from 'react';
import { Button, Link,
        Modal, Center,
        useToast } from 'native-base'
import { StyleSheet, SafeAreaView,
        Text, View } from 'react-native';
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
                    setSubmitted(false)  // To reset form in case unverified again
                    props.setShowModal(false)
                }
            })
        } catch(error) {
            setErrors([...errors, error])
        }
    }

    function onSubmit () {
        submitSMSVerification().then()
    }

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
                            <Text style={styles.title}>
                                Hello {props.userInfo.user_name}!
                            </Text>
                            <Text style={styles.subtitle}>
                                Please enter the 6-digit code we sent to {props.userInfo.phone_number}
                            </Text>
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
                        >
                            Didn't get a message?
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
        fontSize: scale(24)
    },
    subtitle: {
        textAlign: 'center',
        fontSize: scale(16)
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
