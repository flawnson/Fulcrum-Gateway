import React from 'react'
import { Alert, VStack,
        HStack, Text,
        IconButton, CloseIcon,
        Box, PresenceTransition } from 'native-base'
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

type CannotEnqueueAlertProps = {
    showAlert: boolean,
    setShowAlert:  React.Dispatch<React.SetStateAction<boolean>>
    message: string
}

export default function (props: CannotEnqueueAlertProps) {
    const { t, i18n } = useTranslation(["generalErrorAlert"])
    return (
        <PresenceTransition
            visible={props.showAlert}
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
                transition: {
                    duration: 250,
                },
            }}
            style={styles.container}
        >
            <Alert w="100%" status="error" colorScheme="error">
                <VStack space={2} flexShrink={1} w="100%">
                    <HStack
                        flexShrink={1}
                        space={2}
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <HStack flexShrink={1} space={2} alignItems="center">
                            <Alert.Icon />
                            <Text fontSize="md" fontWeight="medium" color="coolGray.800">
                                {t("title")}
                            </Text>
                        </HStack>
                        <IconButton
                            variant="unstyled"
                            icon={<CloseIcon size="3" color="coolGray.600" />}
                            onPress={() => props.setShowAlert(false)}
                        />
                    </HStack>
                    <Box
                        pl="6"
                        _text={{
                            color: "coolGray.600",
                        }}
                    >
                        props.message
                    </Box>
                </VStack>
            </Alert>
        </PresenceTransition>
    )
}


const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        position: 'absolute',
    },
});

