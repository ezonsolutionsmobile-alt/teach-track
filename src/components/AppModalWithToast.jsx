import React, { useEffect } from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback, Keyboard, Animated } from 'react-native';
import Toast from 'react-native-toast-message';
import { toastConfig } from './ToastConfig'; // aapka existing config
import { moderateScale } from '../themes/sizes';

export default function AppModalWithToast({
  visible,
  onClose,
  children,
  toast, // optional: { type: 'success'|'error'|'info', title, message, duration }
}) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  // fade animation for modal content
  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      // show toast after short delay
      if (toast) {
        setTimeout(() => {
          Toast.show({
            ...toast,
            position: 'top',
            topOffset: 50,
            visibilityTime: toast.duration || 3000,
            autoHide: true,
            swipeable: true,
          });
        }, 350); // modal animation complete hone ke baad
      }
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
              {children}
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>

      {/* Toast root for this modal */}
      <Toast config={toastConfig} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(18),
  },
  container: {
    maxHeight: '85%',
  },
});