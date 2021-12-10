import React from 'react'
import { Modal } from 'native-base'
import CreateQueueForm from '../components/organisms/CreateQueueForm'
import { useNavigation, useRoute } from "@react-navigation/native";
import { HomeScreenProps } from "../../types";


type CreateQueueModalProps = {
    showModal: boolean,
    setShowModal: Function
}


export default function (props: CreateQueueModalProps) {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const route = useRoute<HomeScreenProps["route"]>();  // Don't need this but if I want to pass config or params...

    return (
        <Modal isOpen={props.showModal} onClose={() => props.setShowModal(false)}>
            <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Header>Create a Queue</Modal.Header>
                <Modal.Body>
            <CreateQueueForm route={route} navigation={navigation}/>
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
            </Modal.Content>
        </Modal>
    )
}
