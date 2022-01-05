import React from 'react'
import { Modal } from 'native-base'
import EditQueueForm from '../components/organisms/EditQueueForm'
import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native";
import { HomeScreenProps } from "../../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import {useTranslation} from "react-i18next";


type EditQueueModalProps = {
    showModal: boolean,
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    navigation: NativeStackNavigationProp<RootStackParamList, "HomePage">
}


export default function (props: EditQueueModalProps) {
    const { t, i18n } = useTranslation(["editQueueModal"]);

    return (
        <Modal isOpen={props.showModal} onClose={() => props.setShowModal(false)}>
            <Modal.Content maxWidth="500px">
                <Modal.CloseButton />
                <Modal.Header>{t("title")}</Modal.Header>
                <Modal.Body>
                    <EditQueueForm navigation={props.navigation} setShowModal={props.setShowModal}/>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    )
}
