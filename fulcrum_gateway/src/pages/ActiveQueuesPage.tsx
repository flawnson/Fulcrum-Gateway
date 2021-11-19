import React, { useEffect, useState } from "react"
import ActiveQueuesCatalogCardGroup from "../components/molecules/ActiveQueuesCatalogCardGroup"
import { Fab, Icon } from "native-base"
import { AntDesign } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native";
import { HomeScreenProps } from "../../types";
import CreateQueueModal from "../containers/CreateQueueModal";

export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const [props, setProps] = useState({'entities': []})

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {fetchQueueData()}, [])

    async function fetchQueueData () {
        try {
            const response = await fetch('http://localhost:8080/organizer/ORGANIZERID/queues')
            console.log(response)
            setProps(await response.json())
        } catch(error) {
            console.log(error)
        }
    }

    return (
        <>
            <ActiveQueuesCatalogCardGroup entities={props.entities}/>
            <Fab
                onPress={() => setShowModal(true)}
                position="absolute"
                size="sm"
                icon={<Icon color="white" as={<AntDesign name="plus" />} size="sm" />}
            />
            <CreateQueueModal showModal={showModal} setShowModal={setShowModal} />
        </>
    )
}
