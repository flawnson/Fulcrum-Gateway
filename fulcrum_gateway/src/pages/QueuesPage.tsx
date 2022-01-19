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
import RightHeaderGroup from "../components/molecules/RightHeaderGroup";


export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const [props, setProps] = useState<QueueInfo[]>([])
    useEffect(() => navigation.setOptions({headerRight: RightHeaderGroup()}), [])

    const [showModal, setShowModal] = useState(false);

    const query = `
        query get_queue_data {
            getOrganizer {
                queues {
                    queueId: id
                    name
                    state
                    create_time
                }
            }
        }
    `

    async function fetchQueuesData () {
        try {
            const response = await fetch(`http://localhost:8080/api`,
                                     {
                                         method: 'POST',
                                         headers: {
                                         'Content-Type': 'application/json',
                                         'Access-Control-Allow-Origin': 'http://localhost:19006/',
                                         },
                                         credentials: 'include',
                                         body: JSON.stringify({query: query})
                                     })
            await response.json().then(
                data => {
                    data = data.data.getOrganizer.queues
                    let queue_stats: QueueInfo[] = []
                    data.forEach((queue_data: {[key: string]: string | number}) => {
                        const stats: SetStateAction<QueueInfo | any> = Object.fromEntries([
                            "queueId",
                            "name",
                            "state",
                            "create_time"]
                            .filter(key => key in queue_data)
                            .map(key => [key, queue_data[key]]))
                        queue_stats.push(stats)
                    })
                    setProps(queue_stats)
                }
            )
        } catch(error) {
            console.log(error)
        }
    }

    // Run on first render
    useEffect(() => {fetchQueuesData().then(null)}, [])
    // Poll only if user is currently on this screen
    useInterval(fetchQueuesData, useIsFocused() ? 5000 : null)

    return (
        <>
            <ActiveQueuesCatalogCardGroup entities={props} setEntities={setProps}/>
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
