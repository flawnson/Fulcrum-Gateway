import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet,
        Pressable, Animated,
        PanResponder, Dimensions,
        GestureResponderEvent } from "react-native";
import { HStack, Text,
        Box, View,
        Center, Avatar } from 'native-base';
import { AbandonedStats } from "../../types";

type ServicedCatalogProps = {
    'entity': AbandonedStats
}

export default function (props: ServicedCatalogProps) {
    const [online, setOnline] = useState<boolean>(true)
    console.log(props.entity)

    return (
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
            <HStack space='5' style={styles.group}>
                {/*<Avatar style={styles.avatar} source={{uri: `https://avatars.dicebear.com/api/micah/${props.entity.userId}.svg?mood[]=happy`}}>*/}
                {/*    <Avatar.Badge bg={online ? "green.500" : "red.500"}/>*/}
                {/*</Avatar>*/}
                <Text suppressHighlighting={true} style={styles.text}>
                    {props.entity.name}
                </Text>
                <Text style={styles.text}>
                    {props.entity.waited}
                </Text>
            </HStack>
        </Box>
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
        flex: 1
    },
})

