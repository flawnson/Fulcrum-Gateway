import React from 'react'
import { HStack, Button,
        Text } from "native-base";
import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { QueueState } from "../../types";

type MultiSelectButtonType = {
    onActionPress: React.Dispatch<React.SetStateAction<QueueState>>
}

export default function (props: MultiSelectButtonType) {
    const { t } = useTranslation(["queueMultiSelectButtons"]);
    return (
        <Button.Group
            mx={{
                base: "auto",
                md: 0,
            }}
        >
            <Button style={styles.button} onPress={() => props.onActionPress("PAUSED")}>
                <Text bold color={'white'}>{t("pause")}</Text>
            </Button>
            <Button style={styles.button} onPress={() => props.onActionPress("DELETED")}>
                <Text bold color={'white'}>{t("end")}</Text>
            </Button>
        </Button.Group>
    )
}


const styles = StyleSheet.create({
    button: {
        marginHorizontal: 5,
    },
})
