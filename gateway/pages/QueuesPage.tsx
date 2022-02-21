import React, {SetStateAction, useEffect, useState} from "react"
import QueuesCatalogCardGroup from "../components/molecules/QueuesCatalogCardGroup"
import {Fab, Icon, useToast} from "native-base"
import {AntDesign} from "@expo/vector-icons"
import {useIsFocused, useNavigation} from "@react-navigation/native";
import {HomeScreenProps, QueueInfo} from "../types";
import CreateQueueModal from "../containers/CreateQueueModal";
import useInterval from "../utilities/useInterval";
import RightHeaderGroup from "../components/molecules/RightHeaderGroup";
import ConfirmDeleteAlert from "../containers/ConfirmDeleteAlert";
import {useTranslation} from "react-i18next";
import baseURL from "../utilities/baseURL";


type QueuesPageProps = {
    queueInfo: QueueInfo[],
    showConfirmDeleteAlert: {show: boolean, callback: Function},
    setShowConfirmDeleteAlert: React.Dispatch<React.SetStateAction<boolean>>
}


export default function () {
    const { t } = useTranslation("queuesPage")
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const [props, setProps] = useState<QueuesPageProps["queueInfo"]>([])
    const [errors, setError] = useState<any>([]);
    const [showCreateQueueModal, setShowCreateQueueModal] = useState<boolean>(false);
    const [showConfirmDeleteAlert, setShowConfirmDeleteAlert] = useState<any>({show: false, callback: () => {}})
    useEffect(() => navigation.setOptions({headerRight: RightHeaderGroup()}), [])
    const toast = useToast()

    useEffect(() => {
        if (!!errors.length) {
            toast.show({
                title: t('something_went_wrong', {ns: "common"}),
                status: "error",
                description: t(!errors.length ? "cannot_fetch_queue_message" : errors[0])
            })
        }
    }, [errors])  // Render alert if errors

    const query = `
        query get_queue_data($orderBy: [QueueOrderByWithRelationInput!]) {
            getOrganizer {
                ... on Organizer {
                    id
                    name
                    queues(orderBy: $orderBy) {
                        queueId: id
                        name
                        state
                        create_time
                    }
                }
                ... on Error {
                    error
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
            const response = await fetch(baseURL(),
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
                    if (!!data.errors?.length) {setError(data.errors[0])}  // Check for errors on response
                    setProps(data.data.getOrganizer.queues)
                }
            )
        } catch(error) {
            setError([...errors, error])
        }
    }

    // Run on first render
    useEffect(() => {fetchQueuesData().then()}, [])
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
                renderInPortal={useIsFocused()}  // So that the FAB only renders in the current screen
            />
            <CreateQueueModal showModal={showCreateQueueModal} setShowModal={setShowCreateQueueModal} />
            <ConfirmDeleteAlert showAlert={showConfirmDeleteAlert} setShowAlert={setShowConfirmDeleteAlert}/>
        </>
    )
}
