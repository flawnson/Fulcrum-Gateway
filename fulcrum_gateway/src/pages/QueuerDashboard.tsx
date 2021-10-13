import React from 'react'
import {useNavigation} from "@react-navigation/native";
import {HomeScreenProps} from "../../types";
import {StyleSheet, View} from 'react-native'
import QueuerDashboardGroup from "../components/organisms/QueuerDashboardStats";


export default function () {
    const navigation = useNavigation<HomeScreenProps>()

    return (
        <View>
            <QueuerDashboardGroup/>
        </View>
    )
}
