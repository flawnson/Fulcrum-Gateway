import React from 'react'
import { Menu, Button } from 'native-base'


export default function (props: {areaCode: string, setAreaCode: React.Dispatch<React.SetStateAction<string>>}) {

    return (
        <Menu trigger={triggerProps => {
            return <Button alignSelf="center" variant="solid" {...triggerProps}>
                {`+${props.areaCode}`}
            </Button>;
        }}>
            <Menu.Item onPress={() => props.setAreaCode("1")}>
                +1
            </Menu.Item>
            <Menu.Item onPress={() => props.setAreaCode("44")}>
                +44
            </Menu.Item>
            <Menu.Item onPress={() => props.setAreaCode("52")}>
                +52
            </Menu.Item>
        </Menu>
    )
}
