import {Animated, Dimensions, PanResponderGestureState} from "react-native";

export function onRightSwipe(pan: Animated.ValueXY) {
    Animated.spring(pan, {
        toValue: { x: Dimensions.get('window').width + 100, y: 0 }, useNativeDriver: false
    }).start(() => console.log('hi'))
}

export function onLeftSwipe(pan: Animated.ValueXY) {
    Animated.spring(pan, {
        toValue: { x: Dimensions.get('window').width - 100, y: 0 }, useNativeDriver: false
    }).start(() => console.log('bye'))
}
