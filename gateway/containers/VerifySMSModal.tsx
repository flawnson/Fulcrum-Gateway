import React, { useState } from 'react';
import { Button, Link,
        Modal, Center } from 'native-base'
import { StyleSheet, SafeAreaView,
        Text, View } from 'react-native';
import { CodeField, Cursor,
        useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { useTranslation } from "react-i18next";
import { UserInfo } from "../types"


const CELL_COUNT = 6

type VerifySMSModalProps = {
    userInfo: UserInfo
    showModal: boolean,
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function (props: VerifySMSModalProps) {
    const [value, setValue] = useState('');
    const { t, i18n } = useTranslation(["verifySMSModal"]);
    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [cellOnLayoutHandler, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const query = `
            mutation confirm_user($confirmCode: String!) {
            confirmUser(confirmCode: $confirmCode)
        }
    `

    const submitSMSVerification = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'http://localhost:19006/',
                    },
                    credentials: 'include',
                    body: JSON.stringify({query: query, variables: {confirmCode: value}})
                })
            return await response.json()
        } catch(error) {
            console.log(error)
        }
    }


    function onSubmit () {
        submitSMSVerification().then(null)
        props.setShowModal(false)
    }

    return (
        <Modal
            defaultIsOpen
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
                            Hello {props.userInfo.name}!
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
                                        onLayout={getCellOnLayoutHandler(index)}
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
                    <Button onPress={onSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
};

const styles = StyleSheet.create({
    root: {
        padding: 20,
        minHeight: 300
    },
    title: {
        textAlign: 'center',
        fontSize: 24
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 20
    },
    codeFieldRoot: {
        marginTop: 20,
    },
    cellRoot: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    cellText: {
        color: '#000',
        fontSize: 36,
        textAlign: 'center',
    },
    focusCell: {
        borderBottomColor: '#007AFF',
        borderBottomWidth: 2,
    },
});