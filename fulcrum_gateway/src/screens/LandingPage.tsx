import React from 'react'
import {
    Button, HStack,
    View, VStack,
    Center, Image,
    Text
} from 'native-base'
import {StyleSheet} from "react-native";


export default function () {
    return (
        <View>
            <VStack>
                <Text style={styles.logo}>
                    Fiefoe
                </Text>
                <Center>
                    <Image source={require("../assets/images/queueup.gif")}
                           alt={"Cute queueing gif"}
                           style={styles.animation}/>
                </Center>
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



