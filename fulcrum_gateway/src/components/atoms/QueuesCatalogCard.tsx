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

type QueuesCatalogProps = {
    entities: Array<QueueInfo>
    setEntities: React.Dispatch<React.SetStateAction<QueueInfo[]>>
    onPress: (event?: HandlerStateChangeEvent<TapGestureHandlerEventPayload>) => void,
    onLongPress: (event?: HandlerStateChangeEvent<LongPressGestureHandlerEventPayload>) => void,
    deSelectItems: () => void,
    selected: boolean,
    entity: QueueInfo
}

export default function (props: QueuesCatalogProps) {
    const [online, setOnline] = useState<boolean>(true)

    const stateQuery = `
        mutation change_state($queueId: String! $state: String!) {
            changeStatus(queueId: $queueId state: $state) {
                queue_id: id
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

    const onChangeStatePress = (state: QueueState) => {
        props.entities.find(user => user.queueId === props.entity.queueId)!.state = "PAUSED"
        changeQueueState("PAUSED").then()
        props.setEntities(
            [...props.entities.filter(user => user.queueId !== props.entity.queueId)]
        )
    }

    const renderRightActions = (progress: any, dragX: any) => {
        const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [-20, 0, 0, 1],
        });
        return (
            <RectButton style={styles.rightAction} onPress={() => onChangeStatePress("INACTIVE")}>
                <Animated.Text
                    style={[
                        styles.actionText,
                        {
                            transform: [{ translateX: trans }],
                        },
                    ]}>
                    Deactivate
                </Animated.Text>
            </RectButton>
        );
    }

    const renderLeftActions = (progress: any, dragX: any) => {
        const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [-20, 0, 0, 1],
        });
        return (
            <RectButton style={styles.leftAction} onPress={() => onChangeStatePress("PAUSED")}>
                <Animated.Text
                    style={[
                        styles.actionText,
                        {
                            transform: [{ translateX: trans }],
                        },
                    ]}>
                    Pause
                </Animated.Text>
            </RectButton>
        );
    }

    return (
        <Swipeable
            renderLeftActions={renderLeftActions}
            renderRightActions={renderRightActions}
        >
            <LongPressGestureHandler
                onHandlerStateChange={({ nativeEvent }) => {
                    if (nativeEvent.state === State.ACTIVE) {
                        props.onLongPress()
                    }
                }}
                minDurationMs={800}
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
                                {props.entity.lifespan}
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
        marginTop: 10,
        marginBottom: 10,
    },
    group: {
        display: 'flex',
        height: 70,
        width: 300,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
    },
    avatar: {
        borderRadius: 10,
    },
    name: {
        margin: 10,
        flex: 1,
    },
    lifespan: {
        margin: 10,
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
        backgroundColor: 'red'
    },
    rightAction: {
        backgroundColor: 'green'
    },
    actionText: {
        fontSize: 30
    }
})

