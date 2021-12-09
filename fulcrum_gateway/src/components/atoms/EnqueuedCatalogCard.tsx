import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet,
        Pressable, Animated,
        PanResponder, Dimensions,
        GestureResponderEvent } from "react-native";
import { HStack, Text,
        Box, View,
        Center, Avatar } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { onLeftSwipe, onRightSwipe } from "../../utilities/swipeAnimation";

type EnqueuedCatalogProps = {
    onPress: (event: GestureResponderEvent) => void,
    onLongPress: (event: GestureResponderEvent) => void,
    deSelectItems: Function,
    selected: boolean,
    modified: string,
    entity: {
        userId: string,
        name: string,
        index: number,
        waited: number,
        state: string
    },
}

export default function (props: EnqueuedCatalogProps) {
    const [summoned, setSummoned] = useState<boolean>(false)
    const [online, setOnline] = useState<boolean>(true)

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
        mutation summon_user($user_id: ID!){
            summon_user(user_id: $user_id)
        }
    `
    const variables = `{
        "user_id": "user0"
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
                    maxW="80"
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
                            <Avatar style={styles.icon} source={require("../../assets/images/generic-user-icon.jpg")}>
                                <Avatar.Badge bg={online ? "green.500" : "red.500"}/>
                            </Avatar>
                            <Text suppressHighlighting={true} style={styles.text}>
                                {props.entity.name}
                            </Text>
                            <Text style={styles.text}>
                                {props.entity.index}
                            </Text>
                            <Text style={styles.text}>
                                {props.entity.waited}
                            </Text>
                            <MaterialCommunityIcons selectable={false}
                                                    name={summoned ? "bell-circle" : "bell-circle-outline"}
                                                    size={32}
                                                    color={"#999999"}
                                                    onPress={onBellPress}/>
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
        width: 500,
    },
    icon: {
        margin: 10,
        borderRadius: 10,
        width: 50,
        height: 50,
    },
    text: {
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

