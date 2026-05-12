import React from "react";
import { Modal, View, StyleSheet, Pressable, Animated } from "react-native";
import AppText from "../AppText";
import { moderateScale } from "../../themes/sizes";

const ErrorModal = ({
  visible,
  title = "Invalid Credentials",
  message = "Email or password is incorrect.",
  onClose
}) => {

  const scale = React.useRef(new Animated.Value(0.8)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6
      }).start();
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade">

      <View style={styles.overlay}>

        <Animated.View style={[styles.modalContainer, { transform: [{ scale }] }]}>

          {/* ICON */}
          <View style={styles.iconWrapper}>
            <AppText weight="Bold" style={styles.iconText}>!</AppText>
          </View>

          {/* TITLE */}
          <AppText weight="Bold" style={styles.title}>
            {title}
          </AppText>

          {/* MESSAGE */}
          <AppText style={styles.message}>
            {message}
          </AppText>

          {/* BUTTON */}
          <Pressable
            style={({ pressed }) => [
              styles.okBtn,
              pressed && { opacity: 0.8 }
            ]}
            onPress={onClose}
          >
            <AppText weight="Medium" style={styles.okText}>
              OK
            </AppText>
          </Pressable>

        </Animated.View>

      </View>

    </Modal>
  );
};

export default ErrorModal;
const styles = StyleSheet.create({

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center"
  },

  modalContainer: {
    width: "85%",              // Slightly smaller width
    backgroundColor: "#fff",
    borderRadius: moderateScale(18),
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6
  },

  iconWrapper: {
    backgroundColor: "#FEE2E2",
    width: moderateScale(52),
    height: moderateScale(52),
    borderRadius: moderateScale(26),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: moderateScale(10)
  },

  iconText: {
    color: "#B91C1C",
    fontSize: moderateScale(24)
  },

  title: {
    fontSize: moderateScale(15),
    marginBottom: moderateScale(2),
    textAlign: "center"
  },

  message: {
    fontSize: moderateScale(12.5),
    color: "#666",
    textAlign: "center",
    marginBottom: moderateScale(10),
  },

  okBtn: {
    width: "100%",
    paddingVertical: moderateScale(11),
    borderRadius: moderateScale(12),
    backgroundColor: "#EF4444",
    alignItems: "center"
  },

  okText: {
    color: "#fff",
    fontSize: moderateScale(13)
  }

});