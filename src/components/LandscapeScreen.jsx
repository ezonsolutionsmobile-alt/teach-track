import React from "react";
import { View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Orientation from "react-native-orientation-locker";

export default function LandscapeScreen({ children, style }) {
  useFocusEffect(
    React.useCallback(() => {
      // Lock to landscape immediately
      const lockLandscape = () => Orientation.lockToLandscape();

      // Slight delay for smoother UI rendering (optional)
      const timeoutId = setTimeout(lockLandscape, 0); // 50ms delay

      return () => {
        // Cleanup: restore portrait and clear timeout
        clearTimeout(timeoutId);
        Orientation.lockToPortrait();
      };
    }, [])
  );

  return <View style={[{ flex: 1 }, style]}>{children}</View>;
}