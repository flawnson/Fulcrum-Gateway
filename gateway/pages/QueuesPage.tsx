import React, {SetStateAction, useEffect, useState} from "react"
import QueuesCatalogCardGroup from "../components/molecules/QueuesCatalogCardGroup"
import {Fab, Icon,
        Text, useToast,
        Center } from "native-base"
import {AntDesign} from "@expo/vector-icons"
import {useIsFocused, useNavigation, useRoute} from "@react-navigation/native";
import {HomeScreenProps, QueueInfo} from "../types";
import CreateQueueModal from "../containers/CreateQueueModal";
import useInterval from "../utilities/useInterval";
import RightHeaderGroup from "../components/molecules/RightHeaderGroup";
import ConfirmDeleteAlert from "../containers/ConfirmDeleteAlert";
import {useTranslation} from "react-i18next";
import baseURL from "../utilities/baseURL";
import corsURL from "../utilities/corsURL";
import QueuesPageMenu from "../containers/QueuesPageMenu";


type QueuesPageProps = {
    queueInfo: QueueInfo[],
    showConfirmDeleteAlert: {show: boolean, callback: Function},
    setShowConfirmDeleteAlert: React.Dispatch<React.SetStateAction<boolean>>
}


export default function () {
    const { t } = useTranslation("queuesPage")
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const [organizerInfo, setOrganizerInfo] = useState<{name: string}>({name: "Someone's queues"})
    const [props, setProps] = useState<QueuesPageProps["queueInfo"]>([])
    const [errors, setError] = useState<any>([]);
    const [showCreateQueueModal, setShowCreateQueueModal] = useState<boolean>(false);
    const [showConfirmDeleteAlert, setShowConfirmDeleteAlert] = useState<any>({show: false, callback: () => {}})
    const toast = useToast()
    const toastId = "errorToast"
    useEffect(() => navigation.setOptions({headerLeft: () => false, headerRight: RightHeaderGroup()}), [])

    useEffect(() => {
        if (!!errors.length) {
            toast.show({
                id: toastId,
                title: t('something_went_wrong', {ns: "common"}),
                status: "error",
                description: t("cannot_fetch_queue_message"),
                duration: 10
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
                                         'Access-Control-Allow-Origin': corsURL(),
                                         },
                                         credentials: 'include',
                                         body: JSON.stringify({query: query, variables: variables})
                                     })
            await response.json().then(
                data => {
                    if (!!data.errors?.length) {setError([...errors, data.errors[0]])}  // Check for errors on response
                    setOrganizerInfo({name: data.data.getOrganizer.name})
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
    useInterval(fetchQueuesData, useIsFocused() ? 5000 : null)

    return (
        <>
            <Center>
                <Text style={{fontSize: 24, marginVertical: 30}}>
                    {organizerInfo.name}
                </Text>
            </Center>
            <QueuesCatalogCardGroup
                entities={props}
                setEntities={setProps}
                showConfirmDeleteAlert={showConfirmDeleteAlert}
                setShowConfirmDeleteAlert={setShowConfirmDeleteAlert}
            />
            <CreateQueueModal showModal={showCreateQueueModal} setShowModal={setShowCreateQueueModal} />
            <ConfirmDeleteAlert showAlert={showConfirmDeleteAlert} setShowAlert={setShowConfirmDeleteAlert}/>
            <QueuesPageMenu />
        </>
    )
}
