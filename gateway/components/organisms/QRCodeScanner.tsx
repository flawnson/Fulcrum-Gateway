import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native'
import { Text, Button } from 'native-base'
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useTranslation } from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import {HomeScreenProps} from "../../types";

export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState<boolean>(false);
    const { t, i18n } = useTranslation(["QRCodeScanner"]);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }: {type: string, data: string}) => {
        setScanned(true);
        console.log(type)
        console.log(data)
        navigation.navigate("HomePage")
    };

    if (hasPermission === null) {
        return <Text>{t("requesting")}</Text>;
    }
    if (!hasPermission) {
        return <Text>{t("no_access")}</Text>;
    }
    return (
        <>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={styles.barcodeScanner}
            />
            {/*{scanned &&*/}
            {/*    <Button*/}
            {/*        onPress={() => setScanned(false)}*/}
            {/*        style={styles.scanAgainButton}*/}
            {/*    >*/}
            {/*        <Text>*/}
            {/*            {t("scan_again")}*/}
            {/*        </Text>*/}
            {/*    </Button>*/}
            {/*}*/}
        </>
    )
}

const styles = StyleSheet.create({
    barcodeScanner: {
        ...StyleSheet.absoluteFillObject,
    },
    scanAgainButton: {

    }
});


