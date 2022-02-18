import React from 'react'
import { View, Text } from 'native-base'
import {StyleSheet} from "react-native";
import {scale} from "../utilities/scales";
import LogoAndName from "../components/atoms/LogoAndName";
import {useTheme} from "native-base";
import LoadingSpinner from "../components/atoms/LoadingSpinner";


export default function () {
    const theme = useTheme()
    return (
        <View style={{...styles.container, backgroundColor: theme.colors.primary[600]}}>
            <LogoAndName light={true} styles={styles.logo} />
            <LoadingSpinner show={true} light={true}/>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        flex: 1,
        fontSize: scale(300)
    }
})
