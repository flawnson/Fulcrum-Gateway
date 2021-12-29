import React from 'react'
import { Modal } from 'native-base'
import CreateQueueForm from '../components/organisms/CreateQueueForm'
import { useNavigation, useRoute } from "@react-navigation/native";
import { HomeScreenProps } from "../../types";
import { useTranslation } from "react-i18next";


type CreateQueueModalProps = {
    showModal: boolean,
    setShowModal: Function
}


export default function (props: CreateQueueModalProps) {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const { t, i18n } = useTranslation(["createQueueModal"]);

    return (
        <Modal isOpen={props.showModal} onClose={() => props.setShowModal(false)}>
            <Modal.Content maxWidth="500px">
                <Modal.CloseButton />
                <Modal.Header>{t("title")}</Modal.Header>
                <Modal.Body>
                    <CreateQueueForm navigation={navigation} setShowModal={props.setShowModal}/>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    )
}
