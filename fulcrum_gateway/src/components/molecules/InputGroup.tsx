import React from 'react'
import {VStack, Stack, Center, Input, Button, FormControl} from 'native-base'


type Props = {
    text: {
        label: string,
        helper: string,
        placeholder: string,
        error: string,
    },
    data: object,
    onDataChange: Function,
}


export default function ({text, data, onDataChange}: Props) {
    return (
        <Stack>
            <Center>
                <FormControl.Label _text={{bold: true}}>{text.label}</FormControl.Label>
            </Center>
            <Center>
                <FormControl.HelperText _text={{fontSize: 'xs'}}>
                    {text.helper}
                </FormControl.HelperText>
            </Center>
            <Input
                placeholder={text.placeholder}
                onChangeText={(value) => onDataChange({ ...data, name: value })}
            />
            <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>{text.error}</FormControl.ErrorMessage>
        </Stack>
    )
}
