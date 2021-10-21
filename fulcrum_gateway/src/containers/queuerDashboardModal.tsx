import React, { useState } from 'react'
import { Button, Modal, NativeBaseProvider, Center } from 'native-base';

export default function () {
    const [showModal, setShowModal] = useState(false)
    return (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>

        </Modal>
    )

}



