import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Pressable,
        GestureResponderEvent, Animated,
        PanResponder, Dimensions } from "react-native";
import {
    HStack, Text,
    Box, Center,
    Avatar, View
} from 'native-base';
import { QueueInfo } from "../../../types";

type QueuesCatalogProps = {
    onPress: (event: GestureResponderEvent) => void,
    onLongPress: (event: GestureResponderEvent) => void,
    deSelectItems: () => void,
    selected: boolean,
    modified: string,
    entity: QueueInfo
}

export default function (props: QueuesCatalogProps) {
    const [online, setOnline] = useState<boolean>(true)

    useEffect(() => {
        if (props.modified === "PAUSED") {
            setOnline(!online)
        } else if (props.modified === "INACTIVE") {
            setOnline(!online)
        }
        props.deSelectItems()
    }, [props.modified])

    const pan = useRef(new Animated.ValueXY()).current;

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
                    </Pressable>
                </Box>
            </Animated.View>
        </Center>
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
})

