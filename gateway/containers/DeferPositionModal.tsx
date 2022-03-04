import * as React from 'react'
import { Text, Modal, Button } from 'native-base'
import { useTranslation } from "react-i18next";
import baseURL from "../utilities/baseURL";
import corsURL from "../utilities/corsURL";

type DeferPositionModal = {
    showModal: boolean
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function (props: DeferPositionModal) {
    const { t } = useTranslation(["deferPositionModal", "common"]);

    const query = `
        mutation defer_user($numSpots: Int!) {
            indexDeferPosition(numSpots: $numSpots){
                ... on User {
                    id
                }
                ... on Error {
                    error
                }
            }
        }
    `
    const variables = `{
        "numSpots": 1
    }`

    async function deferPosition () {
        try {
            const response = await fetch(baseURL(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': corsURL(),
                },
                credentials: 'include',
                body: JSON.stringify({query: query, variables: variables})
            });
            return await response.json().then(data => {
                    console.log(data)
                }
            )
        } catch(error) {
            console.log("Defer position error");
            console.log(error);
            return error
        }
    }


    return (
        <Modal isOpen={props.showModal} onClose={() => props.setShowModal(false)}>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>{t("header")}</Modal.Header>
                <Modal.Body>
                    <Text>
                        {t("body")}
                    </Text>
                </Modal.Body>
                <Modal.Footer>
                    <Button.Group space={2}>
                        <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                            props.setShowModal(false);
                        }}>
                            {t("cancel", {ns: "common"})}
                        </Button>
                        <Button onPress={() => {
                            deferPosition().then(null)
                            props.setShowModal(false);
                        }}>
                            <Text style={{color: "white"}}>
                                {t("confirm", {ns: "common"})}
                            </Text>
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    )
}
