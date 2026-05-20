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
          styles.wrapper, // 🔥 Ab shadow wrapper pe apply hogi
          {
            width,
            height: height === 'auto' ? undefined : height,
            maxHeight,
          },
          style,
        ]}
      >
        {/* 🔥 Inner container jo background, radius aur overflow handle karega */}
        <View style={{ backgroundColor, borderRadius, overflow: 'hidden', flex: 1, paddingHorizontal, paddingVertical }}>
          {children}
        </View>
      </View>
    );
  }

  return (
    // <View
    //   style={[
    //     styles.wrapper,
    //     {
    //       width,
    //       height: height === 'auto' ? undefined : height,
    //       maxHeight,
    //       backgroundColor,
    //       borderRadius,
    //     },
    //     style,
    //   ]}
    // >
    //   <ScrollView
    //     showsVerticalScrollIndicator={false}
    //     scrollEnabled={scrollEnabled}
    //     contentContainerStyle={{
    //       paddingHorizontal,
    //       paddingVertical,
    //     }}
    //     refreshControl={
    //       onRefresh && (
    //         <RefreshControl
    //           refreshing={refreshing}
    //           onRefresh={onRefresh}
    //         />
    //       )
    //     }
    //     bounces={false}   // 🔥 iOS fix (important)
    //     overScrollMode="never" // Android stable
    //   >
    //     {children}
    //   </ScrollView>
    // </View>

    <View
      style={[
        styles.wrapper, // 🔥 Ab shadow wrapper pe apply hogi
        {
          width,
          height: height === 'auto' ? undefined : height,
          maxHeight,
        },
        style,
      ]}
    >
      {/* 🔥 Inner container jo background, radius aur overflow handle karega */}
      <View style={{ backgroundColor, borderRadius, overflow: 'hidden' }}>
        {/* 🔥 ScrollView ko yahan se hata dein */}
        <View
          style={{
            paddingHorizontal,
            paddingVertical,
          }}
        >
          {children}
        </View>
      </View>
    </View>
  );
};

export default MainBox;

const styles = StyleSheet.create({
  wrapper: {
    // alignSelf: 'center',
    
    // iOS shadow
    shadowColor: '#292D34',
    shadowOffset: { width: 1, height: 1 }, // 🔥 -1 ki jagah 1 kiya taaki shadow bahaar dikhe
    shadowOpacity: 0.14,
    shadowRadius: 8,

    // Android shadow
    elevation: 6,
    
    // 🔥 iOS shadow k leye zaroori properties
    backgroundColor: 'transparent', 
    overflow: 'visible', 
  },
});