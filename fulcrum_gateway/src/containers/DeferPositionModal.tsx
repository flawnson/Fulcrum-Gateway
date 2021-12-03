import React, { useState } from 'react'
import { Button, Modal, Center } from 'native-base';
import DeferralTimePickerModal from "../components/molecules/DeferralTimePickerModal";

type DeferPositionModalProps = {
    modalVisible: boolean,
    setModalVisible: Function
}

export default function (props: DeferPositionModalProps) {
    return (
        <DeferralTimePickerModal modalVisible={props.modalVisible} setModalVisible={props.setModalVisible}/>
    )

}



