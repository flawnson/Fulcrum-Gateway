import React from 'react'
import { Modal } from 'native-base'
import EditQueueForm from '../components/organisms/EditQueueForm'


type EditQueueModalProps = {
    showModal: boolean,
    setShowModal: Function
}


export default function (props: EditQueueModalProps) {
    return (
        <Modal isOpen={props.showModal} onClose={() => props.setShowModal(false)}>
            <EditQueueForm/>
        </Modal>
    )
}
