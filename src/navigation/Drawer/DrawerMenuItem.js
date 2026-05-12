import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import themes from '../../themes/colors';
import AppText from '../../components/AppText';

const DrawerMenuItem = ({ label, icon: Icon, isActive, onPress,theme }) => (
  <TouchableOpacity
    style={[styles.menuItem, isActive && { backgroundColor: themes.purple }]} // selected bg purple
    onPress={onPress}
  >
    <Icon
      width={20}
      height={20}
      color={isActive ? '#fff' : theme?.theme?.medium_text} // selected icon white
      otherColor={isActive ? theme?.theme?.medium_text : "#fff"} // selected icon white
    />
    <AppText weight='Medium' style={[{  marginLeft: 8,color:theme?.theme?.medium_text}, isActive && { color: '#fff' }]}>  {/* selected text white */}
      {label}
    </AppText>
  </TouchableOpacity>
);

export default DrawerMenuItem;

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
 
});