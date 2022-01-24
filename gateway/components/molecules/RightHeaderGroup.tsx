import React from 'react'
import {HStack} from 'native-base'
import DarkModeToggle from "../atoms/DarkModeToggle";
import LanguagePicker from "../atoms/LanguagePicker";


export default function () {
    return (() =>
        <HStack space={3}>
            <LanguagePicker/>
            <DarkModeToggle/>
        </HStack>
    )
}
