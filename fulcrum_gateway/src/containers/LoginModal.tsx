import React, { useState } from "react";
import OrganizerLoginForm from "../components/organisms/OrganizerLoginForm";
import AssistantLoginForm from "../components/organisms/AssistantLoginForm";
import { useNavigation } from "@react-navigation/native";
import { HomeScreenProps } from "../../types";
import { useTranslation } from "react-i18next";
import { Button, Text,
        Center, Heading,
        Modal } from "native-base";


type CreateQueueModalProps = {
    showModal: boolean,
    setShowModal: Function
}

export default (props: CreateQueueModalProps) => {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const { t, i18n } = useTranslation(["logInModal"]);
    const [isOrganizer, setIsOrganizer] = useState(true)

    return (
        <Modal isOpen={props.showModal} onClose={() => props.setShowModal(false)}>
            <Modal.Content maxWidth="500px">
                <Modal.CloseButton />
                <Modal.Header>{t("title")}</Modal.Header>
                <Modal.Body>
                    <Center>
                        <Heading
                            size="lg"
                            fontWeight="600"
                            color="coolGray.800"
                            _dark={{
                                color: "warmGray.50",
                            }}
                        >
                            {t("subtitle")}
                        </Heading>
                        <Heading
                            mt="1"
                            _dark={{
                                color: "warmGray.200",
                            }}
                            color="coolGray.600"
                            fontWeight="medium"
                            size="xs"
                        >
                            {t("question")}
                        </Heading>
                        <Button.Group style={{marginTop: 40}}>
                            <Button
                                onPress={() => setIsOrganizer(true)}
                                variant={isOrganizer ? "solid" : "outline"}
                            >
                                <Text style={{color: isOrganizer ? "white" : "black"}}>
                                    {t("organizer")}
                                </Text>
                            </Button>
                            <Button
                                onPress={() => setIsOrganizer(false)}
                                variant={isOrganizer ? "outline" : "solid"}
                            >
                                <Text style={{color: isOrganizer ? "black" : "white"}}>
                                    {t("assistant")}
                                </Text>
                            </Button>
                        </Button.Group>
                        {isOrganizer ? <OrganizerLoginForm navigation={navigation} setShowModal={props.setShowModal}/>
                                     : <AssistantLoginForm navigation={navigation} setShowModal={props.setShowModal}/>}
                    </Center>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    )
}
