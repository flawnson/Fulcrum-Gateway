import React from 'react'
import { Modal } from 'native-base'
import EditQueueForm from '../components/organisms/EditQueueForm'
import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native";
import { HomeScreenProps } from "../../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { Route } from "@react-navigation/native";


type EditQueueModalProps = {
    showModal: boolean,
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    route: Route<"HomePage", undefined>,
    navigation: NativeStackNavigationProp<RootStackParamList, "HomePage">
}


export default function (props: EditQueueModalProps) {

    return (
        <Modal isOpen={props.showModal} onClose={() => props.setShowModal(false)}>
            <EditQueueForm route={props.route} navigation={props.navigation}/>
        </Modal>
    )
}
