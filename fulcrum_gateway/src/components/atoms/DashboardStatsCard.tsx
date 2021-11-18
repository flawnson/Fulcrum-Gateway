import React from 'react';
import { VStack, Box, Divider, Text } from 'native-base';
import {StyleSheet} from "react-native";

type queuerStat = {
    stat: number,
}

export default function (props: queuerStat) {
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
            <VStack space='2' divider={<Divider />}>
                <Box px='4' pt='4'>
                    <Text>
                        {props.stat}
                    </Text>
                </Box>
            </VStack>
        </Box>
    );
}


const styles = StyleSheet.create({
    card: {
    },
})
