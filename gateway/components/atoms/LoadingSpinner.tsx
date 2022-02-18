import React from "react"
import { Spinner, HStack,
        Heading, Center} from "native-base"


type loadingSpinnerProps = {
    show: boolean
    light: boolean
}


export default function (props: loadingSpinnerProps) {
    return (
        <>
            {props.show &&
                <Center>
                    <HStack space={2} alignItems="center">
                        <Spinner color={props.light ? "white" : "primary.400"} accessibilityLabel="Loading posts"/>
                        <Heading color={props.light ? "white" : "primary.400"} fontSize="md">
                            Loading
                        </Heading>
                    </HStack>
                </Center>
            }
        </>
    )
}
