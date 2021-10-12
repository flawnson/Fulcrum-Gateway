import React from 'react';
import { VStack, Box, Divider } from 'native-base';
import {StyleSheet} from "react-native";

type queuerStatsProps = {
    stat: number,
}

export default function (props: queuerStatsProps) {
    return (
        <Box border={1} borderRadius='md'>
            <VStack space={4} divider={<Divider />}>
                <Box px={4} pt={4}>
                    NativeBase
                </Box>
                <Box px={4}>
                    {props}
                </Box>
                <Box px={4} pb={4}>
                    GeekyAnts
                </Box>
            </VStack>
        </Box>
    );
}


const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: 200,
        marginLeft: -100,
    },
})
