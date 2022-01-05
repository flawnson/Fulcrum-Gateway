import React from 'react'
import { View, Text } from 'native-base'
import { useTranslation } from "react-i18next"


export default function () {
    const { t, i18n } = useTranslation(["errorScreen"]);
    return (
        <View>
            <Text>{t("message")}</Text>
        </View>
    )
}
