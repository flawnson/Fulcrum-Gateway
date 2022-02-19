import React from 'react'
import { Modal } from 'native-base'
import { HomeScreenProps, RootStackParamList } from "../types";
import { useTranslation } from "react-i18next";
import EnqueueForm from "../components/organisms/EnqueueForm";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";


type CreateUserModalProps = {
    showModal: boolean,
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
    joinCode: string
    navigation: NativeStackNavigationProp<RootStackParamList, "HomePage">
}


export default function (props: CreateUserModalProps) {
    const { t } = useTranslation(["createUserModal"]);

    return (
        <Modal isOpen={props.showModal} onClose={() => props.setShowModal(false)}>
            <Modal.Content maxWidth="500px">
                <Modal.CloseButton />
                <Modal.Header>{t("title")}</Modal.Header>
                <Modal.Body>
                    <EnqueueForm
                        joinCode={props.joinCode}
                        navigation={props.navigation}
                        setShowModal={props.setShowModal}
                    />
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    )
}
