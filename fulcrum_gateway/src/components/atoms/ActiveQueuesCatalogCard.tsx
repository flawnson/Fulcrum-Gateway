import React, { useState, useEffect } from 'react';
import { StyleSheet, Pressable,
        GestureResponderEvent } from "react-native";
import { HStack, Text,
        Box, Center,
        Avatar } from 'native-base';

type QueuesCatalogProps = {
    'onPress': (event: GestureResponderEvent) => void,
    'entity': {
        queuerId?: number,
        name: string,
        lifespan: number,
        state: string,
    }
}

export default function (props: QueuesCatalogProps) {
    const [online, setOnline] = useState<boolean>(true)

    useEffect(() => {
        setOnline(props.entity.state === "ACTIVE")
    }, [props])

    return (
        <Center>
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
                    <Pressable onPress={props.onPress}>
                        <HStack space='5' style={styles.group}>
                            <Avatar style={styles.icon} source={require("../../assets/images/generic-user-icon.jpg")}>
                                <Avatar.Badge bg={online ? "green.500" : "red.500"}/>
                            </Avatar>
                            <Text suppressHighlighting={true} style={styles.text}>
                                {props.entity.name}
                            </Text>
                            <Text style={styles.text}>
                                {props.entity.lifespan}
                            </Text>
                        </HStack>
                    </Pressable>
                </Box>
        </Center>
    )
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

