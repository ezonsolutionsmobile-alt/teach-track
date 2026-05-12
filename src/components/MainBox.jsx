import React from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';

const MainBox = ({
  children,
  width = '100%',
  height = 'auto',
  maxHeight = '100%',
  backgroundColor = '#FFFFFF',
  borderRadius = 20,
  paddingHorizontal = 12,
  paddingVertical = 48,
  style,
  scrollEnabled = true,
  disableScroll = false,
  onRefresh,         // ✅ pass this prop from parent
  refreshing = false, // ✅ pass this prop from parent
}) => {

  if (disableScroll) {
    return (
      <View
        style={[
          styles.wrapper,
          {
            width,
            height: height === 'auto' ? undefined : height,
            maxHeight,
            backgroundColor,
            borderRadius,
            paddingHorizontal,
            paddingVertical,
            flex: 1,
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.wrapper,
        {
          width,
          height: height === 'auto' ? undefined : height,
          maxHeight,
          backgroundColor,
          borderRadius,
        },
        style,
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
        contentContainerStyle={{
          paddingHorizontal,
          paddingVertical,
        }}
        refreshControl={
          onRefresh && (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          )
        }
      >
        {children}
      </ScrollView>
    </View>
  );
};

export default MainBox;

const styles = StyleSheet.create({
  wrapper: {
    // alignSelf: 'center',
    overflow: 'hidden',
    // iOS shadow
    shadowColor: '#292D34',
    shadowOffset: { width: 1, height: -1 },
    shadowOpacity: 0.14,
    shadowRadius: 8,

    // Android shadow
    elevation: 6,
  },
});
