import React from 'react';
import { VStack, Box, Divider, Text } from 'native-base';
import {StyleSheet} from "react-native";

type userStat = {
    stat: number,
}

export default function (props: userStat) {
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
            <Box px='8' pt='8'>
                <Text style={styles.text}>
                    {props.stat}
                </Text>
            </Box>
        </Box>
    );
}


const styles = StyleSheet.create({
    card: {
    },
    text: {
        textAlign: 'center',
        alignItems: 'center'
    }
})
