import React, {useEffect} from 'react';
import {StyleSheet, TouchableHighlight} from 'react-native'
import {Pressable, Icon, IconButton, View} from 'native-base'
import EnqueueGroup from "../components/molecules/EnqueueFormGroup";
import QRCodeScanner from "../components/organisms/QRCodeScanner";
import {PreferencesContext} from "../utilities/PreferencesContext";
import {useNavigation} from "@react-navigation/native";
import {HomeScreenProps} from "../types";
import {MaterialCommunityIcons} from '@expo/vector-icons';
import RightHeaderGroup from "../components/molecules/RightHeaderGroup";
import {scale} from "../utilities/scales";


export default function () {
    const { isThemeDark } = React.useContext(PreferencesContext);
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    useEffect(() => navigation.setOptions({headerRight: RightHeaderGroup()}), [])

    return (
        <View style={styles.container}>
            <IconButton
                icon={
                    <Icon
                    style={styles.qrIcon}
                    as={MaterialCommunityIcons}
                    size={scale(36)}
                    name={"qrcode-scan"}
                    color={isThemeDark ? 'white': 'black'}
                    />
                }
                onPress={() => navigation.navigate("QRCodeScanner")}
                style={styles.qrButton}
            />
            <EnqueueGroup/>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        margin: "3%"
    },
    qrButton: {
        // flex: 1,
        alignSelf: "flex-end",
    },
    qrIcon: {
        position: 'relative',
        top: 0,
        left: 0
    },
});


