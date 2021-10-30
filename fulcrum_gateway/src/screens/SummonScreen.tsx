import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native'
import {Text, View, Center, VStack} from "native-base";


type SummonData = {
    name?: string,
    address?: string,
    time?: string,
}


export default function() {
    const [props, setProps] = useState<SummonData>({})

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:8080/queuer/summon')
            setProps(await response.json())
        } catch (error) {
            return error
        }
    }

    fetchData()

    return (
        <View>
            <Center>
                <VStack>
                    <Text style={styles.header}>
                        You're up!
                    </Text>
                    <Text style={styles.subHeader}>
                        Reach {props.address} by
                    </Text>
                    <Text style={styles.header}>
                        {props.time}
                    </Text>
                    <Text style={styles.subHeader}>
                        To keep your position in line
                    </Text>
                </VStack>
            </Center>
        </View>
    )
}


const styles = StyleSheet.create({
    header: {
        textAlign: "center",
        fontSize: 40,
        fontWeight: "bold"
    },
    subHeader: {
        textAlign: "center",
        fontSize: 12,
    }
})
