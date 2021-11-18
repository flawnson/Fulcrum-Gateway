import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet,
        Pressable, Animated,
        PanResponder, Dimensions,
        GestureResponderEvent } from "react-native";
import { HStack, Text,
        Box, View,
        Center, Avatar } from 'native-base';
import { useNavigation } from "@react-navigation/native";
import { HomeScreenProps } from "../../../types";
import { MaterialCommunityIcons } from '@expo/vector-icons';

type OrganizerCatalogProps = {
    'onPress': (event: GestureResponderEvent) => void,
    'onLongPress': (event: GestureResponderEvent) => void,
    'selected': boolean,
    'entity': {
        queuerId: number,
        name: string,
        index: string,
        waited: string,
    }
}

export default function (props: OrganizerCatalogProps) {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const [summoned, setSummoned] = useState<boolean>(false)
    const [online, setOnline] = useState<boolean>(true)

    async function toggleSummonQueuer (queuerId: number) {
        try {
            const response = await fetch('http://localhost:8080/organizer/ORGANIZERID/queues/QUEUEID/QUEUERID/summon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({queuerId: queuerId})
            });
            // enter you logic when the fetch is successful
            return await response.json()
        } catch(error) {
            // enter your logic for when there is an error (ex. error toast)
            return error
        }
    }

    useEffect(() => {
        toggleSummonQueuer(props.entity.queuerId).then(null)
    }, [summoned])

    const onBellPress = function () {
        setSummoned(!summoned)
    }

    const onCardPress = function () {
        navigation.navigate("QueuerDashboard")
    }

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
                            <MaterialCommunityIcons name={summoned ? "bell-circle-outline" : "bell-circle"} size={32} color={"#999999"} onPress={onBellPress}/>
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

