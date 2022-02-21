import React, { useEffect, useState } from 'react'
import { Button, Tooltip,
        FormControl, Input,
        Slider, Stack,
        Text, VStack,
        HStack, Select,
        Box } from 'native-base'
import { AntDesign } from '@expo/vector-icons';
import { PreferencesContext } from "../../utilities/PreferencesContext";
import { useTranslation } from "react-i18next";
import { RootStackParamList } from "../../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import baseURL from "../../utilities/baseURL";
import corsURL from "../../utilities/corsURL";

type DefaultCreateQueueFormData = {
    name: string,
    capacity: number,
    gracePeriod: number,
    maxPartySize: number,
    offlineTime: number,
    address: string,
    password: string,
}

type DefaultErrors = {
    nameError?: string
    nameInvalid: boolean,
}

type CreateQueueFormType = {
    navigation: NativeStackScreenProps<RootStackParamList, 'HomePage'>['navigation']
    setShowModal: Function
}

export default function ({ navigation, setShowModal }: CreateQueueFormType) {
    const { isThemeDark } = React.useContext(PreferencesContext)
    const [submitted, setSubmitted] = useState(false)
    const defaultData = {name: "Sample Queue name",
                         capacity: 10,
                         gracePeriod: 0,
                         maxPartySize: 1,
                         offlineTime: 3,
                         address: "Sample address",
                         password: "123456789"}
    const defaultErrors = {nameInvalid: false}
    const [formData, setData] = useState<DefaultCreateQueueFormData>(defaultData);
    const [errors, setError] = useState<DefaultErrors>(defaultErrors);
    const [onChangeValue, setOnChangeValue] = useState(500)
    const [onChangeEndValue, setOnChangeEndValue] = useState(500)
    const { t } = useTranslation(["createQueuePage", "common"]);

    // Be careful with this it might trigger infinite render loop
    useEffect(() => {validate()}, [formData])

    const validate = () => {
        if (formData.name.length > 50) {
            setError({
                    ...errors,
                    nameError: 'Name is too long',
                });
                setError({...errors, nameInvalid: true})
        } else {
            setError({...errors, nameInvalid: false})
        }
    }

    const check = () => {
        if (formData.name === undefined) {
            setError({
                ...errors,
                nameError: 'Name is required',
            });
            setError({...errors, nameInvalid: true})
        }
        return true;
    };

    const query = `
        mutation create_queue($address: String!,
                            $capacity: Int!,
                            $name: String!,
                            $password: String!
                            ) {
            createQueue(address: $address,
                        capacity: $capacity,
                        name: $name,
                        password: $password){
                ... on Queue {
                    id
                }
                ... on Error {
                    error
                }
            }
        }
    `

    async function createQueue () {
        try {
            const response = await fetch(baseURL(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': corsURL(),
                },
                credentials: 'include',
                body: JSON.stringify({query: query, variables: formData})
            });
            return await response.json()
        } catch(error) {
            return error
        }
    }

    const onSuccess = () => {
        setData({...formData})
        setSubmitted(true)
        const submissionData = createQueue()
        setShowModal(false)
        setData({...formData})
        setSubmitted(false)
        navigation.navigate("QueuesPage")
    }

    const onFailure = () => {
        console.log("you suck")
    }

    const onSubmit = () => {
        setData({...formData})
        setSubmitted(true)
        check() ? onSuccess() : onFailure();
    };

    return (
        <VStack space={3} width="90%" mx="3">
            <FormControl isRequired isInvalid={errors.nameInvalid}>
                <Stack>
                    <HStack>
                        <FormControl.Label _text={{bold: true}}>{t("business_name_label")}</FormControl.Label>
                        <Tooltip label={t("business_name_helper")} openDelay={300}>
                            <Box>
                                <AntDesign name={isThemeDark ? "questioncircleo" : "questioncircle"} size={10}/>
                            </Box>
                        </Tooltip>
                    </HStack>
                    <Input
                        placeholder={t("business_name_placeholder")}
                        onChangeText={(value) => setData({ ...formData, name: value })}
                    />
                    <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{"Name Error"}</FormControl.ErrorMessage>
                </Stack>
            </FormControl>
            <FormControl>
                <Stack>
                    <HStack>
                        <FormControl.Label _text={{bold: true}}>{t("queue_cap_label")}</FormControl.Label>
                        <Tooltip label={t("queue_cap_helper")} openDelay={300}>
                            <Box>
                                <AntDesign name={isThemeDark ? "questioncircleo" : "questioncircle"} size={10}/>
                            </Box>
                        </Tooltip>
                    </HStack>
                    <Text>{onChangeValue}</Text>
                    <Slider
                        defaultValue={500}
                        colorScheme="cyan"
                        onChange={(v) => {
                            setOnChangeValue(Math.floor(v))
                        }}
                        onChangeEnd={(v) => {
                            v && setOnChangeEndValue(Math.floor(v))
                            setData({...formData, capacity: v})
                        }}
                        minValue={0}
                        maxValue={1000}
                    >
                        <Slider.Track>
                            <Slider.FilledTrack />
                        </Slider.Track>
                        <Slider.Thumb />
                    </Slider>
                    <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{"Queue cap error"}</FormControl.ErrorMessage>
                </Stack>
            </FormControl>
            <FormControl>
                <Stack>
                    <HStack>
                        <FormControl.Label _text={{bold: true}}>{t("grace_period_label")}</FormControl.Label>
                        <Tooltip label={t("grace_period_helper")} openDelay={300}>
                            <Box>
                                <AntDesign name={isThemeDark ? "questioncircleo" : "questioncircle"} size={10}/>
                            </Box>
                        </Tooltip>
                    </HStack>
                    <Input
                        placeholder={t("grace_period_placeholder")}
                        onChangeText={(value) => setData({ ...formData, gracePeriod: parseInt(value) })}
                        keyboardType={"numeric"}
                    />
                <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{"Grace period error"}</FormControl.ErrorMessage>
                </Stack>
            </FormControl>
            <FormControl>
                <Stack>
                    <HStack>
                        <FormControl.Label _text={{bold: true}}>{t("party_size_label")}</FormControl.Label>
                        <Tooltip label={t("party_size_helper")} openDelay={300}>
                            <Box>
                                <AntDesign name={isThemeDark ? "questioncircleo" : "questioncircle"} size={10}/>
                            </Box>
                        </Tooltip>
                    </HStack>
                    <Input
                        placeholder={t("party_size_placeholder")}
                        onChangeText={(value) => setData({ ...formData, maxPartySize: parseInt(value) })}
                        keyboardType={"numeric"}
                    />
                    <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{"Party size error"}</FormControl.ErrorMessage>
                </Stack>
            </FormControl>
            <FormControl>
                <Stack>
                    <HStack>
                        <FormControl.Label _text={{bold: true}}>{t("offline_time_label")}</FormControl.Label>
                        <Tooltip label={t("offline_time_helper")} openDelay={300}>
                            <Box>
                                <AntDesign name={isThemeDark ? "questioncircleo" : "questioncircle"} size={10}/>
                            </Box>
                        </Tooltip>
                    </HStack>
                    <Input
                        placeholder={t("offline_time_placeholder")}
                        onChangeText={(value) => setData({ ...formData, offlineTime: parseInt(value) })}
                        keyboardType={"numeric"}
                    />
                    <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{"Offline time error"}</FormControl.ErrorMessage>
                </Stack>
            </FormControl>
            <FormControl isRequired>
                <Stack>
                    <HStack>
                        <FormControl.Label _text={{bold: true}}>{t("address_label")}</FormControl.Label>
                        <Tooltip label={t("address_helper")} openDelay={300}>
                            <Box>
                                <AntDesign name={isThemeDark ? "questioncircleo" : "questioncircle"} size={10}/>
                            </Box>
                        </Tooltip>
                    </HStack>
                    <Input
                        placeholder={t("address_placeholder")}
                        onChangeText={(value) => setData({ ...formData, address: value })}
                    />
                    <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{"Address error"}</FormControl.ErrorMessage>
                </Stack>
            </FormControl>
            <FormControl isRequired>
                <Stack>
                    <HStack>
                        <FormControl.Label _text={{bold: true}}>{t("password_label")}</FormControl.Label>
                        <Tooltip label={t("password_helper")} openDelay={300}>
                            <Box>
                                <AntDesign name={isThemeDark ? "questioncircleo" : "questioncircle"} size={10}/>
                            </Box>
                        </Tooltip>
                    </HStack>
                    <Input
                        placeholder={t("password_placeholder")}
                        onChangeText={(value) => setData({ ...formData, password: value })}
                    />
                    <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{"Password error"}</FormControl.ErrorMessage>
                </Stack>
            </FormControl>
            <Button.Group space={2}>
                <Button
                    mt="5"
                    variant="ghost"
                    colorScheme="blueGray"
                    onPress={() => {
                        setShowModal(false)
                    }}
                >
                    {t("cancel", {ns: "common"})}
                </Button>
                <Button
                    onPress={() => onSubmit()}
                    mt="5"
                    colorScheme="cyan"
                    isLoading={submitted}
                    isLoadingText={t("submitting", {ns: "common"})}
                >
                    {t("submit", {ns: "common"})}
                </Button>
            </Button.Group>
        </VStack>
    )
}
