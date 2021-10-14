import React from 'react';
import {StyleSheet,
        Text} from 'react-native'
import { Center, View } from 'native-base'
import { Link } from 'react-router-native'
import IDValidator from '../atoms/EnqueueForm'
import {useNavigation, useRoute} from "@react-navigation/native";
import {HomeScreenProps} from "../../../types";


export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const route = useRoute<HomeScreenProps["route"]>();  // Don't need this but if I want to pass config or params...

    return (
        <Center style={styles.container} flex={1}>
            <IDValidator route={route} navigation={navigation} />
            <Text style={styles.subText}>
                Create your own virtual queue at <Text style={styles.linkText}>fiefoe.com</Text>
            </Text>
        </Center>
    )
}


const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: 200,
        marginLeft: -100,
    },
    subText: {
        position: "absolute",
        top: 300,
        textAlign: "center",
        marginTop: 50,
    },
    linkText: {
        fontWeight: 'bold'
    }
});


