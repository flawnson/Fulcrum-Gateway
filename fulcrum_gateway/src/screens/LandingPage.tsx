import React from 'react'
import {
    Button, HStack,
    View, VStack,
    Center, Image,
    Text
} from 'native-base'
import {StyleSheet} from "react-native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import FeaturesScreen from '../screens/FeaturesScreen'
import ContactScreen from '../screens/ContactScreen'
import { useTranslation } from 'react-i18next';
import {useNavigation} from "@react-navigation/native";
import {HomeScreenProps} from "../../types";


export default function () {
    const Drawer = createDrawerNavigator();
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const { t, i18n } = useTranslation("landingPage");

    return (
        <View>
            <Drawer.Navigator>
                <Drawer.Screen name="Features" component={FeaturesScreen} />
                <Drawer.Screen name="Contact" component={ContactScreen} />
            </Drawer.Navigator>
            <VStack>
                <Text style={styles.logo}>
                    Fiefoe
                </Text>
                <Center>
                    <Image source={require("../assets/images/queueup.gif")}
                           alt={"Cute queueing gif"}
                           style={styles.animation}/>
                </Center>
                <Text style={styles.header}>
                    {t('title')}
                </Text>
                <Text style={styles.subHeader}>
                    {t('description')}
                </Text>
                <Center>
                    <HStack>
                        <Button onPress={() => navigation.navigate("Home")} style={styles.smallButton}>
                            {t('join')}
                        </Button>
                        <Button onPress={() => navigation.navigate("CreateQueuePage")} style={styles.smallButton}>
                            {t('create')}
                        </Button>
                    </HStack>
                </Center>
                <Center>
                    <Button onPress={() => navigation.navigate("Home")} style={styles.longButton}>
                        {t('signup')}
                    </Button>
                </Center>
            </VStack>
        </View>
    )
}


const styles = StyleSheet.create({
    logo: {
        fontSize: 100,
        textAlign: 'center',
        fontFamily: 'Poppins-Bold.otf'
    },
    header: {
        fontSize: 50,
        textAlign: 'center',
        fontFamily: 'Poppins-ExtraBold.otf'
    },
    subHeader: {
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'Poppins-Regular.otf'
    },
    animation: {
        marginTop: 25,
        marginBottom: 25,
        width: 309,
        height: 93,
    },
    smallButton: {
        margin: 10,
        width: 350,
    },
    longButton: {
        margin: 10,
        width: 720,
    }
})



