import React, {SetStateAction, useEffect, useState} from "react"
import QueuesCatalogCardGroup from "../components/molecules/QueuesCatalogCardGroup"
import {Fab, Icon} from "native-base"
import {AntDesign} from "@expo/vector-icons"
import {useIsFocused, useNavigation} from "@react-navigation/native";
import {HomeScreenProps, QueueInfo} from "../types";
import CreateQueueModal from "../containers/CreateQueueModal";
import useInterval from "../utilities/useInterval";
import RightHeaderGroup from "../components/molecules/RightHeaderGroup";
import ConfirmDeleteAlert from "../containers/ConfirmDeleteAlert";


type QueuesPageProps = {
    queueInfo: QueueInfo[],
    showConfirmDeleteAlert: boolean
    setShowConfirmDeleteAlert: React.Dispatch<React.SetStateAction<boolean>>
}


export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const [props, setProps] = useState<QueuesPageProps["queueInfo"]>([])
    const [showCreateQueueModal, setShowCreateQueueModal] = useState(false);
    const [showConfirmDeleteAlert, setShowConfirmDeleteAlert] = useState<boolean>(false)
    useEffect(() => navigation.setOptions({headerRight: RightHeaderGroup()}), [])

    const query = `
        query get_queue_data($orderBy: [QueueOrderByWithRelationInput!]) {
            getOrganizer {
                queues(orderBy: $orderBy) {
                    queueId: id
                    name
                    state
                    create_time
                }
            }
        }
    `
    const variables = {
        "orderBy":
        {
            "create_time": "asc"
        }
    }

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
                                         body: JSON.stringify({query: query, variables: variables})
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
    // Poll only if user is currently on this screen and alert is not shown (to prevent flickering)
    useInterval(fetchQueuesData, useIsFocused() && !showConfirmDeleteAlert ? 5000 : null)

    return (
        <>
            <QueuesCatalogCardGroup
                entities={props}
                setEntities={setProps}
                showConfirmDeleteAlert={showConfirmDeleteAlert}
                setShowConfirmDeleteAlert={setShowConfirmDeleteAlert}
            />
            <Fab
                onPress={() => setShowCreateQueueModal(!showCreateQueueModal)}
                position="absolute"
                size="sm"
                icon={<Icon color="white" as={<AntDesign name="plus" />} size="sm" />}
                renderInPortal={useIsFocused()}
            />
            <CreateQueueModal showModal={showCreateQueueModal} setShowModal={setShowCreateQueueModal} />
            <ConfirmDeleteAlert showAlert={showConfirmDeleteAlert} setShowAlert={setShowConfirmDeleteAlert}/>
        </>
    )
}
