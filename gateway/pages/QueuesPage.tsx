import React, {SetStateAction, useEffect, useState} from "react"
import ActiveQueuesCatalogCardGroup from "../components/molecules/QueuesCatalogCardGroup"
import {Fab, Icon} from "native-base"
import {AntDesign} from "@expo/vector-icons"
import {useIsFocused, useNavigation} from "@react-navigation/native";
import {HomeScreenProps, QueueInfo} from "../types";
import CreateQueueModal from "../containers/CreateQueueModal";
import useInterval from "../utilities/useInterval";
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
                    setProps(data.data.getOrganizer.queues)
                }
            )
        } catch(error) {
            console.log(error)
        }
    }

    // Run on first render
    useEffect(() => {fetchQueuesData().then(null)}, [])
    // Poll only if user is currently on this screen
    useInterval(fetchQueuesData, useIsFocused() ? 15000 : null)

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
