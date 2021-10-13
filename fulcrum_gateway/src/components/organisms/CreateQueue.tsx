import React from 'react'
import { FormControl, VStack, Center, Input, Button} from 'native-base'
import {HomeScreenProps} from "../../../types";

export default function ({navigation}: HomeScreenProps) {
    const [formData, setData] = React.useState<any>({submitted: false});
    const [errors, setErrors] = React.useState<object>({});
    const validate = () => {
        if (formData.name === undefined) {
            setErrors({
                ...errors,
                name: 'Name is required',
            });
            return false;
        } else if (formData.name.length !== 10) {
            setErrors({
                ...errors,
                name: 'Name is too short',
            });
            return false;
        }
        return true;
    };

    const onSubmit = () => {
        setData({...formData, submitted: true})
        validate() ? navigation.navigate("OrganizerDashboard") : console.log('Validation Failed');

    };
    return (
        <VStack width="90%" mx="3">
            <FormControl>
                <Center>
                    <FormControl.Label _text={{bold: true}}>What's your name?</FormControl.Label>
                </Center>
                <Center>
                    <FormControl.HelperText _text={{fontSize: 'xs'}}>
                        What's the name of your business, event, or venue?
                    </FormControl.HelperText>
                </Center>
                <Input
                    placeholder="Bob's Burgers"
                    onChangeText={(value) => setData({ ...formData, name: value })}
                />
                <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>Error Name</FormControl.ErrorMessage>
            </FormControl>
            <Button onPress={onSubmit} mt="5" colorScheme="cyan" isLoading={formData.submitted} isLoadingText="Submitting">
                Submit
            </Button>
        </VStack>
    )
}
