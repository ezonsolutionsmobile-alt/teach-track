import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import themes from '../../../themes/colors';
import { moderateScale, verticalScale, scale } from '../../../themes/sizes';
import globalStyles from '../../../themes/globalStyles';
import AppText from '../../../components/AppText';
import LandscapeScreen from '../../../components/LandscapeScreen';
import AttendanceSkeleton from '../../../components/Skeletons/AttendanceSkeleton';
import AppButton from '../../../components/AppButton';
import { StatusBar } from 'react-native';
import { useThemeStore } from '../../../store/useThemeStore';
import { BulkStudentAttendanceSave, GetBulkStudentAttendanceList } from '../../../services/attendance/attendanceServices';
import { formatDate } from '../../../utils/formatDateType';
import NoDataFound from '../../../components/NoDataFound';
import { showToast } from '../../../components/ShowToas';
import useAcademicFlowStore from '../../../store/useAcademicFlowStore';
import { useSoundEffect } from '../../../hooks/useSoundEffect';


export default function AttendanceScreen({ navigation, route }) {
  // Retrieve current app theme from Zustand global store
  const { theme } = useThemeStore();
  const playSuccessSound = useSoundEffect('send.wav');
  const { sectionItem } = useAcademicFlowStore();
  const selectedDated = sectionItem?.selectedDated

  const [attendanceType, setAttendanceType] = useState([])
  const [loader, setLoader] = useState(false)

  const [submitDisableLoader, setSubmitDisableLoader] = useState(false)

  const [students, setStudents] = useState([]);
  const [saveLoader, setSaveLoader] = useState(false);
  const [selectedAllOption, setSelectedAllOption] = useState(null);
  const [finalStudentsList, setFinalStudentsList] = useState([])


  const handleAttendanceChange = (student, option) => {
    setSelectedAllOption(null);

    setStudents(prev =>
      prev.map(s =>
        s?.student_id === student?.student_id
          ? { ...s, type_id: option?.id }
          : s
      )
    );

    setFinalStudentsList(prev => {
      const exists = prev.find(
        s => s?.student_id === student?.student_id
      );

      if (exists) {
        // Update existing student
        return prev.map(s =>
          s?.student_id === student?.student_id
            ? {
              student_id: student?.student_id,
              type_id: option?.id,
              year_session_id: student?.year_session_id
            }
            : s
        );
      }
      //  Add new student
      return [
        ...prev,
        {
          student_id: student?.student_id,
          type_id: option?.id,
          year_session_id: student?.year_session_id
        },
      ];
    });
  };

  const handleSelectAll = (option) => {
    setSelectedAllOption(option);
    // Update attendance in main list
    setStudents(prev =>
      prev.map(student =>
        student?.update_status ?
          {
            ...student,
            type_id: option?.id
          } : student
      ));

    // Update finalStudentsList
    setFinalStudentsList(() => {
      return students?.map(student => ({
        student_id: student?.student_id,
        type_id: option?.id,
        year_session_id: student?.year_session_id
      })) || [];
    });
  };

  const handleSaveExit = async () => {

    // Find students without attendance selection
    const invalidStudents = students.filter(
      s => !s?.type_id
    );
    if (invalidStudents.length > 0) {
      const firstError = invalidStudents[0];
      showToast(
        "error",
        "Attendance Error",
        `Student ${firstError?.s_name} (ID: ${firstError?.s_g_s_no}) attendance not selected`
      );
      return;
    }

    if (!finalStudentsList || finalStudentsList.length === 0) {
      showToast(
        "error",
        "Please update the attendance of at least one student before saving."
      );
      return;
    }

    // If validation passed
    const now = new Date(selectedDated);
    const body = {
      campus_shift_id: sectionItem?.campus_shift_id,
      class_section_id: sectionItem?.system_type_list?.class_list?.section_list?.class_section_id,
      year: now.getFullYear(),
      month_id: now.getMonth() + 1, // ⚠ month 0 se start hota hai
      date_id: now.getDate(),
      attendance_list: finalStudentsList
    }

    try {
      setSubmitDisableLoader(true)
      setSaveLoader(true)
      const res = await BulkStudentAttendanceSave(body)
      if (res?.data?.status) {
        setFinalStudentsList([])
        showToast('success', '', res?.data?.message || 'Attendance Saved Successfully', theme?.set_timeout?.toast_message);
        playSuccessSound();
        setTimeout(() => {
          navigation.goBack()
        }, theme?.set_timeout?.crud)
      } else {
        setSubmitDisableLoader(false)
        showToast("error", "Error", res?.data?.message || "Something went wrong!", theme?.set_timeout?.toast_message)
      }

    } catch (err) {
      console.log(err)
      setSubmitDisableLoader(false)

    } finally {
      setSaveLoader(false)

    }
  };
  const attendanceCounts = attendanceType.reduce((acc, option) => {
    acc[option?.id] = students.filter(s => s.type_id === option?.id).length;
    return acc;
  }, {});

  const getAllStudentsAttendanceHandler = async () => {
    const now = new Date(selectedDated);

    const body = {
      campus_shift_id: sectionItem?.campus_shift_id,
      class_section_id: sectionItem?.system_type_list?.class_list?.section_list?.class_section_id,
      year: now.getFullYear(),
      month_id: now.getMonth() + 1, // ⚠ month 0 se start hota hai
      date_id: now.getDate()
    };
    try {
      setLoader(true)
      const res = await GetBulkStudentAttendanceList(body)
      if (res?.data?.status) {
        setStudents(res?.data?.data?.student_list || [])


        // Sort attendance_type array by sort key in ascending order
        const sortedAttendance = (res?.data?.data?.attendance_type || [])
          .slice()
          .sort((a, b) => Number(a.sort) - Number(b.sort));
        setAttendanceType(sortedAttendance);
      } else {
        setStudents([])
        setAttendanceType([])
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoader(false)

    }
  }

  useEffect(() => {
    getAllStudentsAttendanceHandler()
    return () => setSubmitDisableLoader(false)
  }, [sectionItem])


  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setHidden(true, 'fade');

      return () => {
        StatusBar.setHidden(false, 'fade');
      };
    }, [])
  );

  // Dynamic styles derived from theme configuration
  const attendanceHeaderWidth = theme?.attendance_screen?.attendance_header

  const mergeHeadingAndTextFontSizes = { ...theme?.text_font_size, ...theme?.heading_font_size }

  const headerFontSize = moderateScale(
    mergeHeadingAndTextFontSizes[theme?.attendance_screen?.attendance_header?.font_size] || 14
  );
  const headerRadioOuter = theme?.attendance_screen?.attendance_radio_button?.header_radio_outer
  const headerRadioInner = theme?.attendance_screen?.attendance_radio_button?.header_radio_inner

  const statusRadioOuter = theme?.attendance_screen?.attendance_radio_button?.radio_outer
  const statusRadioInner = theme?.attendance_screen?.attendance_radio_button?.radio_inner

  const summaryRowFontSize = moderateScale(mergeHeadingAndTextFontSizes[theme?.attendance_screen?.attendance_bottom_summery?.font_size] || 14);
  const footerFontSize = moderateScale(mergeHeadingAndTextFontSizes[theme?.attendance_screen?.attendance_footer?.font_size] || 14);


  return (
    <>
      {/* <OrientationLocker orientation={LANDSCAPE} /> */}
      {/* <CustomStatusBar backgroundColor={themes.purple} barStyle="light-content" translucent /> */}
      <LandscapeScreen>
        <View style={styles.container}>
          {saveLoader && <View style={styles?.overlay} ></View>}
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {loader ? <AttendanceSkeleton />
              : <ScrollView horizontal contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                {loader || students?.length > 0 ? <View style={styles.tableWrapper}>

                  {/* HEADER */}
                  <View style={[styles.row, styles.headerRow, { backgroundColor: theme?.theme?.primary }]}>
                    {attendanceHeaderWidth?.list?.length > 0 && attendanceHeaderWidth?.list?.map((headerItem, index) => (
                      <AppText
                        key={index}
                        style={[
                          styles.cell,
                          styles.headerCell,
                          { fontSize: headerFontSize, width: headerItem?.width }, // adjust width dynamically if needed
                        ]}
                      >
                        {headerItem?.label}
                      </AppText>
                    ))}
                    {attendanceType?.length > 0 && attendanceType?.map((opt, i) => (
                      <Pressable
                        key={opt?.id}
                        onPress={() => handleSelectAll(opt)}
                        style={[styles.headerRadioContainer, { width: attendanceHeaderWidth?.status?.width, paddingTop: attendanceHeaderWidth?.padding_top, paddingBottom: attendanceHeaderWidth?.padding_bottom }]}
                      >
                        <View style={styles.headerRadioWrapper}>

                          <View style={[styles.headerRadioOuter, { width: headerRadioOuter?.width, height: headerRadioOuter?.height }]}>
                            {selectedAllOption === opt && <View style={[styles.headerRadioInner, { width: headerRadioInner?.width, height: headerRadioInner?.height }]} />}
                          </View>

                          <AppText style={[styles.headerRadioLabel, { fontSize: headerFontSize }]}>
                            {opt?.status}
                          </AppText>
                        </View>
                      </Pressable>
                    ))}
                  </View>

                  {/* ROWS */}
                  <FlatList
                    data={students}
                    scrollEventThrottle={16}
                    keyExtractor={(item, index) => item?.student_id.toString()}
                    showsVerticalScrollIndicator={false}

                    renderItem={({ item: student, index }) => (
                      <View
                        style={[
                          styles.row,
                          { backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' },
                        ]}
                      >
                        {attendanceHeaderWidth?.list?.length > 0 && attendanceHeaderWidth?.list?.map((col, i) => {

                          return (
                            <AppText
                              key={i}
                              style={[
                                styles.cell,
                                { width: col.width, fontSize: headerFontSize }
                              ]}
                            >
                              {student?.[col?.value]}
                            </AppText>
                          );
                        })}
                        {/* <AppText style={[styles.cell, { fontSize: headerFontSize, width: attendanceHeaderWidth?.list[0]?.width }]}>
                        {index + 1}
                      </AppText>

                      <AppText style={[styles.cell, { fontSize: headerFontSize, width: attendanceHeaderWidth?.s_id }]}>
                        {student?.student_id}
                      </AppText>

                      <AppText style={[styles.cell, { fontSize: headerFontSize, width: attendanceHeaderWidth?.s_name }]}>
                        {student?.f_name} {student?.l_name}
                      </AppText> */}

                        {attendanceType?.length > 0 && attendanceType?.map((opt, i) => (
                          <Pressable
                            disabled={!student?.update_status}
                            key={opt?.id}
                            style={[styles.radioContainer, { width: attendanceHeaderWidth?.status?.width }]}
                            onPress={() => handleAttendanceChange(student, opt)}
                          >
                            <View style={[styles.radioOuter, { width: statusRadioOuter?.width, height: statusRadioOuter?.height }, { borderColor: student?.update_status ? theme?.theme?.primary : theme?.theme?.medium_text }]}>
                              {student?.type_id === opt?.id && <View style={[styles.radioInner, { width: statusRadioInner?.width, height: statusRadioInner?.height }, { backgroundColor: student?.update_status ? theme?.theme?.primary : theme?.theme?.medium_text }]} />}
                            </View>
                          </Pressable>
                        ))}
                      </View>
                    )}

                    ListFooterComponent={() => (
                      <>
                        {/* SUMMARY */}
                        <View style={[styles.row, styles.summaryRow]}>
                          {/* <AppText weight='Medium' style={[styles.cell, { fontSize: summaryRowFontSize, width: attendanceHeaderWidth?.s_no }]}>-</AppText>
                        <AppText weight='Medium' style={[styles.cell, { fontSize: summaryRowFontSize, width: attendanceHeaderWidth?.s_id }]}>-</AppText>
                        <AppText weight='Medium' style={[styles.cell, { fontSize: summaryRowFontSize, width: attendanceHeaderWidth?.s_name }]}>Total</AppText> */}
                          {attendanceHeaderWidth?.list?.length > 0 && attendanceHeaderWidth?.list?.map((col, i) => {
                            let value = "-";
                            if (col.value === "s_name") {
                              value = "Total";
                            }

                            return (
                              <AppText
                                key={i}
                                weight="Medium"
                                style={[
                                  styles.cell,
                                  { width: col.width, fontSize: summaryRowFontSize }
                                ]}
                              >
                                {value}
                              </AppText>
                            );
                          })}


                          {attendanceType?.map((opt, i) => {
                            return (
                              <AppText
                                key={opt?.id}
                                style={[
                                  styles.cell,
                                  { width: attendanceHeaderWidth?.status?.width, fontSize: summaryRowFontSize },
                                ]}
                                weight='Medium'
                              >
                                {attendanceCounts[opt?.id]}
                              </AppText>
                            )
                          }
                          )}
                        </View>

                        {/* FOOTER */}
                        <View style={styles.footer}>
                          <View style={{ flex: 1, marginTop: verticalScale(8), width: '100%', justifyContent: 'center' }}>
                            <Text
                              style={[
                                styles.subHeading,
                                { fontSize: footerFontSize, color: theme?.theme?.dark_text || '#111', },
                              ]}
                            >
                              {sectionItem?.campus_shift_name} /{" "}
                              {sectionItem?.system_type_list?.class_list?.class_name}{" "}
                              (
                              {sectionItem?.system_type_list?.class_list?.section_list?.section_name}
                              ){" "}
                              / {formatDate(selectedDated, "YYYY-MM-DD dddd")}
                            </Text>
                          </View>

                          <View style={{ width: "100%", flexGrow: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: scale(8) }}>
                            <AppButton
                              title="Back"
                              onPress={() => navigation.goBack()}
                              fullWidth={false}
                              btnStyle={styles.cancelButton}
                              textStyle={{ fontSize: moderateScale(theme?.text_font_size.large) }}
                            />

                            <AppButton
                              title="Save & Exit"
                              onPress={handleSaveExit}
                              fullWidth={false}
                              isLoading={saveLoader}
                              disabled={submitDisableLoader}
                              btnStyle={styles.saveButton}
                              spinnerSize={19}
                              spinnerHorizontalPadding={27}
                              textStyle={{ fontSize: moderateScale(theme?.text_font_size.large) }}
                            />
                          </View>
                        </View>
                      </>
                    )}
                  />

                </View> : !loader &&
                <View style={{ flex: 1 }}>

                  <NoDataFound message="No attendance data available for today" />
                  <View style={[styles.footer, { gap: scale(12) }]}>
                    <AppButton
                      title="Back"
                      onPress={() => navigation?.goBack()}
                      fullWidth={false}
                      btnStyle={styles.cancelButton}
                      textStyle={{ fontSize: moderateScale(theme?.text_font_size.large) }}
                    />

                    <Text
                      style={[
                        styles.subHeading,
                        { fontSize: moderateScale(theme?.text_font_size?.small) },
                      ]}
                    >
                      {sectionItem?.campus_shift_name} /{" "}
                      {sectionItem?.system_type_list?.class_list?.class_name}{" "}
                      (
                      {sectionItem?.system_type_list?.class_list?.section_list?.section_name}
                      ){" "}
                      / {formatDate(selectedDated, "YYYY-MM-DD dddd")}
                    </Text>
                  </View>
                </View>
                }
              </ScrollView>}
          </View>
        </View>

      </LandscapeScreen>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: globalStyles?.mainBoxWrapper?.paddingHorizontal || 12,
    backgroundColor: themes.off_white || '#f0f2f5',
    position: 'relative'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: themes?.overlayGrey || '#000',
    opacity: 0.7,
    zIndex: 9999,
  },
  tableWrapper: {
    backgroundColor: '#fff',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerRow: {
    // backgroundColor: themes.purple || '#4f46e5',
    // height:40
  },

  summaryRow: {
    backgroundColor: '#e0e0e0',
  },

  cell: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    textTransform: 'capitalize'
  },

  headerCell: {
    color: '#fff',
  },

  /* HEADER SELECT ALL RADIO */
  headerRadioContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // paddingTop: 6,
  },

  headerRadioWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },

  headerRadioOuter: {
    // width: moderateScale(18),
    // height: moderateScale(18),
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerRadioInner: {
    // width: moderateScale(10),
    // height: moderateScale(10),
    borderRadius: 10,
    backgroundColor: '#fff',
  },

  headerRadioLabel: {
    color: '#fff',
    textAlign: 'center',
  },

  /* STUDENT RADIO */
  radioContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },

  radioOuter: {
    // width: moderateScale(24),
    // height: moderateScale(24),
    borderRadius: moderateScale(12),
    borderWidth: 2,
    // borderColor: themes.purple || '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioInner: {
    // width: moderateScale(12),
    // height: moderateScale(12),
    borderRadius: moderateScale(6),
    // backgroundColor: themes.purple || '#4f46e5',
  },

  subHeading: {
    fontFamily: 'Inter-SemiBold',
    flex: 1,
    textAlign: 'center',
  },

  cancelButton: {
    backgroundColor: themes.redText || '#999',
    paddingHorizontal: scale(32),
    paddingVertical: verticalScale(6),
  },

  saveButton: {
    // backgroundColor: themes.purple || '#4f46e5',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(6),
  },


  footer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // flexWrap: 'wrap',
    paddingHorizontal: scale(2),
  },
});
