import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Guideline sizes (based on a standard phone, e.g., iPhone 14)
const guidelineBaseWidth = 390;
const guidelineBaseHeight = 844;

// Horizontal scaling
export const scale = (size) => (width / guidelineBaseWidth) * size;

// Vertical scaling
export const verticalScale = (size) => (height / guidelineBaseHeight) * size;

// Moderate scaling (mix of horizontal + vertical)
export const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;
