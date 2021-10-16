import React from 'react'
import {useNavigation} from "@react-navigation/native";
import {HomeScreenProps} from "../../types";
import {StyleSheet} from 'react-native'
import {View, VStack, SimpleGrid} from "native-base";
import QueuerDashboardGroup from "../components/organisms/QueuerDashboardStats";


export default function () {
    const navigation = useNavigation<HomeScreenProps>()
    const tempProps = {
        index: 3,
        eta: 15,
        waited: 5,
        avg: 10,
    }

    return (
        <QueuerDashboardGroup queuerDashboardProps={tempProps}/>
    )
}
