import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TouchableOpacity, Alert } from 'react-native';
import Orientation, { LANDSCAPE, OrientationLocker } from 'react-native-orientation-locker';
import { useFocusEffect } from '@react-navigation/native';

import CustomStatusBar from '../../../components/CustomStatusBar';
import themes from '../../../themes/colors';
import { moderateScale, verticalScale } from '../../../themes/sizes';
import globalStyles from '../../../themes/globalStyles';

// Dummy students
const dummyData = Array.from({ length: 20 }, (_, i) => ({
  id: (i + 1).toString(),
  sName: `Student ${i + 1}`,
  attendance: 'present',
}));

const options = ['present', 'absent', 'weekend', 'holiday', 'leave', 'other'];

export default function AttendanceScreenasd({ navigation }) {
  const [students, setStudents] = useState(dummyData);

  /* ---------------- Individual Change ---------------- */
  const handleAttendanceChange = (studentId, option) => {
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, attendance: option } : s))
    );
  };

  /* ---------------- SELECT ALL (NEW FEATURE) ---------------- */
  const handleSelectAll = (option) => {
    setStudents(prev =>
      prev.map(student => ({ ...student, attendance: option }))
    );
  };

  const handleSaveExit = () => {
    Alert.alert('Attendance Saved', JSON.stringify(students, null, 2));
  };

  // Attendance summary
  const attendanceCounts = options.reduce((acc, option) => {
    acc[option] = students.filter(s => s.attendance === option).length;
    return acc;
  }, {});

  // Lock landscape on focus
  useFocusEffect(
    React.useCallback(() => {
      Orientation.lockToLandscape();
      return () => Orientation.unlockAllOrientations();
    }, [])
  );

  return (
    <>
      <OrientationLocker orientation={LANDSCAPE} />
      <CustomStatusBar backgroundColor={themes.purple} barStyle="light-content" translucent />

      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={styles.container}>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            <View style={styles.tableWrapper}>

              {/* HEADER */}
              <View style={[styles.row, styles.headerRow]}>
                <Text style={[styles.cell, styles.headerCell]}>#</Text>
                <Text style={[styles.cell, styles.headerCell]}>Id</Text>
                <Text style={[styles.cell, styles.headerCell, { minWidth: 120 }]}>S.Name</Text>

                {options.map(opt => (
                  <Pressable
                    key={opt}
                    onPress={() => handleSelectAll(opt)}
                    style={({ pressed }) => [
                      styles.headerSelectCell,
                      { minWidth: 90, opacity: pressed ? 0.6 : 1 }
                    ]}
                  >
                    <Text style={[styles.cell, styles.headerCell]}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* ROWS */}
              <ScrollView style={{ maxHeight: '100%', width: '105%' }} showsVerticalScrollIndicator>
                {students.map((student, index) => (
                  <View key={student.id} style={[styles.row, { backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }]}>
                    <Text style={styles.cell}>{index + 1}</Text>
                    <Text style={styles.cell}>{student.id}</Text>
                    <Text style={[styles.cell, { minWidth: 120 }]}>{student.sName}</Text>

                    {options.map(opt => (
                      <Pressable key={opt} style={[styles.radioContainer, { minWidth: 90 }]} onPress={() => handleAttendanceChange(student.id, opt)}>
                        <View style={styles.radioOuter}>
                          {student.attendance === opt && <View style={styles.radioInner} />}
                        </View>
                      </Pressable>
                    ))}
                  </View>
                ))}

                {/* SUMMARY */}
                <View style={[styles.row, styles.summaryRow]}>
                  <Text style={styles.cell}>-</Text>
                  <Text style={styles.cell}>-</Text>
                  <Text style={[styles.cell, { minWidth: 120, fontFamily: 'Inter-SemiBold' }]}>Total</Text>
                  {options.map(opt => (
                    <Text key={opt} style={[styles.cell, { minWidth: 90, fontFamily: 'Inter-SemiBold' }]}>
                      {attendanceCounts[opt]}
                    </Text>
                  ))}
                </View>

                {/* FOOTER */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 12 }}>
                  <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Back</Text>
                  </TouchableOpacity>

                  <Text style={styles.subHeading}>
                    Main Campus (Morning) / Prep (Tulip) / 2026-02-12 Thursday
                  </Text>

                  <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSaveExit}>
                    <Text style={styles.buttonText}>Save & Exit</Text>
                  </TouchableOpacity>
                </View>

              </ScrollView>
            </View>
          </ScrollView>

        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: globalStyles?.mainBoxWrapper?.paddingHorizontal || 12,
    paddingVertical: verticalScale(4),
    backgroundColor: themes.overlayGrey || '#f0f2f5',
  },

  horizontalScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingRight: 20,
  },

  tableWrapper: {
    alignItems: 'center',
    minWidth: 700,
  },

  row: {
    flexDirection: 'row',
    paddingVertical: verticalScale(8),
    paddingHorizontal: 8,
    alignItems: 'center',
  },

  headerRow: {
    backgroundColor: themes.purple || '#4f46e5',
  },

  headerSelectCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryRow: {
    backgroundColor: '#e0e0e0',
  },

  cell: {
    width: 80,
    minWidth: 80,
    textAlign: 'center',
    paddingHorizontal: 4,
  },

  headerCell: {
    color: '#fff',
    fontFamily: 'Inter-Bold',
    fontSize: moderateScale(13),
  },

  radioContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioOuter: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
    borderWidth: 2,
    borderColor: themes.purple || '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioInner: {
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(5),
    backgroundColor: themes.purple || '#4f46e5',
  },

  subHeading: {
    fontSize: moderateScale(14),
    fontFamily: 'Inter-Bold',
    color: themes.darkText || '#111',
    flex: 1,
    textAlign: 'center',
  },

  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  cancelButton: {
    backgroundColor: themes.redText || '#999',
  },

  saveButton: {
    backgroundColor: themes.purple || '#4f46e5',
  },

  buttonText: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    fontSize: moderateScale(13),
  },
});
