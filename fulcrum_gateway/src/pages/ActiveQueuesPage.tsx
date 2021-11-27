import React, {SetStateAction, useEffect, useState} from "react"
import ActiveQueuesCatalogCardGroup from "../components/molecules/ActiveQueuesCatalogCardGroup"
import { Fab, Icon } from "native-base"
import { AntDesign } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native";
import { HomeScreenProps } from "../../types";
import CreateQueueModal from "../containers/CreateQueueModal";

type Entity = {
    queuerId?: number,
    name: string,
    lifespan: number,
    state: boolean,
}

export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const [props, setProps] = useState<Entity[]>([])

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {fetchQueueData()}, [])

    const query = `
        query get_organizer($id: ID!) {
            organizer(organizer_id: $id) {
                queues {
                    name
                    state
                    create_time
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
                    data = data.data.organizer.queues
                    let entities: Entity[] = []
                    data.forEach((queue_data: any) => {
                        const now: any = new Date()
                        const join: any = new Date(queue_data.create_time)
                        const lifespan = new Date(Math.abs(now - join))
                        queue_data.lifespan = `${Math.floor(lifespan.getMinutes())}`
                        const stats: SetStateAction<any> = Object.fromEntries([
                            "name",
                            "state",
                            "lifespan"]
                            .filter(key => key in queue_data)
                            .map(key => [key, queue_data[key]]))
                        entities.push(stats)
                    })
                    console.log(entities)
                    setProps(entities)
                }
            )
        } catch(error) {
            console.log(error)
        }
    }

    return (
        <>
            <ActiveQueuesCatalogCardGroup entities={props}/>
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
