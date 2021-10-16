import React from 'react'
import CreateQueueForm from '../components/organisms/CreateQueueForm'
import {useNavigation, useRoute} from "@react-navigation/native";
import {HomeScreenProps} from "../../types";


export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const route = useRoute<HomeScreenProps["route"]>();  // Don't need this but if I want to pass config or params...

    return (
        <CreateQueueForm route={route} navigation={navigation}/>
    )
}
