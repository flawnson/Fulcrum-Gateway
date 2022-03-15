import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native'
import {Text, Button, View, useToast} from 'native-base'
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera'
import { useTranslation } from "react-i18next";
import CreateUserModal from "../../containers/CreateUserModal";
import {useNavigation} from "@react-navigation/native";
import {HomeScreenProps} from "../../types";

export default function () {
    const { t } = useTranslation(["QRCodeScanner"]);
    const navigation = useNavigation<HomeScreenProps["navigation"]>()  // Can call directly in child components instead
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [joinCode, setJoinCode] = useState<string>("NONE");
    const [showModal, setShowModal] = useState<boolean>(false);
    const toast = useToast()
    const re = new RegExp("((([A-Za-z]{3,9}:(?:\\/\\/)?)(?:[-;:&=\\+\\$,\\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\\+\\$,\\w]+@)[A-Za-z0-9.-]+)((?:\\/[\\+~%\\/.\\w-_]*)?\\??(?:[-\\+=&;%@.\\w_]*)#?(?:[\\w]*))?)")


    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }: {type: string, data: string}) => {
        if (re.test(data)) {
            setShowModal(true)
            const extractedJoinCode = /[^/]*$/.exec(data)![0]  // Regex to extract the string after the last forward slash
            setJoinCode(extractedJoinCode)
        } else {
            toast.show({
                title: t('something_went_wrong', {ns: "common"}),
                status: "error",
                description: t("not_a_queue")
            })
        }
    };

    if (hasPermission === null) {
        return <Text>{t("requesting")}</Text>;
    }
    if (!hasPermission) {
        return <Text>{t("no_access")}</Text>;
    }
    return (
        <>
            <View style={styles.container}>
                <Camera
                    style={StyleSheet.absoluteFillObject}
                    onBarCodeScanned={handleBarCodeScanned}
                    barCodeScannerSettings={{
                        barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
                    }}
                />
            </View>
            {/*{scanned &&*/}
            {/*    <Button*/}
            {/*        onPress={() => setScanned(false)}*/}
            {/*        style={styles.scanAgainButton}*/}
            {/*    >*/}
            {/*        <Text color="white">*/}
            {/*            {t("scan_again")}*/}
            {/*        </Text>*/}
            {/*    </Button>*/}
            {/*}*/}
            <CreateUserModal
                joinCode={joinCode}
                navigation={navigation}
                showModal={showModal}
                setShowModal={setShowModal}
            />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    barcodeScanner: {
        ...StyleSheet.absoluteFillObject,
    },
    scanAgainButton: {
    },
});


