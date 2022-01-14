import React from 'react'
import { Alert, VStack,
        HStack, Text,
        IconButton, CloseIcon,
        Box, PresenceTransition } from 'native-base'

type CannotEnqueueAlertProps = {
    showAlert: boolean,
    setShowAlert:  React.Dispatch<React.SetStateAction<boolean>>
}

export default function (props: CannotEnqueueAlertProps) {
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
        >
            <Alert w="100%" status="error" colorScheme="info">
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
                                We are going live in July!
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
                        We are happy to announce that we are going live on July 28th. Get
                        ready!
                    </Box>
                </VStack>
            </Alert>
        </PresenceTransition>
    )
}
