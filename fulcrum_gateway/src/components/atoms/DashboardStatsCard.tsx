import React from 'react';
import { HStack, Box, Divider, Text } from 'native-base';
import { StyleSheet } from "react-native";
import { DashboardStat } from "../../../types";

type Props = {
    stat: DashboardStat
}


export default function (props: Props) {
    return (
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
            <HStack style={styles.container} space='3'>
                <Text style={styles.statPrefix}>
                    {props.stat.prefix.split(" ").join("\n")}
                </Text>
                <Text style={styles.statText}>
                    {props.stat.stat}
                </Text>
                <Text style={styles.statSuffix}>
                    {props.stat.suffix}
                </Text>
            </HStack>
        </Box>
    );
}


const styles = StyleSheet.create({
    card: {
        width: 200,
        height: 100
    },
    container: {
        margin: 20,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'baseline',
        flexDirection: 'row'
    },
    statPrefix: {
        flex: 1,
        fontSize: 14,
        alignSelf: 'center'
    },
    statText: {
        fontSize: 42,

    },
    statSuffix: {
        fontSize: 14,
    },
})
