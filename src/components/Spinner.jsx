import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import themes from '../themes/colors'; // your colors file

export default function Spinner({ visible = false }) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator
            size="large"
            color={themes.purple} // ClickUp purple
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)', // slight dark overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: themes.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
