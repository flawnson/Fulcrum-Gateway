import React from 'react';
import {StyleSheet,
        View,
        Text} from 'react-native'
import {useNavigation} from "@react-navigation/native";
import {HomeScreenProps} from "../../types";
import {Center} from "native-base";


export default function() {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    return (
        <View>
            <Center style={styles.container}>
                <Text style={styles.header}>
                    Come again soon!
                </Text>
                <Text style={styles.subText}>
                    Requeue or create your own queue at
                    <Text style={styles.linkText} onPress={() => navigation.navigate('LandingPage')}> fiefoe.com</Text>
                </Text>
            </Center>
        </View>
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
    header: {
        margin: 10,
        fontSize: 40,
        fontFamily: 'Poppins-Light.otf',
        textAlign: "center",
    },
    subText: {
        margin: 10,
        textAlign: "center",
    },
    linkText: {
        textAlign: "center",
        fontFamily: 'Poppins-ExtraBold.otf',
        fontWeight: 'bold',
    }

})
