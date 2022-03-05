import React, {useContext} from 'react'
import {DashboardContext} from "../../utilities/DashboardContext";
import EnqueuedCatalog from "../molecules/EnqueuedCatalog";
import ServicedCatalog from "../molecules/ServicedCatalog";
import AbandonedCatalog from "../molecules/AbandonedCatalog";
import {Text, View} from "native-base";
import {StyleSheet} from "react-native";
import {useTranslation} from "react-i18next";


export default function (props: {isFocused: boolean}) {
    const { t } = useTranslation("userCatalogGroup")
    const {dashboardContext} = useContext(DashboardContext)


    return (
        <View style={styles.container}>
            <Text style={styles.queuesHeading}>
                {dashboardContext === "ENQUEUED" ? t("enqueued") :
                dashboardContext === "SERVICED" ? t("serviced") : t("abandoned")}
            </Text>
                {dashboardContext === "ENQUEUED" ? <EnqueuedCatalog isFocused={props.isFocused}/> :
                dashboardContext === "SERVICED" ? <ServicedCatalog isFocused={props.isFocused}/> : <AbandonedCatalog isFocused={props.isFocused}/>}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start"
    },
    queuesHeading: {
        flex: 1,
        fontSize: 24
    }
})
