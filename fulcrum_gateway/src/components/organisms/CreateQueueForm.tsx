import React, { useEffect, useState } from 'react'
import { Button, Tooltip,
        FormControl, Input,
        Slider, Stack,
        Text, VStack,
        HStack, Select,
        Box } from 'native-base'
import { AntDesign } from '@expo/vector-icons';
import { PreferencesContext } from "../../utilities/useTheme";
import { HomeScreenProps } from "../../../types";
import { useTranslation } from "react-i18next";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../../types";

type DefaultData = {
    submitted: boolean,
    name: string,
    maxSize: number,
    gracePeriod: number,
    partySize: number,
}

type DefaultErrors = {
    nameError?: string
    nameInvalid: boolean,
}

type CreateQueueFormType = {
    setShowModal: Function
}

export default function (props: CreateQueueFormType) {
    const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext)
    const defaultData = {submitted: false,
                         name: "Sample Queue name",
                         maxSize: 10,
                         gracePeriod: 0,
                         partySize: 1}
    const defaultErrors = {nameInvalid: false}
    const [formData, setData] = useState<DefaultData>(defaultData);
    const [errors, setError] = useState<DefaultErrors>(defaultErrors);
    const [onChangeValue, setOnChangeValue] = useState(500)
    const [onChangeEndValue, setOnChangeEndValue] = useState(500)
    const { t, i18n } = useTranslation(["createQueuePage", "common"]);

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

    async function submit () {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            return await response.json()
        } catch(error) {
            return error
        }
    }

    const onSuccess = () => {
        setData({...formData, submitted: true})
        const submissionData = submit()
        console.log(submissionData);
        props.setShowModal(false)
        setData({...formData, submitted: false})
    }

    const onFailure = () => {
        console.log("you suck")
    }

    const onSubmit = () => {
        setData({...formData, submitted: true})
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
                        placeholder={"Bob's Burgers"}
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
                            setData({...formData, maxSize: v})
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
                        placeholder={"None"}
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
                        placeholder={"No party"}
                        onChangeText={(value) => setData({ ...formData, partySize: parseInt(value) })}
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
                        placeholder={"No limit"}
                        onChangeText={(value) => setData({ ...formData, partySize: parseInt(value) })}
                        keyboardType={"numeric"}
                    />
                    <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{"Party size error"}</FormControl.ErrorMessage>
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
                        placeholder={"King's Cross Station platform 9 3/4"}
                        onChangeText={(value) => setData({ ...formData, partySize: parseInt(value) })}
                    />
                    <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{"Party size error"}</FormControl.ErrorMessage>
                </Stack>
            </FormControl>
            <Button.Group space={2}>
                <Button
                    mt="5"
                    variant="ghost"
                    colorScheme="blueGray"
                    onPress={() => {
                        props.setShowModal(false)
                    }}
                >
                    Cancel
                </Button>
                <Button onPress={onSubmit} mt="5" colorScheme="cyan" isLoading={formData.submitted} isLoadingText="Submitting">
                    Submit
                </Button>
            </Button.Group>
        </VStack>
    )
}
