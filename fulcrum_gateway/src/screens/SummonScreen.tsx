import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native'
import {Text, View, Center, VStack} from "native-base";
import {useNavigation} from "@react-navigation/native";
import {HomeScreenProps} from "../../types";
import {useTranslation} from "react-i18next";


type SummonData = {
    name?: string,
    address?: string,
    time?: string,
}


export default function() {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const [props, setProps] = useState<SummonData>({})
    const [errors, setError] = useState<any>([]);
    const { t, i18n } = useTranslation("summonScreen");

    useEffect(() => {fetchData()}, [])

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:8080/queuer/summon')
            setProps(await response.json())
        } catch (error) {
            setError([...errors, error])
        }
    }

    return (
        <View>
            <Center>
                <VStack>
                    <Text style={styles.header}>
                        {t('message')}
                    </Text>
                    <Text style={styles.subHeader}>
                        {t('reach_by', {props: props.address})}
                    </Text>
                    <Text style={styles.header}>
                        {props.time}
                    </Text>
                    <Text style={styles.subHeader}>
                        {t('reach_by_cont')}
                    </Text>
                    <Text style={styles.subText}>
                        {t('footer')}
                        <Text style={styles.linkText} onPress={() => navigation.navigate('LandingPage')}> fiefoe.com</Text>
                    </Text>
                </VStack>
            </Center>
        </View>
    )
}


const styles = StyleSheet.create({
    header: {
        textAlign: "center",
        fontSize: 40,
        fontWeight: "bold"
    },
    subHeader: {
        textAlign: "center",
        fontSize: 12,
    },
    subText: {
        textAlign: "center",
        margin: 10,
    },
    linkText: {
        textAlign: "center",
        fontFamily: 'Poppins-ExtraBold.otf',
        fontWeight: 'bold',
    }
})
