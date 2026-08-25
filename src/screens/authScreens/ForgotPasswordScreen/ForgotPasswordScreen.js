import React, { use, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import AppText from '../../../components/AppText';
import FormInput from '../../../components/FormInput';
import AppButton from '../../../components/AppButton';
import LogoBox from '../../../components/LogoBox';
import MainBox from '../../../components/MainBox';
import AuthScreenWrapper from '../../../components/AuthScreenWrapper';
import { forgotPasswordSchema } from '../../../schemas/AuthSchema';
import { moderateScale, verticalScale } from '../../../themes/sizes';
import { bg_image, bg_pattern } from '../../../assets';
import { useThemeStore } from '../../../store/useThemeStore';
import { ResetCodeGenerate } from '../../../services/auth/authService';
import { showToast } from '../../../components/ShowToas';
import Heading from '../../../components/GradientHeading';
import { useFocusEffect } from '@react-navigation/native';
import APP_CONFIG from '../../../config/app.config';

export default function ForgotPasswordScreen({ navigation }) {
  // Retrieve current app theme from Zustand global store
  const { theme } = useThemeStore();

  const [focused, setFocused] = useState("");
  const [isDisable, setIsDisable] = useState(false);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      email: ''
    },
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setIsDisable(true)
    try {
      const res = await ResetCodeGenerate(data)
      if (res?.data?.status_code == 200) {
        showToast("success", "Success", res?.data?.message, theme?.set_timeout?.toast_message)
        navigation.navigate('OtpScreen', { email: data?.email });
      } else {
        setIsDisable(false)
        showToast("error", "Error", res?.data?.message, theme?.set_timeout?.toast_message)

      }
    } catch (err) {
      setIsDisable(false)
      console.log(err)
    }

  };


useFocusEffect(
  React.useCallback(() => {
    // Jab screen focus hogi (user screen par aayega)
    setIsDisable(false);

    return () => {
      // Jab screen blur hogi (user screen se jayega)
      // Agar aap chahte hain ke jate waqt bhi kuch reset ho
    };
  }, [])
);

  return (
    <AuthScreenWrapper backgroundImage={bg_image} backgroundPattern={bg_pattern}>
      {/* <BrandLogo /> */}
      <Heading title={APP_CONFIG?.companyName} />
      <MainBox paddingVertical={moderateScale(68)} style={{ marginTop: verticalScale(theme?.heading_font_size?.h3 - theme?.heading_font_size?.h5 || 6) }}>
        {/* Logo */}
        <LogoBox title="EmployeeDesk"
          titleSize={theme?.heading_font_size?.h1} titleColor={theme?.theme?.dark_text}
          width={theme?.school_logo?.width} height={theme?.school_logo?.height} />
        {/* Title */}
        <AppText type="title" weight="Medium" style={[styles.title, { fontSize: moderateScale(theme?.text_font_size?.large), color: theme?.theme?.medium_text }]}>
          Forgot Password
        </AppText>

        {/* Email Input */}
        <FormInput
          control={control}
          name="email"
          label="Email"
          type="email"
          errors={errors}
          focused={focused}
          setFocused={setFocused}
          style={styles.inputWrapper}
        />

        {/* Submit Button */}
        <AppButton
          title="Send OTP to Email"
          onPress={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
          disabled={isDisable}
          fullWidth
        />

        {/* Back to Login */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ alignSelf: 'center', marginTop: moderateScale(8) }}
        >
          <AppText type="body" weight="Regular" style={{ fontSize: moderateScale(theme?.text_font_size?.medium_small), color: theme?.theme?.dark_text }}>
            Back to{' '}
            <AppText weight="Medium" style={{ fontSize: moderateScale(theme?.text_font_size?.medium), color: theme?.theme?.primary }}>
              Login
            </AppText>
          </AppText>
        </TouchableOpacity>
      </MainBox>
    </AuthScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: {
    // fontSize: moderateScale(16),
    textAlign: 'center',
    // color: themes.mediumText,
    marginBottom: moderateScale(8),
  },
  inputWrapper: {
    marginBottom: moderateScale(0),
  },
  backText: {
    // fontSize: moderateScale(14),
    // color: themes.purple,
  },
});
