import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Animated } from "react-native";
import { HStack, Text,
        Box, VStack,
        Badge, View } from 'native-base';
import { QueueInfo, QueueState, UserStatus } from "../../types";
import { Swipeable, RectButton,
        State, HandlerStateChangeEvent,
        LongPressGestureHandlerEventPayload,
        TapGestureHandlerEventPayload,
        LongPressGestureHandler, TapGestureHandler } from "react-native-gesture-handler";
import ConfirmActionAlert from "../../containers/ConfirmActionAlert";
import calculateTimeToNow from "../../utilities/calculateTimeToNow";
import { scale } from "../../utilities/scales";
import useDimensions from "../../utilities/useDimensions";
import baseURL from "../../utilities/baseURL";
import corsURL from "../../utilities/corsURL";
import {useTranslation} from "react-i18next";

type QueuesCatalogCardProps = {
    entities: Array<QueueInfo>
    setEntities: React.Dispatch<React.SetStateAction<QueueInfo[]>>
    onPress: (event?: HandlerStateChangeEvent<TapGestureHandlerEventPayload>) => void,
    onLongPress: (event?: HandlerStateChangeEvent<LongPressGestureHandlerEventPayload>) => void,
    deSelectItems: () => void,
    selected: boolean,
    showConfirmDeleteAlert: {show: boolean, callback: Function}
    setShowConfirmDeleteAlert: React.Dispatch<React.SetStateAction<any>>
    entity: QueueInfo
}


