import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Pressable,
        GestureResponderEvent, Animated,
        PanResponder, Dimensions } from "react-native";
import { HStack, Text,
        Box, Center,
        Avatar, View } from 'native-base';
import { QueueInfo, QueueState, UserStatus } from "../../../types";
import { Swipeable, RectButton,
        State, HandlerStateChangeEvent,
        LongPressGestureHandlerEventPayload,
        TapGestureHandlerEventPayload,
        LongPressGestureHandler, TapGestureHandler } from "react-native-gesture-handler";
import calculateTimeToNow from "../../utilities/calculateTimeToNow";
import { scale } from "../../utilities/scales";

type QueuesCatalogProps = {
    entities: Array<QueueInfo>
    setEntities: React.Dispatch<React.SetStateAction<QueueInfo[]>>
    onPress: (event?: HandlerStateChangeEvent<TapGestureHandlerEventPayload>) => void,
    onLongPress: (event?: HandlerStateChangeEvent<LongPressGestureHandlerEventPayload>) => void,
    deSelectItems: () => void,
    selected: boolean,
    entity: QueueInfo
}

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

export default function (props: QueuesCatalogProps) {
    const [online, setOnline] = useState<boolean>(true)
    const swipeableRef = useRef(null)

    const stateQuery = `
        mutation change_queue_state($queueId: String, $state: String!) {
            changeQueueState(queueId: $queueId, state: $state) {
                id
                state
            }
        }
    `

    async function changeQueueState (state: QueueState) {
        try {
            const response = await fetch(`http://localhost:8080/api`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:19006/',
                },
                credentials: 'include',
                body: JSON.stringify({query: stateQuery, variables: {queueId: props.entity.queueId, state: state}})
            });
            // enter you logic when the fetch is successful
            return await response.json()
        } catch(error) {
            // enter your logic for when there is an error (ex. error toast)
            return error
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

    const onChangeStatePress = (state: QueueState) => {
        props.entities.find(user => user.queueId === props.entity.queueId)!.state = state
        changeQueueState(state).then()
        if (state === "INACTIVE"){
            props.setEntities(
                [...props.entities.filter(user => user.queueId !== props.entity.queueId)]
            )
        } else if (state === "PAUSED") {
            // @ts-ignore
            swipeableRef?.current?.close()
            setOnline(!online)
        }
    }

    const position = new Animated.ValueXY()
    let nextCardOpacity = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
        outputRange: [0, 0.5, 1],
        extrapolate: 'clamp'
    })

    const renderRightActions = (progress: any, dragX: any) => {
        return (
            <Animated.Text style={[styles.actionText, {opacity: nextCardOpacity}]}>
                Deactivate
            </Animated.Text>
        );
    }

    const renderLeftActions = (progress: any, dragX: any) => {
        return (
            <Animated.Text style={[styles.actionText, {opacity: nextCardOpacity}]}>
                {online ? "Pause" : "Unpause"}
            </Animated.Text>
        );
    }

    return (
        <Swipeable
            ref={swipeableRef}
            renderLeftActions={renderLeftActions}
            renderRightActions={renderRightActions}
            onSwipeableLeftOpen={() => onChangeStatePress("PAUSED")}
            onSwipeableRightOpen={() => onChangeStatePress("INACTIVE")}
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
                            <Avatar style={styles.avatar} source={require("../../assets/images/generic-user-icon.jpg")}>
                                <Avatar.Badge bg={online ? "green.500" : "red.500"}/>
                            </Avatar>
                            <Text suppressHighlighting={true} style={styles.name}>
                                {props.entity.name}
                            </Text>
                            <Text style={styles.lifespan}>
                                {/*{props.entity.lifespan}*/}
                                {timerComponents.length ? timerComponents : <Text>Can't get lifespan...</Text>}
                            </Text>
                        </HStack>
                        {props.selected && <View style={styles.overlay} />}
                    </Box>
                </TapGestureHandler>
            </LongPressGestureHandler>
        </Swipeable>
    )
}

const styles = StyleSheet.create({
    card: {
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
