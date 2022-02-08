import React, {useEffect} from 'react';
import {StyleSheet, TouchableHighlight} from 'react-native'
import {Pressable, Icon, Text, View} from 'native-base'
import EnqueueGroup from "../components/molecules/EnqueueFormGroup";
import QRCodeScanner from "../components/organisms/QRCodeScanner";
import {PreferencesContext} from "../utilities/useTheme";
import {useNavigation} from "@react-navigation/native";
import {HomeScreenProps} from "../types";
import {MaterialCommunityIcons} from '@expo/vector-icons';
import RightHeaderGroup from "../components/molecules/RightHeaderGroup";
import {scale} from "../utilities/scales";


export default function () {
    const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    useEffect(() => navigation.setOptions({headerRight: RightHeaderGroup()}), [])

    return (
        <View style={styles.container}>
            <Pressable
                style={styles.qrButton}
                onPress={() => navigation.navigate("QRCodeScanner")}
            >
                <Icon
                    as={MaterialCommunityIcons}
                    size={scale(6)}
                    name={"qrcode-scan"}
                    color={isThemeDark ? 'white': 'black'}
                />
            </Pressable>
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
        flex: 1,
        alignSelf: "flex-end"
    },
});


