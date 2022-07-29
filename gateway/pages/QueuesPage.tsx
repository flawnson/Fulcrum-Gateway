import React, {useEffect, useRef, useState} from "react"
import QueuesCatalogCardGroup from "../components/molecules/QueuesCatalogCardGroup"
import {AppState} from "react-native";
import {Heading, useToast, Center } from "native-base"
import {useIsFocused, useNavigation, useRoute} from "@react-navigation/native";
import {HomeScreenProps, QueueInfo} from "../types";
import CreateQueueModal from "../containers/CreateQueueModal";
import useInterval, {interval} from "../utilities/useInterval";
import RightHeaderGroup from "../components/molecules/RightHeaderGroup";
import ConfirmActionAlert from "../containers/ConfirmActionAlert";
import {useTranslation} from "react-i18next";
import baseURL from "../utilities/baseURL";
import corsURL from "../utilities/corsURL";
import QueuesPageMenu from "../containers/QueuesPageMenu";


type QueuesPageProps = {
    queueInfo: QueueInfo[],
    showConfirmActionAlert: {show: boolean, callback: Function},
    setShowActionDeleteAlert: React.Dispatch<React.SetStateAction<boolean>>
}


export default function () {
    const { t } = useTranslation("queuesPage")
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const [organizerInfo, setOrganizerInfo] = useState<{name: string}>({name: "Someone's queues"})
    const [props, setProps] = useState<QueuesPageProps["queueInfo"]>([])
    const [errors, setError] = useState<any>([]);
    const [showCreateQueueModal, setShowCreateQueueModal] = useState<boolean>(false);
    const [showConfirmActionAlert, setShowConfirmActionAlert] = useState<{show: boolean, callback: Function}>({show: false, callback: () => {}})
    const toast = useToast()
    const toastId = "errorToast"
    useEffect(() => navigation.setOptions({headerLeft: () => false, headerRight: RightHeaderGroup()}), [])

    useEffect(() => {
        if (!!errors.length) {
            toast.show({
                id: toastId,
                title: t('something_went_wrong', {ns: "common"}),
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
            fetch(baseURL(),
                 {
                     method: 'POST',
                     headers: {
                     'Content-Type': 'application/json',
                     'Access-Control-Allow-Origin': corsURL(),
                     },
                     credentials: 'include',
                     body: JSON.stringify({query: query, variables: variables})
        }).then(response => response.json()).then(data => {
                    if (!!data.errors?.length) {setError([...errors, data.errors[0]])}  // Check for errors on response
                    setOrganizerInfo({name: data.data.getOrganizer.name})
                    setProps(data.data.getOrganizer.queues)
                }
            )
        } catch(error) {
            setError([...errors, error])
        }
    }

    // Run on first render and when a queue is created or deleted
    useEffect(() => {fetchQueuesData().then()}, [showCreateQueueModal, showConfirmActionAlert])
    // Poll only if user is currently on this screen, app state is active, and alert is not shown (to prevent flickering)
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    useEffect(() => {
        AppState.addEventListener("change", nextAppState => {
            appState.current = nextAppState;
            setAppStateVisible(appState.current);
        });
    }, []);
    useInterval(fetchQueuesData, useIsFocused() && appStateVisible && !showConfirmActionAlert.show && !showCreateQueueModal ? interval : null)

    return (
        <>
            <Center>
                <Heading style={{fontSize: 24, marginVertical: 30}}>
                    {organizerInfo.name}
                </Heading>
            </Center>
            <QueuesCatalogCardGroup
                entities={props}
                setEntities={setProps}
                showConfirmActionAlert={showConfirmActionAlert}
                setShowConfirmActionAlert={setShowConfirmActionAlert}
            />
            <CreateQueueModal
                showModal={showCreateQueueModal}
                setShowModal={setShowCreateQueueModal}
            />
            <ConfirmActionAlert
                message={t("confirm_delete_queues_message")}
                showAlert={showConfirmActionAlert}
                setShowAlert={setShowConfirmActionAlert}
            />
            <QueuesPageMenu />
        </>
    )
}
