import React from 'react';
import { VStack, Box, Divider, Text } from 'native-base';
import { StyleSheet } from "react-native";
import { DashboardStat } from "../../../types";

type Props = {
    stat: DashboardStat
}


export default function (props: Props) {
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
                    {props.stat.prefix}
                    <Text style={styles.statText}> {props.stat.stat} </Text>
                    {props.stat.suffix}
                </Text>
            </Box>
        </Box>
    );
}


const styles = StyleSheet.create({
    card: {
    },
    text: {
        fontSize: 14,
        textAlign: 'center',
        alignItems: 'center'
    },
    statText: {
        fontSize: 42,
    }
})
