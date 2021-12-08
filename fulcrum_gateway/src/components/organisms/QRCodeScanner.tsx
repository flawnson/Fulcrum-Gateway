import React, { useState, useEffect } from 'react';
import {StyleSheet, Image,
        TouchableHighlight} from 'react-native'
import {Text, View,
    Button, Alert,
    VStack, HStack,
    IconButton, CloseIcon,
    Box} from 'native-base'
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function () {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }: {type: string, data: string}) => {
        setScanned(true);
        return (
            <Alert w="100%" status="info" colorScheme="info">
                <VStack space={2} flexShrink={1} w="100%">
                    <HStack
                        flexShrink={1}
                        space={2}
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <HStack flexShrink={1} space={2} alignItems="center">
                            <Alert.Icon />
                            <Text fontSize="md" fontWeight="medium" color="coolGray.800">
                                We are going live in July!
                            </Text>
                        </HStack>
                        <IconButton
                            variant="unstyled"
                            icon={<CloseIcon size="3" color="coolGray.600" />}
                        />
                    </HStack>
                    <Box
                        pl="6"
                        _text={{
                            color: "coolGray.600",
                        }}
                    >
                        {`Bar code with type ${type} and data ${data} has been scanned!`}
                    </Box>
                </VStack>
            </Alert>
        )
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (!hasPermission) {
        return <Text>No access to camera</Text>;
    }
    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            {scanned && <Button onPress={() => setScanned(false)}>Tap to Scan Again</Button>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {

    }
});


