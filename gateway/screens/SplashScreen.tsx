import React from 'react'
import { View, Spinner } from 'native-base'
import {StyleSheet} from "react-native";
import {scale} from "../utilities/scales";
import LogoAndName from "../components/atoms/LogoAndName";


export default function () {

    return (
        <View style={{...styles.container, backgroundColor: "primary.600"}}>
            <Spinner color="white" style={styles.spinner}/>
            <LogoAndName light={true} styles={styles.logo} />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    spinner: {
        flex: 1,
        width: scale(100),
        height: scale(100),
    },
    logo: {
        flex: 1,
        width: scale(300),
        height: scale(300),
    }
})
