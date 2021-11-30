import React from 'react'
import { Modal } from 'native-base'
import EditQueueForm from '../components/organisms/EditQueueForm'
import { useNavigation, useRoute } from "@react-navigation/native";
import { HomeScreenProps } from "../../types";


type EditQueueModalProps = {
    showModal: boolean,
    setShowModal: Function
}


export default function (props: EditQueueModalProps) {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const route = useRoute<HomeScreenProps["route"]>();  // Don't need this but if I want to pass config or params...

    return (
        <Modal isOpen={props.showModal} onClose={() => props.setShowModal(false)}>
            <EditQueueForm route={route} navigation={navigation}/>
        </Modal>
    )
}
