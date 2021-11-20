import React, { useState } from 'react'
import { Button, Modal, Center } from 'native-base';
import GenericTimePickerModal from "../components/atoms/GenericTimePickerModal";

type DeferPositionModalProps = {
    modalVisible: boolean,
    setModalVisible: Function
}

export default function (props: DeferPositionModalProps) {
    return (
        <GenericTimePickerModal modalVisible={props.modalVisible} setModalVisible={props.setModalVisible}/>
    )

}



