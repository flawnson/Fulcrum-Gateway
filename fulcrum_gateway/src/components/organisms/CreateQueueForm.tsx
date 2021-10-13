import React from 'react'
import { FormControl, VStack, Center, Input, Button} from 'native-base'
import {HomeScreenProps} from "../../../types";
import InputGroup from "../molecules/InputGroup";

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

    const onSuccess = () => {
        setData({...formData, submitted: true})
        navigation.navigate("OrganizerDashboard")
    }

    const onFailure = () => {
        setErrors({...errors, invalid: "invalid submission"})
    }

    const onSubmit = () => {
        setData({...formData, submitted: true})
        validate() ? onSuccess() : onFailure();

    };

    const formText = [
        {
            label: "What's your name?",
            helper: "What's the name of your business, event, or venue?",
            placeholder: "Bob's Burgers",
            error: "Name Error",
        },
        {
            label: "What type of business are you?",
            helper: "How many people ",
            placeholder: "Bob's Burgers",
            error: "Name Error",
        }
    ]

    return (
        <VStack width="90%" mx="3">
            <FormControl>
                {formText.map((text) => <InputGroup text={text} data={formData} onDataChange={setData}/>)}
            </FormControl>
            <Button onPress={onSubmit} mt="5" colorScheme="cyan" isLoading={formData.submitted} isLoadingText="Submitting">
                Submit
            </Button>
        </VStack>
    )
}
