import React from 'react'
import { Center, Text } from 'native-base'
import { useTranslation } from "react-i18next"


export default function () {
    const { t, i18n } = useTranslation(["errorScreen"]);
    console.log("Something went wrong!")

    return (
        <Center>
            <Text>{t("message")}</Text>
        </Center>
    )
}
