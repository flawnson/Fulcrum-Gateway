import React from 'react';
import { HStack, Box, Divider, Center } from 'native-base';

type OrganizerCatalogProps = {
    'entity': {
        name: string,
        index: string,
        waited: string,
    }
}

export default function (props: OrganizerCatalogProps) {
    console.log(props)
    return (
        <Center borderRadius={'md'}>
            <HStack space={'4'} divider={<Divider />}>
                <Box px={'4'} pt={'4'}>
                    {props.entity.name}
                </Box>
                <Box px={'4'}>
                    {props.entity.index}
                </Box>
                <Box px={'4'} pb={'4'}>
                    {props.entity.waited}
                </Box>
            </HStack>
        </Center>
    );
}
