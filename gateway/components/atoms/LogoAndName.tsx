import React from 'react'
import {Image} from 'native-base'
import {StyleSheet} from "react-native";
import {PreferencesContext} from "../../utilities/PreferencesContext";


export default function (props: {light?: boolean, styles?: Object}) {
    const { isThemeDark } = React.useContext(PreferencesContext);
    const isDark = isThemeDark || props.light

    return (
        <Image
            alt="fiefoe"
            style={props.styles ? props.styles : styles.image}
            source={require(isDark ? "../../assets/images/fiefoe-logo-name-v1.1.0-inverse.png"
                                   : "../../assets/images/fiefoe-logo-name-v1.1.0.png")}
            resizeMode="contain"
        />
    )
}


const styles = StyleSheet.create({
    image: {
        width: 100,
        height: 100,
    }
})
