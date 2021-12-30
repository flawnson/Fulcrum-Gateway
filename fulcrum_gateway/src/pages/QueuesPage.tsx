import React, { SetStateAction, useEffect, useState } from "react"
import ActiveQueuesCatalogCardGroup from "../components/molecules/QueuesCatalogCardGroup"
import { Fab, Icon } from "native-base"
import { AntDesign } from "@expo/vector-icons"
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { HomeScreenProps } from "../../types";
import CreateQueueModal from "../containers/CreateQueueModal";
import { QueueInfo } from "../../types";
import useInterval from "../utilities/useInterval";
import DarkModeToggle from "../components/atoms/DarkModeToggle";


export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const [props, setProps] = useState<QueueInfo[]>([])
    navigation.setOptions({headerRight: DarkModeToggle()})

    const [showModal, setShowModal] = useState(false);

    const query = `
        query get_queue_data($data: OrganizerWhereUniqueInput!) {
            organizer(where: $data) {
                queues {
                    queueId: id
                    name
                    state
                    create_time
                }
            }
        }
    `
    const variables = `{
        "data":
        {
            "id": "costco_toronto"
        }
    }`

    async function fetchQueuesData () {
        try {
            const response = await fetch(`http://localhost:8080/api?query=${query}&variables=${variables}`)
            await response.json().then(
                data => {
                    data = data.data.organizer.queues
                    let queue_sats: QueueInfo[] = []
                    data.forEach((queue_data: {[key: string]: string | number}) => {
                        const now: any = new Date()
                        const create: any = new Date(queue_data.create_time)
                        const lifespan = new Date(Math.abs(now - create))
                        queue_data.lifespan = `${Math.floor(lifespan.getMinutes())}`
                        const stats: SetStateAction<QueueInfo | any> = Object.fromEntries([
                            "queueId",
                            "name",
                            "state",
                            "lifespan"]
                            .filter(key => key in queue_data)
                            .map(key => [key, queue_data[key]]))
                        queue_sats.push(stats)
                    })
                    setProps(queue_sats)
                }
            )
        } catch(error) {
            console.log(error)
        }
    }

    // Run on first render
    useEffect(() => {fetchQueuesData()}, [])
    // Poll only if user is currently on this screen
    // if (useIsFocused()) {useInterval(fetchQueuesData, 5000)}
    useInterval(fetchQueuesData, 5000)

    return (
        <>
            <ActiveQueuesCatalogCardGroup entities={props}/>
            <Fab
                onPress={() => setShowModal(!showModal)}
                position="absolute"
                size="sm"
                icon={<Icon color="white" as={<AntDesign name="plus" />} size="sm" />}
                renderInPortal={useIsFocused()}
            />
            <CreateQueueModal showModal={showModal} setShowModal={setShowModal} />
        </>
    )
}