export default function (props: QueuesCatalogCardProps) {
    const { t } = useTranslation("queuesCatalogCard")
    const [queueState, setQueueState] = useState<QueueState>(props.entity.state)
    const { width, height } = useDimensions()
    const swipeableRef = useRef(null)

    const pauseQuery = `
        mutation change_queue_state($queueId: String, $state: String!) {
            changeQueueState(queueId: $queueId, state: $state) {
                ... on Queue {
                    id
                    state
                }
                ... on Error {
                    error
                }
            }
        }
    `
    const deleteQuery = `
      mutation delete_queue($queueId: String!) {
          deleteQueue(queueId: $queueId){
              ... on Queue {
                  id
              }
              ... on Error {
                  error
              }
          }
      }
    `
    //@ts-ignore

    async function changeQueueState (state: QueueState | "DELETED") {
        try {
            const body = state === "PAUSED"
                ? {query: pauseQuery, variables: {queueId: props.entity.queueId,
                                                  state: queueState === "PAUSED" ? "ACTIVE" : "PAUSED"}}
                : state === "DELETED"
                ? {query: deleteQuery, variables: {queueId: props.entity.queueId}}
                : {error: "error"}  // Trigger error if state is not PAUSED or DELETED
            fetch(baseURL(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': corsURL(),
                },
                credentials: 'include',
                body: JSON.stringify(body)
            }).then(response => response.json()).then(data => {})
        } catch(error) {
            // enter your logic for when there is an error (ex. error toast)
            return error
        }
    }

    const onChangeState = (state: QueueState) => {
        if (state === "DELETED"){
            props.setShowConfirmDeleteAlert(
                {
                    show: true,
                    callback: () => {
                        changeQueueState(state).then()
                        props.entities.find(user => user.queueId === props.entity.queueId)!.state = state
                        props.setEntities(
                            [...props.entities.filter(user => user.queueId !== props.entity.queueId)]
                        )
                    }
                }
            )
        } else if (state === "PAUSED") {
            // @ts-ignore
            swipeableRef?.current?.close()
            changeQueueState(state).then()
            setQueueState(queueState === "PAUSED" ? "ACTIVE" : "PAUSED")
        }
    }

    const [timeLeft, setTimeLeft] = useState<object>(calculateTimeToNow(props.entity.create_time))
    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeToNow(props.entity.create_time))
        }, 1000)

        return () => clearTimeout(timer)
    })

    const timerComponents: Array<React.ComponentElement<any, any>> = [];

    Object.keys(timeLeft).forEach((interval) => {
        // @ts-ignore
        if (!timeLeft[interval]) {
            return
        }

        timerComponents.push(
            <Text key={interval}>
                {/*// @ts-ignore*/}
                {timeLeft[interval]} {interval}{" "}
            </Text>
        );
    });

    const position = new Animated.ValueXY()
    let nextCardOpacity = position.x.interpolate({
        inputRange: [-width, 0, width],
        outputRange: [0, 0.5, 1],
        extrapolate: 'clamp'
    })

    const renderRightActions = (progress: any, dragX: any) => {
        return (
            <Animated.Text style={[styles.actionText, {opacity: nextCardOpacity}]}>
                Delete
            </Animated.Text>
        );
    }

    const renderLeftActions = (progress: any, dragX: any) => {
        return (
            <Animated.Text style={[styles.actionText, {opacity: nextCardOpacity}]}>
                {queueState === "PAUSED" ? "Unpause" : "Pause"}
            </Animated.Text>
        );
    }

    return (
        <>
            <ConfirmActionAlert
                message={t("confirm_delete_queues_message")}
                showAlert={props.showConfirmDeleteAlert}
                setShowAlert={props.setShowConfirmDeleteAlert}
            />
            <Swipeable
                ref={swipeableRef}
                renderLeftActions={renderLeftActions}
                renderRightActions={renderRightActions}
                onSwipeableLeftOpen={() => onChangeState("PAUSED")}
                onSwipeableRightOpen={() => onChangeState("DELETED")}
            >
                <LongPressGestureHandler
                    onHandlerStateChange={({ nativeEvent }) => {
                        if (nativeEvent.state === State.ACTIVE) {
                            props.onLongPress()
                        }
                    }}
                    minDurationMs={700}
                >
                    <TapGestureHandler
                        onHandlerStateChange={({ nativeEvent }) => {
                            if (nativeEvent.state === State.END) {
                                props.onPress()
                            }
                        }}
                    >
                        <Box
                            rounded="lg"
                            borderRadius="lg"
                            overflow="hidden"
                            borderColor="coolGray.200"
                            borderWidth="1"
                            _dark={{
                                borderColor: "coolGray.600",
                                backgroundColor: "gray.700",
                            }}
                            _web={{
                                shadow: "2",
                                borderWidth: "0",
                            }}
                            _light={{
                                backgroundColor: "gray.50",
                            }}
                            style={styles.card}
                        >
                            <HStack style={styles.group}>
                                <Text>   </Text>  {/* Needed for spacing*/}
                                <Text>{queueState === "ACTIVE" ? "????" : "????"}</Text>
                                <Text suppressHighlighting={true} style={styles.name}>
                                    {props.entity.name}
                                </Text>
                                <VStack>
                                    <Text suppressHighlighting={true} style={styles.lifespan}>
                                        Live for:
                                    </Text>
                                    <Text style={styles.lifespan}>
                                        {/*{props.entity.lifespan}*/}
                                        {timerComponents.length ? timerComponents : <Text>Can't get lifespan...</Text>}
                                    </Text>
                                </VStack>
                            </HStack>
                            {props.selected && <View style={styles.overlay} />}
                        </Box>
                    </TapGestureHandler>
                </LongPressGestureHandler>
            </Swipeable>
        </>
    )
}

const styles = StyleSheet.create({
    card: {
        cursor: 'pointer',
        marginTop: scale(10),
        marginBottom: scale(10),
    },
    group: {
        display: 'flex',
        height: scale(70),
        width: scale(300),
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
    },
    avatar: {
        borderRadius: 10,
    },
    name: {
        fontSize: scale(16),
        margin: scale(10),
        flex: 1,
    },
    lifespan: {
        fontSize: scale(10),
        margin: scale(10),
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    leftAction: {
        height: scale(70),
        width: scale(300),
        backgroundColor: 'red'
    },
    rightAction: {
        height: scale(70),
        width: scale(300),
        backgroundColor: 'green'
    },
    actionText: {
        fontSize: scale(30),
        display: 'flex',
        alignItems: 'center'
    }
})
