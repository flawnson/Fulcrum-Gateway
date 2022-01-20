import React from "react"
import { Spinner, HStack,
        Heading, Center} from "native-base"


type loadingSpinnerProps = {
    show: boolean
}


export default function (props: loadingSpinnerProps) {
    return (
        <>
            {props.show &&
                <Center>
                    <HStack space={2} alignItems="center">
                        <Spinner accessibilityLabel="Loading posts"/>
                        <Heading color="primary.500" fontSize="md">
                            Loading
                        </Heading>
                    </HStack>
                </Center>
            }
        </>
    )
}
