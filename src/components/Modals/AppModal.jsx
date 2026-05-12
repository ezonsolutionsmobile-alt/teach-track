import React from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../ToastConfig';

export default function AppModal({ visible, onClose, children }) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      {/* Background overlay */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          {/* <Toast config={toastConfig} /> */}
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              {children}
            </View>
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
    paddingHorizontal: 18,
  },
  container: {
    // backgroundColor: themes.white,
    // borderRadius: 18,
    // padding: 18,
    maxHeight: '85%',
    // paddingTop: 18
  },
});
