import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity, // <-- replaced Pressable
} from 'react-native';
import { moderateScale } from '../../themes/sizes';
import AppText from '../AppText';

const ConfirmationModal = ({
  visible,
  title = 'Remove Homework',
  message = 'Are you sure you want to remove this homework?',
  onConfirm,
  onCancel,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.7);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {/* WARNING ICON */}
          <View style={styles.iconWrapper}>
            <AppText weight='Bold' style={styles.iconText}>!</AppText>
          </View>

          {/* TITLE */}
          <AppText weight='Bold' style={styles.title}>{title}</AppText>

          {/* MESSAGE */}
          <AppText   style={styles.message}>{message}</AppText>
          {/* BUTTONS */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.7}>
              <AppText weight='Medium' style={styles.cancelText}>Cancel</AppText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteBtn} onPress={onConfirm} activeOpacity={0.7}>
              <AppText weight='Medium' style={styles.deleteText}>Delete</AppText>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 10,
    alignItems: 'center',
  },
  iconWrapper: {
    backgroundColor: '#FEE2E2',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconText: {
    color: '#B91C1C',
    fontSize: moderateScale(26),
  },
  title: {
    fontSize: moderateScale(16),
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: moderateScale(13),
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    marginRight: 10,
    alignItems: 'center',
  },
  deleteBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    alignItems: 'center',
  },
  cancelText: {
    color: '#111',
    fontSize: moderateScale(13),
  },
  deleteText: {
    color: '#fff',
    fontSize: moderateScale(13),
  },
});
