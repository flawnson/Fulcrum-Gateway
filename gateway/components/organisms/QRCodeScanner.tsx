import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native'
import { Text, Button } from 'native-base'
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useTranslation } from "react-i18next";
import CreateUserModal from "../../containers/CreateUserModal";
import {useNavigation} from "@react-navigation/native";
import {HomeScreenProps} from "../../types";

export default function () {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [joinCode, setJoinCode] = useState<string>("NONE");
    const [scanned, setScanned] = useState<boolean>(false);
    const { t } = useTranslation(["QRCodeScanner"]);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }: {type: string, data: string}) => {
        setScanned(true);
        console.log(data)
        const extractedJoinCode = /[^/]*$/.exec(data)![0]  // Regex to extract the string after the last forward slash
        setJoinCode(extractedJoinCode)
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
            <CreateUserModal
                joinCode={joinCode}
                navigation={navigation}
                showModal={scanned}
                setShowModal={setScanned}
            />
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


