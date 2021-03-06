import React from "react";
import SignUpForm from "../components/organisms/OrganizerSignUpForm";
import { useNavigation } from "@react-navigation/native";
import { HomeScreenProps } from "../types";
import { useTranslation } from "react-i18next";
import { Center, Modal } from "native-base";


type CreateQueueModalProps = {
    showModal: boolean,
    setShowModal: Function
}

export default (props: CreateQueueModalProps) => {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const { t } = useTranslation(["signUpModal"]);

    return (
        <Modal isOpen={props.showModal} onClose={() => props.setShowModal(false)}>
            <Modal.Content maxWidth="500px">
                <Modal.CloseButton />
                <Modal.Header>{t("title")}</Modal.Header>
                <Modal.Body>
                    <Center>
                        <SignUpForm navigation={navigation} setShowModal={props.setShowModal}/>
                    </Center>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    )
}
