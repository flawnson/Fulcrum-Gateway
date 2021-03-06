import React, {useContext} from 'react';
import {HStack, Box, Tooltip, Divider, Text, Pressable} from 'native-base';
import { StyleSheet } from "react-native";
import { DashboardStat } from "../../types";
import { scale} from "../../utilities/scales";
import {DashboardContext} from "../../utilities/DashboardContext";

type Props = {
    stat: DashboardStat
}


export default function (props: Props) {
    const {dashboardContext, setDashboardContext} = useContext(DashboardContext)

    const onCardPress = () => {
        const prefix = props.stat.prefix.toUpperCase()
        // Check if card has a catalog list (else don't do anything)
        if (["ENQUEUED", "SERVICED", "ABANDONED"].indexOf(prefix) > -1) {
            setDashboardContext(prefix)
        }
    }


    return (
        <Tooltip
            isDisabled={!props.stat.tooltip}
            label={!!props.stat.tooltip ? props.stat.tooltip : "NONE"}
            openDelay={1000}
        >
            <Pressable
                onPress={() => onCardPress()}
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
                        backgroundColor: dashboardContext === props.stat.prefix.toUpperCase() ? "primary.50" : "gray.50",
                    }}
                    style={styles.card}
                >
                    <HStack style={styles.container}>
                        <Text variant="darkModeButton" style={styles.statPrefix}>
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
            </Pressable>
        </Tooltip>
    );
}


const styles = StyleSheet.create({
    card: {
        cursor: 'pointer',
        width: scale(120),
        height: scale(50)
    },
    container: {
        margin: scale(10),
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'baseline',
        flexDirection: 'row'
    },
    statPrefix: {
        flex: 1,
        fontSize: scale(10),
        alignSelf: 'center'
    },
    statText: {
        fontSize: scale(20),

    },
    statSuffix: {
        fontSize: scale(10),
    },
})
