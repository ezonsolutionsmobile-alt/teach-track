import Toast from 'react-native-toast-message';

/**
 * Show a toast message
 * @param {'success' | 'error' | 'info'} type - Type of toast
 * @param {string} title - Main text
 * @param {string} message - Subtext
 * @param {number} visibilityTime - How long it shows (optional, default 3000ms)
 */
export const showToast = (type, title, message, visibilityTime = 3000) => {
  Toast.show({
    type,
    text1: title,
    text2: message,
    visibilityTime,
    position: 'top',
    autoHide: true,
    topOffset: 50,
    swipeable:true,
  });
};
