import {useColorMode} from 'native-base'
import {useColorScheme} from "react-native";

export default function () {
    const { colorMode, toggleColorMode } = useColorMode();
    const colorScheme = useColorScheme()

}
