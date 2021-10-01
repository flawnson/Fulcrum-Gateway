import React from 'react';
import {StyleSheet,
        Text,
        View,
        Image,
        TouchableWithoutFeedback} from 'react-native'
import { Center } from 'native-base'
import { Link } from 'react-router-native'
import IDValidator from '../molecules/IDValidator'


export default function () {
    return (
        <Center flex={1}>
            <View>
                <IDValidator/>
                <Text style={styles.subText}>
                    Create your own virtual queue at <Text style={styles.linkText}>fiefoe.com</Text>
                </Text>
                <Link to={'/'}>
                    {/*<TouchableWithoutFeedback onPress={() => { moveToAddNewCustomer()} }}>*/}
                    <Image style={styles.qrCode} source={require("../../assets/images/qr-icon.png")}/>
                </Link>
            </View>
        </Center>
    )
}


const styles = StyleSheet.create({
    qrCode: {
        position: "absolute",
        height: 50,
        width: 50,
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


