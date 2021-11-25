import React, {SetStateAction, useEffect, useState} from "react"
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

    const query = `
        query get_organizer($id: ID!) {
            organizer(organizer_id: $id) {
                name
                queues {
                    name
                    state
                }
            }
        }
    `
    const variables = `{
        "id": "costco"
    }`

    async function fetchQueueData () {
        try {
            const response = await fetch(`http://localhost:8080/api?query=${query}&variables=${variables}`)
            await response.json().then(
                data => {
                    data = data.data.queue
                    const stats: SetStateAction<any> = Object.fromEntries([
                        "num_enqueued",
                        "num_serviced",
                        "num_deferred",
                        "average_wait_time",
                        "num_abandoned",
                        "num_noshows"]
                            .filter(key => key in data)
                            .map(key => [key, data[key]]))
                    setProps(stats)
                }
            )
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
