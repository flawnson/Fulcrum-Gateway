import React from 'react'
import {View, HStack} from 'native-base'
import DarkModeToggle from "../atoms/DarkModeToggle";
import LanguagePicker from "../atoms/LanguagePicker";
import {StyleSheet} from "react-native";


export default function () {
    return (() =>  // navigation.setOptions for right header expects a method that returns a React node
        <HStack space={3} style={styles.container}>
            <LanguagePicker />
            <DarkModeToggle />
        </HStack>
    )
}


const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignContent: "center",
        right: "3%"
    },
});

