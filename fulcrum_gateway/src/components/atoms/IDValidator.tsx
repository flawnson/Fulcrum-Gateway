import React from "react";
import {
    VStack,
    FormControl,
    Input,
    Button,
    Center
} from "native-base";
import {HomeScreenProps} from "../../../types";


export default function ({navigation}: HomeScreenProps) {
    const [formData, setData] = React.useState<any>({submitted: false});
    const [errors, setErrors] = React.useState<object>({});
    const validate = () => {
        if (formData.name === undefined) {
            setErrors({
                ...errors,
                name: 'ID is required',
            });
            return false;
        } else if (formData.name.length !== 10) {
            setErrors({
                ...errors,
                name: 'ID is too short',
            });
            return false;
        }
        return true;
    };

    const onSuccess = () => {
        setData({...formData, submitted: true})
        navigation.navigate("QueuerDashboard")
    }

    const onFailure = () => {
        setErrors({...errors, invalid: "invalid submission"})
    }

    const onSubmit = () => {
        validate() ?  onSuccess() : onFailure();
    };

    return (
        <VStack width="90%" mx="3">
            <FormControl>
                <Center>
                    <FormControl.Label _text={{bold: true}}>Queue ID</FormControl.Label>
                </Center>
                <Input
                    placeholder="Ex. 6477135354"
                    onChangeText={(value) => setData({ ...formData, name: value })}
                />
                <Center>
                    <FormControl.HelperText _text={{fontSize: 'xs'}}>
                        Queue ID must be 10 characters.
                    </FormControl.HelperText>
                </Center>
                <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>Error Name</FormControl.ErrorMessage>
            </FormControl>
            <Button onPress={onSubmit} mt="5" colorScheme="cyan" isLoading={formData.submitted} isLoadingText="Submitting">
                Submit
            </Button>
        </VStack>
    );
}
