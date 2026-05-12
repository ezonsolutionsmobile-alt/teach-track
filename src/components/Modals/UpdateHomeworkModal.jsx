import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import AppModal from './AppModal';
import AppText from '../AppText';
import AppButton from '../AppButton';
import CustomDatePicker from '../CustomDatePicker';
import { TextInput } from 'react-native-paper';
import { Controller } from 'react-hook-form';
import themes from '../../themes/colors';
import { AttachIcon, CloseIcon, UploadIcon } from '../../assets/Icons';
import { moderateScale, scale, verticalScale } from '../../themes/sizes';

const { height: screenHeight } = Dimensions.get('window');

export default function UpdateHomeworkModal({
  visible,
  onClose,
  control,
  errors,
  handleSubmit,
  onSubmit,
  theme,
  isLoading,
  pickAttachment,
  attachment,
  setAttachment,
  btnDisable
}) {
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [uploadedFile, setUploadedFile] = useState(false);

  const [remainingHeight, setRemainingHeight] = useState(0); // ✅ For dynamic textarea

  // ✅ Measure remaining space
  const onLayoutContainer = (event) => {
    const containerHeight = event.nativeEvent.layout.height;
    const headerHeight = scale(210); // approximate header + top texts
    const available = containerHeight - (headerHeight);
    setRemainingHeight(available);
  };

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
    <AppModal visible={visible} onClose={onClose}>
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
          height: screenHeight * 0.8,
        }}
      >
        <View style={styles.modalWrapper} onLayout={onLayoutContainer}>
          {/* HEADER */}
          <View style={styles.header}>
            <AppText weight="SemiBold" style={[styles.title, { fontSize: moderateScale(theme?.heading_font_size?.h5) }]}>
              Update Homework
            </AppText>
            <Pressable
              onPress={isLoading ? () => { } : onClose}
              style={{ paddingHorizontal: 6 }}
            >
              <CloseIcon />
            </Pressable>
          </View>

          {/* BODY */}
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 100}
          >
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: verticalScale(12) }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Date Field */}
              <View style={styles.field}>
                <Controller
                  control={control}
                  name="date"
                  render={({ field: { onChange, value } }) => (
                    <CustomDatePicker
                      placeholder="Select Homework Date"
                      date={value}
                      onDateChange={onChange}
                      strokeWidth={3}
                      fontWeight={'Bold'}
                      paddingVertical={10}
                      theme={theme}
                      disabled={true}
                    />
                  )}
                />
                {errors.date && (
                  <AppText style={styles.error}>{errors.date.message}</AppText>
                )}
              </View>

              {/* Description */}
              <View style={{ flex: 1, marginTop: verticalScale(4) }}>
                <Controller
                  control={control}
                  name="description"
                  render={({ field: { onChange, value } }) => {
                    const isError = !!errors.description;
                    const isActive = !!value;
                    return (
                      <TextInput
                        disabled={isLoading}
                        mode="outlined"
                        label="Homework Description"
                        value={value}
                        onChangeText={onChange}
                        multiline
                        textAlignVertical="top"
                        blurOnSubmit={false}
                        returnKeyType="default"
                        style={[
                          styles.textArea,
                          {
                            flex: 1,
                            fontSize: moderateScale(theme?.text_font_size?.large + 1),
                            minHeight: remainingHeight
                              ? remainingHeight
                              : verticalScale(120),
                          },
                        ]}
                        activeOutlineColor={
                          isError
                            ? themes.redText
                            : isActive
                              ? theme?.theme?.primary
                              : theme?.theme?.medium_text
                        }
                        outlineColor={
                          isError
                            ? themes.redText
                            : isActive
                              ? theme?.theme?.primary
                              : themes.borderGrey
                        }
                        theme={{
                          colors: {
                            placeholder: isError
                              ? themes.redText
                              : isActive
                                ? theme?.theme?.primary
                                : theme?.theme?.medium_text,
                            text: theme?.theme?.dark_text,
                          },
                        }}
                      />
                    );
                  }}
                />
                {errors.description && (
                  <AppText style={[styles.error, { fontSize: moderateScale(theme?.text_font_size?.medium_small) }]}>
                    {errors.description.message}
                  </AppText>
                )}
              </View>
            </ScrollView>

            {/* STICKY BOTTOM: Attachment + Submit */}
            <View style={styles.stickyBottom}>
              {/* Attachment */}
              {/* Attachment */}
              <View
                style={{
                  flexDirection: "row",
                  alignSelf: "flex-end",
                  alignItems: "center",
                  marginTop: verticalScale(2),
                }}
              >
                {/* Attachment Button */}
                <Pressable
                  onPress={pickAttachment}
                  style={({ pressed }) => [
                    {
                      borderColor: themes.purple,
                      borderRadius: 12,
                      alignItems: "center",
                      flexDirection: "row",
                      paddingLeft: scale(6),
                      paddingVertical: verticalScale(2),
                      marginVertical: verticalScale(2),
                      backgroundColor: pressed
                        ? themes.overlayGrey
                        : themes.white,
                      marginLeft: 12,
                      maxWidth: '80%'

                    },
                  ]}
                >
                  <AppText
                    weight="Medium"
                    style={{
                      color: theme?.theme?.primary,
                      fontSize: moderateScale(theme?.text_font_size?.medium_small),
                    }}
                  >
                    {attachment?.name
                      ? attachment.name
                      : "Tap to attach file"}
                  </AppText>

                  <AttachIcon
                    name="attach-file"
                    color={theme?.theme?.primary}
                  />
                </Pressable>

                {/* Clear Button */}
                {attachment && (
                  <Pressable
                    onPress={() => setAttachment(null)}

                    style={({ pressed }) => [
                      {
                        borderRadius: 10,
                        paddingLeft: 12,
                        paddingRight: 6,
                        justifyContent: "center",
                        paddingVertical: verticalScale(6),
                        marginVertical: verticalScale(2),
                        backgroundColor: pressed
                          ? themes.overlayGrey
                          : themes.white,
                      },
                    ]}
                  >
                    {/* <AttachmentRemoveIcon
                                                            name="attach-file"
                                                            color={themes?.error}
                                                            height={24}
                                                            width={24}
                                                        /> */}
                    <AppText
                      weight="Medium"
                      numberOfLines={1}
                      ellipsizeMode="middle"
                      style={{
                        color: themes?.error,
                        fontSize: moderateScale(theme?.text_font_size?.medium_small),
                      }}
                    >

                      Clear
                    </AppText>
                  </Pressable>
                )}
              </View>

              {/* Uploaded file display */}
              {uploadedFile && (
                <View style={styles.uploadedFileRow}>
                  <UploadIcon name="insert-drive-file" color={themes.mediumText} />
                  <AppText style={{ fontSize: moderateScale(theme?.text_font_size?.medium_small), color: theme?.theme?.dark_text }}>
                    {uploadedFile.fileName}
                  </AppText>
                </View>
              )}

              {/* Submit Button */}
              <AppButton
                isLoading={isLoading}
                disabled={btnDisable}
                title="Update Homework"
                onPress={handleSubmit(onSubmit)}
                fullWidth
                style={{ marginTop: 0 }}

              />
            </View>
          </KeyboardAvoidingView>
        </View>
      </Animated.View>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    backgroundColor: themes.white,
    borderRadius: 18,
    paddingHorizontal: scale(18),
    paddingTop: verticalScale(18),
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    color: themes.darkText,
  },
  field: {
    marginVertical: verticalScale(4),
  },
  textArea: {
    backgroundColor: themes.white,
    borderRadius: 14,
  },
  uploadedFileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: verticalScale(4),
    gap: scale(6),
  },

  error: {
    color: themes.redText,
    marginTop: 4,
  },
  stickyBottom: {
    backgroundColor: themes.white,
    borderTopWidth: 1,
    borderColor: themes.borderGrey,
    paddingHorizontal: scale(12),
    // paddingVertical: verticalScale(8),
  },
});
