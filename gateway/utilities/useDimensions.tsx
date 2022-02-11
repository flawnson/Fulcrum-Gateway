import React, {useEffect, useState} from 'react'
import {Dimensions} from "react-native";
import _ from "lodash";


export default () => {
    // Screen dimensions are provided by this hook
    const [screenData, setScreenData] = useState(Dimensions.get('screen'));
    // Guideline sizes are based on standard ~5" screen mobile device
    const guidelineBaseWidth = 350;
    const guidelineBaseHeight = 680;

    useEffect(() => {
        const onChange = (result: any) => {
            setScreenData(result.screen);
        };

        Dimensions.addEventListener('change', onChange);

        return () => Dimensions.removeEventListener('change', onChange);
    });

    // Same methods as in scales.tsx
    const scale = (size: number) => _.clamp(screenData.width / guidelineBaseWidth * size, size / 2, size * 1.5);
    const verticalScale = (size: number) => screenData.height / guidelineBaseHeight * size;
    const moderateScale = (size: number, factor = 0.5) => size + ( scale(size) - size ) * factor;

    return {
        ...screenData,
        isLandscape: screenData.width > screenData.height,
        scale,
        verticalScale,
        moderateScale
    };
};
