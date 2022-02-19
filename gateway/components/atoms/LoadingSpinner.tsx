import React from "react"
import { Spinner, HStack,
        Heading, Center} from "native-base"
import {useTranslation} from "react-i18next";


type loadingSpinnerProps = {
    show: boolean
    light: boolean
}


export default function (props: loadingSpinnerProps) {
    const { t } = useTranslation(["loadingSpinner"]);

    return (
        <>
            {props.show &&
                <Center>
                    <HStack space={2} alignItems="center">
                        <Spinner
                            color={props.light ? "white" : "primary.400"}
                            accessibilityLabel={t("accessibility_label")}
                        />
                        <Heading
                            color={props.light ? "white" : "primary.400"}
                            fontSize="md"
                        >
                            {t("loading", {ns: "common"})}
                        </Heading>
                    </HStack>
                </Center>
            }
        </>
    )
}
