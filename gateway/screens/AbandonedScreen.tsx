import React, {useEffect} from 'react';
import {StyleSheet, Text} from 'react-native'
import {StackActions, useNavigation} from "@react-navigation/native";
import {HomeScreenProps} from "../types";
import {View, Heading} from "native-base";
import {useTranslation} from "react-i18next";
import RightHeaderGroup from "../components/molecules/RightHeaderGroup";


export default function() {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const { t } = useTranslation("abandonedScreen");
    useEffect(() => navigation.setOptions({headerRight: RightHeaderGroup()}), [])

    return (
        <View style={styles.container}>
            <Heading
                size="lg"
                fontWeight="600"
                style={styles.header}
            >
                {t('message')}
            </Heading>
            <Heading
                mt="1"
                _dark={{
                    color: "warmGray.200",
                }}
                color="coolGray.600"
                fontWeight="medium"
                size="xs"
                style={styles.subText}
            >
                {t('footer')}
                <Text style={styles.linkText} onPress={() => StackActions.popToTop() && navigation.navigate('HomePage')}> fiefoe.com</Text>
            </Heading>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    header: {
        margin: 10,
        fontSize: 36,
    },
    subText: {
        margin: 10,
    },
    linkText: {
        fontWeight: "bold",
    }

})
