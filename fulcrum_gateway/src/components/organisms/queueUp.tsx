import React from 'react';
import {StyleSheet,
        Text,
        View,
        Image,
        TouchableWithoutFeedback} from 'react-native'
import { Link } from 'react-router-native'
import IDValidator from "../molecules/IDValidator"


export default function () {
    return (
        <View style={styles.view}>
            <Link to={'/'}>
                {/*<TouchableWithoutFeedback onPress={() => { moveToAddNewCustomer()} }}>*/}
                <Image style={styles.qrCode} source={require("../../assets/images/qr-icon.png")}/>
            </Link>
            <IDValidator/>
            <Text style={styles.subText}>
                Create your own virtual queue at <Text style={styles.linkText}>fiefoe.com</Text>
            </Text>
        </View>
    )
}


const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: "black"
    },
    qrCode: {
        position: "absolute",
        top: 8,
        right: 16,
    },
    subText: {
        position: "absolute",
        top: 300,
        textAlign: "center"
    },
    linkText: {
        fontWeight: 'bold'
    }
});


