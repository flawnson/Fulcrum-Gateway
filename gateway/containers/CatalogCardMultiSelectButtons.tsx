import React from 'react'
import { HStack, Button,
        Text } from "native-base";
import {StyleSheet} from "react-native";
import {useTranslation} from "react-i18next";
import {UserStatus} from "../types";

type MultiSelectButtonType = {
    onActionPress: (actionStatus: UserStatus | "SUMMONED") => void
}

export default function (props: MultiSelectButtonType) {
    const { t, i18n } = useTranslation(["enqueuedMultiSelectButtons"]);

    return (
        <Button.Group
            mx={{
                base: "auto",
                md: 0,
            }}
        >
            <Button style={styles.button} onPress={() => props.onActionPress("KICKED")}>
                <Text bold color={'white'}>{t("kick")}</Text>
            </Button>
            <Button style={styles.button} onPress={() => props.onActionPress("SUMMONED")}>
                <Text bold color={'white'}>{t("summon")}</Text>
            </Button>
            <Button style={styles.button} onPress={() => props.onActionPress("SERVICED")}>
                <Text bold color={'white'}>{t("service")}</Text>
            </Button>
        </Button.Group>
    )
}


const styles = StyleSheet.create({
    button: {
        marginHorizontal: 10,
    },
})

