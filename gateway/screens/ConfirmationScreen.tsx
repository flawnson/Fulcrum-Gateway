import React from 'react'
import { View, Text, Button } from 'native-base'
import { useNavigation } from "@react-navigation/native";
import { HomeScreenProps } from "../types";

export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    return (
        <View>
            <Text>Your account has been confirmed!</Text>
            <Button onPress={() => navigation.navigate('HomePage')}>Go back to our home screen to log in</Button>
        </View>
    )
}
