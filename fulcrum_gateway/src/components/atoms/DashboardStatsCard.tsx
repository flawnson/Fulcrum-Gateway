import React from 'react';
import { VStack, Box, Divider, Text } from 'native-base';
import {StyleSheet} from "react-native";

type queuerStat = {
    'user': object,
}

export default function (props: queuerStat) {
    return (
        <Box borderRadius='md'>
            <VStack space={4} divider={<Divider />}>
                <Box px={4} pt={4}>
                    <Text>
                        {props.user}
                    </Text>
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
