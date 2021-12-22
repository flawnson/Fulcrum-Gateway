import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet,
        Pressable, Animated,
        PanResponder, Dimensions,
        GestureResponderEvent } from "react-native";
import {
    HStack, Text,
    Box, View,
    Center, Avatar, VStack
} from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { onLeftSwipe, onRightSwipe } from "../../utilities/swipeAnimation";
import { EnqueuedStats } from "../../../types";

type EnqueuedCatalogProps = {
    onPress: (event: GestureResponderEvent) => void,
    onLongPress: (event: GestureResponderEvent) => void,
    deSelectItems: () => void,
    selected: boolean,
    modified: string,
    entity: EnqueuedStats,
}

export default function (props: EnqueuedCatalogProps) {
    const [summoned, setSummoned] = useState<boolean>(false)

    const pan = useRef(new Animated.ValueXY()).current;

    useEffect(() => {
        if (props.modified === "KICKED") {
            onLeftSwipe(pan)
        } else if (props.modified === "SERVICED") {
            onRightSwipe(pan)
        } else if (props.modified === "SUMMONED") {
            onBellPress()
        }
        props.deSelectItems()
    }, [props.modified])

    const query = `
        mutation summon_user($userId: UserWhereUniqueInput!, $data: UserUpdateInput!) {
            updateUser(where: $userId, data: $data) {
                name
                summoned
            }
        }
    `
    const variables = `{
        "userId":
        {
            "id": "user0"
        },
        "data": 
        {
            "summoned": {
                "set": true
            }
        }
    }`

    async function toggleSummonUser (userId: string) {
        try {
            const response = await fetch(`http://localhost:8080/api?query=${query}&variables=${variables}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: userId})
            });
            // enter you logic when the fetch is successful
            console.log(await response.json())
            return await response.json()
        } catch(error) {
            // enter your logic for when there is an error (ex. error toast)
            return error
        }
    }

    useEffect(() => {
        toggleSummonUser(props.entity.userId).then(null)
    }, [summoned])

    const onBellPress = function () {
        setSummoned(!summoned)
    }

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([
                null,
                { dx: pan.x }
            ], {useNativeDriver: false}),
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dx > 200) {
                    Animated.spring(pan, {
                        toValue: { x: Dimensions.get('window').width + 100, y: gestureState.dy }, useNativeDriver: false
                    }).start(() => console.log('hi'))
                } else if (gestureState.dx < -200) {
                    Animated.spring(pan, {
                        toValue: { x: -Dimensions.get('window').width - 100, y: gestureState.dy }, useNativeDriver: false
                    }).start(() => console.log('bye'))
                } else {
                    Animated.spring(pan, {toValue: {x: 0, y: 5}, friction: 5, useNativeDriver: false}).start();
                }
            }
        })
    ).current;

    return (
        <Center>
            <Animated.View
                style={{
                    transform: [{ translateX: pan.x }, { translateY: pan.y }]
                }}
                {...panResponder.panHandlers}
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
                    <Pressable onPress={props.onPress} delayLongPress={500} onLongPress={props.onLongPress}>
                        <HStack space='5' style={styles.group}>
                            <Avatar style={styles.avatar} source={require("../../assets/images/generic-user-icon.jpg")}>
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
                    </Pressable>
                </Box>
            </Animated.View>
        </Center>
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
})

