import React, {useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native'
import {useNavigation} from "@react-navigation/native";
import {HomeScreenProps} from "../types";
import {Center, Heading} from "native-base";
import {useTranslation} from "react-i18next";
import RightHeaderGroup from "../components/molecules/RightHeaderGroup";


export default function() {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const { t } = useTranslation("endScreen");
    useEffect(() => navigation.setOptions({headerRight: RightHeaderGroup()}), [])

    return (
        <Center style={styles.container}>
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
                <Text style={styles.linkText} onPress={() => navigation.navigate("HomePage")}> fiefoe.com</Text>
            </Heading>
        </Center>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        margin: 10,
        fontSize: 36,
    },
    subText: {
        margin: 10,
    },
    linkText: {
        textAlign: "center",
        fontWeight: 'bold',
    }

})
