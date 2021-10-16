import React from 'react';
import {StyleSheet,
        View,
        Text} from 'react-native'


export default function() {
    return (
        <View>
            <Text style={styles.header}>
                Come again soon!
            </Text>
            <Text style={styles.subText}>
                Requeue or create your own queue at <Text style={styles.linkText}>fiefoe.com</Text>
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
    subText: {
        position: "absolute",
        top: 300,
        textAlign: "center"
    },
    linkText: {
        fontWeight: 'bold'
    }

})
