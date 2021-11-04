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


export default function () {
    const Drawer = createDrawerNavigator();
    const { t, i18n } = useTranslation();

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
                    {t("Virtual lines that save time.")}
                </Text>
                <Text style={styles.subHeader}>
                    {t("Fiefoe helps you find create and monitor virtual queues and generate more sales by increasing throughput and customer satisfaction.")}
                </Text>
                <Center>
                    <HStack>
                        <Button style={styles.smallButton}>
                            Join a queue
                        </Button>
                        <Button style={styles.smallButton}>
                            Create a queue
                        </Button>
                    </HStack>
                </Center>
                <Center>
                    <Button style={styles.longButton}>
                        Sign up
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



