import React from 'react';
import {StyleSheet,
        View,
        Text} from 'react-native'


type ending_props = {
    summoningTime: number
}


export default function(props: ending_props) {
    return (
        <View>
            <Text style={styles.header}>
                You're up!
            </Text>
            <Text style={styles.subHeader}>
                Reach the venue by
            </Text>
            <Text style={styles.header}>
                {props.summoningTime}
            </Text>
            <Text style={styles.subHeader}>
                To keep your position in line
            </Text>
        </View>
    )
}


const styles = StyleSheet.create({
    header: {
        position: "absolute",
        textAlign: "center",
        fontSize: 40,
        fontWeight: "bold"
    },
    subHeader: {
        position: "absolute",
        textAlign: "center",
        fontSize: 12,
    }
})
