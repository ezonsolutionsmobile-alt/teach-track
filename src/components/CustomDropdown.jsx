// CustomDropdown.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Pressable,
  Modal,
  findNodeHandle,
  UIManager,
} from 'react-native';
import { ForwardIcon } from '../assets/Icons';
import themes from '../themes/colors';
import { moderateScale, scale } from '../themes/sizes';
import { useThemeStore } from '../store/useThemeStore';
import AppText from './AppText';

export default function CustomDropdown({
  placeholder = "Select Option",
  options = [],
  onSelect,
  error,
  activeColor = themes.purple,
  inactiveColor = themes.mediumText,
  borderColor = themes.borderGrey,
  style,
  selected,
  setSelected,
  setPreviousSelect = () => { }
}) {
  // Retrieve current app theme from Zustand global store
  const { theme } = useThemeStore();
  // console.log(theme, "---------<><><> CustomDropdown <><><><------------")

  const [open, setOpen] = useState(false);
  const [layout, setLayout] = useState(null);
  const buttonRef = useRef(null);
  const rotation = useRef(new Animated.Value(0)).current;


  const isActive = open || selected;

  // measure button position on screen
  const measureDropdown = () => {
    const handle = findNodeHandle(buttonRef.current);
    if (!handle) return;

    UIManager.measureInWindow(handle, (x, y, width, height) => {
      setLayout({ x, y, width, height });
      setOpen(true);
    });
  };

  const toggleDropdown = () => {
    if (!open) {
      measureDropdown();
      Animated.timing(rotation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      closeDropdown();
    }
  };

  const closeDropdown = () => {
    setOpen(false);
    Animated.timing(rotation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleSelect = (item) => {
    setPreviousSelect({ active: true, cancell: true });
    setSelected(item)
    onSelect?.(item);
    closeDropdown();
  };

  const rotateIcon = {
    transform: [
      {
        rotate: rotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '90deg'],
        }),
      },
    ],
  };

  return (
    <View style={style}>
      {/* Button */}
      <TouchableOpacity
        ref={buttonRef}
        onPress={toggleDropdown}
        activeOpacity={0.8}
        style={[
          styles.button,
          {
            borderColor: error
              ? themes.redText
              : isActive
                ? theme?.theme?.primary
                : borderColor,
          },
        ]}
      >
        <AppText
          style={[
            // styles.title,
            { fontSize: moderateScale(theme?.text_font_size?.medium), color: selected ? theme?.theme?.primary : theme?.theme?.medium_text },
          ]}
          weight='SemiBold'
        >
          {selected ? selected?.label : placeholder}
        </AppText>

        <Animated.View style={rotateIcon}>
          <ForwardIcon
            size={24}
            color={error ? themes.redText : isActive ? theme?.theme?.primary : theme?.theme?.dark_text}
          />
        </Animated.View>
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={open}
        transparent
        animationType="none"
        onRequestClose={closeDropdown}
      >
        {/* Outside press */}
        <Pressable style={styles.backdrop} onPress={closeDropdown} />

        {/* Options */}
        {layout && (
          <View
            style={[
              styles.optionList,
              {
                position: 'absolute',
                top: layout.y + layout.height,
                left: layout.x,
                width: layout.width,
                borderColor: error ? themes.redText : borderColor,
              },
            ]}
          >
            {options?.map((item, index) => {
              const isSelected = selected?.value === item?.value;

              return (
                <TouchableOpacity
                  key={item?.value}
                  onPress={() => handleSelect(item)}
                  disabled={!options?.length}
                  style={[
                    styles.optionItem,
                    isSelected && { backgroundColor: theme?.theme?.primary },
                    index === options.length - 1 && { borderBottomWidth: 0 },
                    !options?.length && { opacity: 0.5 }
                  ]}
                >
                  <AppText
                    style={[{ fontSize: moderateScale(theme?.text_font_size?.medium) },
                    isSelected && { color: themes.white, },
                    ]}
                    weight='SemiBold'
                  >
                    {item?.label}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: scale(12),
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: themes.white,
  },

  backdrop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  optionList: {
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: themes.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 10,
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: themes.borderGrey,
  },

});
