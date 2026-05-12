import { StyleSheet } from 'react-native';
import { scale } from './sizes'; // your responsive sizes
import themes from './colors'; // your theme colors

export const TextStyles = StyleSheet.create({
  // Regular body text
  body: {
    fontSize: scale(14),
    fontFamily: 'Inter Regular',
    color: themes.darkText, // main text
  },

  // Small / secondary text
  small: {
    fontSize: scale(12),
    fontFamily: 'Inter Regular',
    color: themes.mediumText, // secondary text
  },

  // Large headings
  h1: {
    fontSize: scale(24),
    fontFamily: 'Inter Bold',
    color: themes.darkText,
  },

  h2: {
    fontSize: scale(20),
    fontFamily: 'Inter Bold',
    color: themes.darkText,
  },

  h3: {
    fontSize: scale(18),
    fontFamily: 'Inter Medium',
    color: themes.darkText,
  },

  // Title for screens / logos
  title: {
    fontSize: scale(28),
    fontFamily: 'Inter Bold',
    color: themes.darkText,
  },

  // Links or highlighted text
  link: {
    fontSize: scale(14),
    fontFamily: 'Inter Medium',
    color: themes.blueText,
  },

  // Error / warning / success
  error: {
    fontSize: scale(14),
    fontFamily: 'Inter Regular',
    color: themes.redText,
  },
  success: {
    fontSize: scale(14),
    fontFamily: 'Inter Regular',
    color: themes.greenText,
  },
  warning: {
    fontSize: scale(14),
    fontFamily: 'Inter Regular',
    color: themes.yellowText,
  },

  // Extra styles you used in CustomTabBar
  InterReg10: {
    fontSize: scale(10),
    fontFamily: 'Inter Regular',
    color: themes.mediumText, // matches inactive tab label
  },

  InterBold14: {
    fontSize: scale(14),
    fontFamily: 'Inter Bold',
    color: themes.blueText, // matches active tab color
  },
});
