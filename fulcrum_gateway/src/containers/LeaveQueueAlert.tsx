import React from "react"
import { AlertDialog, Button, Center } from "native-base"
import {useNavigation} from "@react-navigation/native";
import {HomeScreenProps} from "../../types";

type LeaveQueueAlertProps = {
    isAlertOpen: boolean,
    setIsAlertOpen: React.Dispatch<React.SetStateAction<boolean>>
}


export default (props: LeaveQueueAlertProps) => {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead

    const onClose = () => {
        props.setIsAlertOpen(false)
        navigation.navigate("AbandonedScreen")
    }

    const cancelRef = React.useRef(null)
    return (
        <Center>
            <AlertDialog
                leastDestructiveRef={cancelRef}
                isOpen={props.isAlertOpen}
                onClose={onClose}
            >
                <AlertDialog.Content>
                    <AlertDialog.CloseButton />
                    <AlertDialog.Header>Leave Queue</AlertDialog.Header>
                    <AlertDialog.Body>
                        Are you sure you want to abandon your position in line?
                        You will have to enter the code again and start from the end of the line if you choose to rejoin.
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                        <Button.Group space={2}>
                            <Button
                                variant="unstyled"
                                colorScheme="coolGray"
                                onPress={onClose}
                                ref={cancelRef}
                            >
                                Cancel
                            </Button>
                            <Button colorScheme="danger" onPress={onClose}>
                                Leave
                            </Button>
                        </Button.Group>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>
        </Center>
    )
}
