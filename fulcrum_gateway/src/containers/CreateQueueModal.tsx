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

    return (
        <Modal isOpen={props.showModal} onClose={() => props.setShowModal(false)}>
            <Modal.Content maxWidth="500px">
                <Modal.CloseButton />
                <Modal.Header>Create a Queue</Modal.Header>
                <Modal.Body>
                    <CreateQueueForm setShowModal={props.setShowModal}/>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    )
}
