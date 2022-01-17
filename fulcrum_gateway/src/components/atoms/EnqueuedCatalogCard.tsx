import React, {useState, useEffect, useRef, SetStateAction} from 'react';
import { StyleSheet, Animated } from "react-native";
import { HStack, Text,
        Box, View,
        Avatar, VStack } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { onLeftSwipe, onRightSwipe } from "../../utilities/swipeAnimation";
import { EnqueuedStats, UserStatus } from "../../../types";
import { Swipeable, RectButton,
        State, HandlerStateChangeEvent,
        LongPressGestureHandlerEventPayload,
        TapGestureHandlerEventPayload,
        LongPressGestureHandler, TapGestureHandler } from "react-native-gesture-handler";

type EnqueuedCatalogProps = {
    entities: Array<EnqueuedStats>
    setEntities: React.Dispatch<React.SetStateAction<EnqueuedStats[]>>
    onPress: (event?: HandlerStateChangeEvent<TapGestureHandlerEventPayload>) => void,
    onLongPress: (event?: HandlerStateChangeEvent<LongPressGestureHandlerEventPayload>) => void,
    deSelectItems: () => void,
    selected: boolean,
    entity: EnqueuedStats,
}

export default function (props: EnqueuedCatalogProps) {
    const [summoned, setSummoned] = useState<boolean>(false)

    const summonQuery = `
        mutation summon_user($userId: String!) {
            summon(userId: $userId) {
                summoned
            }
        }
    `

    async function toggleSummonUser (userId: string) {
        try {
            const response = await fetch(`http://localhost:8080/api`, {
                                         method: 'POST',
                                         headers: {
                                             'Content-Type': 'application/json',
                                             'Access-Control-Allow-Origin': 'http://localhost:19006/',
                                         },
                                         credentials: 'include',
                                         body: JSON.stringify({query: summonQuery, variables: {userId: userId}})
                                     });
            // enter you logic when the fetch is successful
            return await response.json()
        } catch(error) {
            // enter your logic for when there is an error (ex. error toast)
            return error
        }
    }

    useEffect(() => {
        toggleSummonUser(props.entity.userId).then()
    }, [summoned])

    const onBellPress = function () {
        setSummoned(!summoned)
    }

    const statusQuery = `
        mutation change_status($userId: String! $status: String!) {
            changeStatus(userId: $userId status: $status) {
                id
            }
        }
    `

    async function changeUserStatus (status: UserStatus) {
        try {
            const response = await fetch(`http://localhost:8080/api`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:19006/',
                },
                credentials: 'include',
                body: JSON.stringify({query: statusQuery, variables: {userId: props.entity.userId, status: status}})
            });
            // enter you logic when the fetch is successful
            return await response.json()
        } catch(error) {
            // enter your logic for when there is an error (ex. error toast)
            return error
        }
    }

    const onChangeStatusPress = (status: UserStatus) => {
        props.entities.find(user => user.userId === props.entity.userId)!.status = status
        changeUserStatus(status).then()
        props.setEntities(
            [...props.entities.filter(user => user.userId !== props.entity.userId)]
        )
    }

    const renderRightActions = (progress: any, dragX: any) => {
        const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [-20, 0, 0, 1],
        });
        return (
            <RectButton style={styles.rightAction} onPress={() => onChangeStatusPress("KICKED")}>
                <Animated.Text
                    style={[
                        styles.actionText,
                        {
                            transform: [{ translateX: trans }],
                        },
                    ]}>
                    Kick
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
            <RectButton style={styles.leftAction} onPress={() => onChangeStatusPress("SERVICED")}>
                <Animated.Text
                    style={[
                        styles.actionText,
                        {
                            transform: [{ translateX: trans }],
                        },
                    ]}>
                    Service
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
                        <HStack space='5' style={styles.group}>
                            <Avatar style={styles.avatar}
                                    source={{uri: `https://avatars.dicebear.com/api/micah/${props.entity.userId}.svg?mood[]=happy`}}>
                                <Avatar.Badge bg={props.entity.online ? "green.500" : "red.500"}/>
                            </Avatar>
                            <Text style={styles.text}>
                                {props.entity.index}
                            </Text>
                            <Text suppressHighlighting={true} style={styles.text}>
                                {props.entity.name}
                            </Text>
                            <VStack style={styles.text}>
                                <Text>
                                    {props.entity.waited}
                                </Text>
                                <MaterialCommunityIcons selectable={false}
                                                        name={summoned ? "bell-circle" : "bell-circle-outline"}
                                                        size={32}
                                                        color={"#999999"}
                                                        style={styles.icon}
                                                        onPress={onBellPress}/>
                            </VStack>
                        </HStack>
                        {props.selected && <View style={styles.overlay} />}
                    </Box>
                </TapGestureHandler>
            </LongPressGestureHandler>
        </Swipeable>
    );
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
    text: {
        flex: 1,
    },
    icon: {
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
        backgroundColor: 'green'
    },
    rightAction: {
        backgroundColor: 'red'
    },
    actionText: {
        fontSize: 30
    }
})

