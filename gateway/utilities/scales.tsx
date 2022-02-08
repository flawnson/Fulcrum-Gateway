import { Dimensions } from 'react-native';
import _ from 'lodash'
const { width, height } = Dimensions.get('window');
// The following can trigger a rerender but it needs to be inside a react component...
// Dimensions.addEventListener('change', () => {console.log("Screen size changed...")})

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = (size: number) => _.clamp(width / guidelineBaseWidth * size, size / 2, size * 1.5);
const verticalScale = (size: number) => height / guidelineBaseHeight * size;
const moderateScale = (size: number, factor = 0.5) => size + ( scale(size) - size ) * factor;

export {scale, verticalScale, moderateScale};
