import React from 'react';
import {StyleSheet,
        Text,
        View,
        Image,
        TouchableWithoutFeedback} from 'react-native'
import { Center } from 'native-base'
import { Link } from 'react-router-native'
import IDValidator from '../molecules/IDValidator'
import {useNavigation, useRoute} from "@react-navigation/native";
import {HomeNavigationProps, HomeScreenRouteProps} from "../../../types";


export default function () {
    const navigation = useNavigation<HomeNavigationProps>()
    const route = useRoute<HomeScreenRouteProps>();
    return (
        <View style={styles.container}>
            <Center flex={1}>
                <View>
                <IDValidator route={route} navigation={navigation} />
                    <Text style={styles.subText}>
                        Create your own virtual queue at <Text style={styles.linkText}>fiefoe.com</Text>
                    </Text>
                    <Link to={'/'}>
                        {/*<TouchableWithoutFeedback onPress={() => { moveToAddNewCustomer()} }}>*/}
                        <Image style={styles.qrCode} source={require("../../assets/images/qr-icon.png")}/>
                    </Link>
                </View>
            </Center>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: -50,
        marginLeft: -100,
    },
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


