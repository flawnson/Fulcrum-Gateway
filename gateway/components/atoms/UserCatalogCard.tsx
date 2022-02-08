import React, {useState, useEffect, useRef, SetStateAction} from 'react';
import {StyleSheet, Animated, PressableStateCallbackType, Pressable, Dimensions} from "react-native";
import { HStack, Text,
        Box, View,
        Avatar, VStack } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {UserStatus, UserStats} from "../../types";
import { Swipeable, RectButton,
        State, HandlerStateChangeEvent,
        LongPressGestureHandlerEventPayload,
        TapGestureHandlerEventPayload,
        LongPressGestureHandler, TapGestureHandler } from "react-native-gesture-handler";
import ConfirmDeleteAlert from "../../containers/ConfirmDeleteAlert";
import { scale } from "../../utilities/scales"

type UserCatalogCardProps = {
    entities: Array<UserStats>
    setEntities: React.Dispatch<React.SetStateAction<UserStats[]>>
    onPress: (event?: HandlerStateChangeEvent<TapGestureHandlerEventPayload>) => void,
    onLongPress: (event?: HandlerStateChangeEvent<LongPressGestureHandlerEventPayload>) => void,
    deSelectItems: () => void,
    selected: boolean,
    showConfirmDeleteAlert?: {show: boolean, callback: Function}  // Only needed for enqueued page
    setShowConfirmDeleteAlert?: React.Dispatch<React.SetStateAction<any>>  // Only needed for enqueued page
    entity: UserStats,
}
type Children = (boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | ((state: PressableStateCallbackType) => React.ReactNode) | null | undefined)
type ConditionalWrapperArgs = {
    condition: number | undefined,  // Uses 0 as false and any other number as true
    wrapper: (children: Children) => any
    children: any
}

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

export default function (props: UserCatalogCardProps) {
    const [summoned, setSummoned] = useState<boolean>(false)
    const swipeableRef = useRef(null)  // Needed to automatically close swipe action

    const summonQuery = `
      mutation toggle_summon_user($userId: String!, $summoned: Boolean!) {
          toggleSummon(userId: $userId, summoned: $summoned) {
              ... on User {
                  id
                  summoned
              }
              ... on Error {
                  error
              }
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
                                         body: JSON.stringify({query: summonQuery, variables: {"userId": userId, "summoned": summoned}})
                                     });
            return await response.json()
        } catch(error) {
            return error
        }
    }

    const onBellPress = function () {
        setSummoned(!summoned)
        toggleSummonUser(props.entity.userId).then()
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
            return await response.json()
        } catch(error) {
            return error
        }
    }

    const onChangeStatus = (status: UserStatus) => {
        props.entities.find(user => user.userId === props.entity.userId)!.status = status
        changeUserStatus(status).then()
        if (status === "KICKED") {
            // Only needed if enqueued. Serviced and abandoned do not provide confirm delete props
            props.setShowConfirmDeleteAlert ?
            props.setShowConfirmDeleteAlert(
                {
                    show: true,
                    callback: () => props.setEntities(
                        [...props.entities.filter(user => user.userId !== props.entity.userId)]
                    )
                }
            ) : null
        } else if (status === "SERVICED") {
            props.setEntities(
                [...props.entities.filter(user => user.userId !== props.entity.userId)]
            )
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
                Kick
            </Animated.Text>
        );
    }

    const renderLeftActions = (progress: any, dragX: any) => {
        return (
            <Animated.Text style={[styles.actionText, {opacity: nextCardOpacity}]}>
                Service
            </Animated.Text>
        );
    }

    const ConditionalWrapper = ({condition, wrapper, children}: ConditionalWrapperArgs) =>
        condition ? wrapper(children) : children;

    return (
        <>
            {props.showConfirmDeleteAlert && props.setShowConfirmDeleteAlert ? <ConfirmDeleteAlert
                showAlert={props.showConfirmDeleteAlert}
                setShowAlert={props.setShowConfirmDeleteAlert}
            /> : <></>}
            <ConditionalWrapper
                condition={props.entity.index}  // User index is only provided to enqueued users, not serviced or reneged
                wrapper={
                (children: Children) =>
                    <Swipeable
                        ref={swipeableRef}
                        renderLeftActions={renderLeftActions}
                        renderRightActions={renderRightActions}
                        onSwipeableLeftOpen={() => onChangeStatus("SERVICED")}
                        onSwipeableRightOpen={() => onChangeStatus("KICKED")}
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
                                {children}
                            </TapGestureHandler>
                        </LongPressGestureHandler>
                    </Swipeable>
                }
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
                        <Avatar
                            size={scale(60)}
                            style={styles.avatar}
                            source={{uri: `https://avatars.dicebear.com/api/micah/${props.entity.userId}.svg?mood[]=happy`}}
                        >
                            {props.entity.online !== undefined ?
                                <Avatar.Badge bg={props.entity.online ? "green.500" : "red.500"}/> : <></>}
                        </Avatar>
                        {props.entity.index !== undefined ?
                            <Text style={styles.index}>
                                {`${props.entity.index}.`}
                            </Text> : <></>
                        }
                        <Text suppressHighlighting={true} style={styles.name}>
                            {props.entity.name}
                        </Text>
                        <VStack style={styles.pair}>
                            <Text style={styles.waited}>
                                {`${props.entity.waited} m`}
                            </Text>
                            {props.entity.finishTime
                                ? <Text style={styles.waited}>{props.entity.finishTime}</Text>
                                : <MaterialCommunityIcons
                                        selectable={false}
                                        name={summoned ? "bell-circle" : "bell-circle-outline"}
                                        size={scale(32)}
                                        color={"#999999"}
                                        style={styles.icon}
                                        onPress={onBellPress}
                                  />
                            }
                        </VStack>
                    </HStack>
                    {props.selected && <View style={styles.overlay} />}
                </Box>
            </ConditionalWrapper>
        </>
    );
}

const styles = StyleSheet.create({
    card: {
        marginTop: scale(10),
        marginBottom: scale(10),
    },
    group: {
        margin: 10,
        display: 'flex',
        height: scale(70),
        width: scale(300),
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
    },
    avatar: {
        flex: 1,
        borderRadius: 10,
    },
    index: {
        fontSize: scale(30),
        flex: 1,
    },
    name: {
        fontSize: scale(16),
        margin: scale(10),
        flex: 5,  // Trying to move the name to the left, closer to the index
    },
    pair: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    waited: {
        fontSize: scale(16),
        flex: 1
    },
    icon: {
        flex: 1
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
        fontSize: scale(30),
        display: 'flex',
        alignItems: 'center'
    }
})
