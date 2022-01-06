import React from 'react'
import { View, Text } from 'native-base'
import { useTranslation } from "react-i18next"


export default function () {
    const { t, i18n } = useTranslation(["errorScreen"]);
    console.log("Something went wrong!")

    return (
        <View>
            <Text>{t("message")}</Text>
        </View>
    )
}
