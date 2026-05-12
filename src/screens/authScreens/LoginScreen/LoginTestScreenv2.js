import React, { useState, useRef } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextInput } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppText from '../../../components/AppText';
import { loginSchema } from '../../../schemas/AuthSchema';
import AppButton from '../../../components/AppButton';
import { bg_image } from '../../../assets';
import { EyeOffIcon, EyeIcon } from '../../../assets/Icons';
import { loginService } from '../../../services/authService';
import { useAuthStore } from '../../../store/useAuthStore';
import themes from '../../../themes/colors';
import MainBox from '../../../components/MainBox';
import { moderateScale } from '../../../themes/sizes';
import LogoBox from '../../../components/LogoBox';
import Recaptcha from 'react-native-recaptcha-that-works';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const pendingForm = useRef(null);
  const recaptchaRef = useRef(null);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { email: 'test@gmail.com', password: 'admin123' },
    resolver: yupResolver(loginSchema),
  });

  // 1️⃣ Trigger reCAPTCHA on login press
  const onSubmit = (data) => {
    pendingForm.current = data;
    recaptchaRef.current.open(); // shows checkbox
  };

  // 2️⃣ Handle token from reCAPTCHA v2
  const handleCaptchaVerify = async (token) => {
    const data = pendingForm.current;

    const body = {
      username: data.email,
      password: data.password,
      captcha: token,
    };

    console.log('Login payload with v2 checkbox captcha:', body);

    try {
      const res = await loginService(body);
      if (res?.status === 200) {
        const { accessToken, ...user } = res.data;
        useAuthStore.getState().setAuth(accessToken, user);
      }
    } catch (err) {
      console.log('Login error:', err);
    }
  };

  return (
    <>
     <Recaptcha
        ref={recaptchaRef}
        siteKey="6LfwtoIsAAAAAL4CA-M_Q4bjtSSXgsjTZLlr5BjB" // replace with your v2 key
        baseUrl="https://urschooling.com" // optional for v2
        size="normal" // checkbox
        onVerify={handleCaptchaVerify}
        style={{flex:1,}}
        
      />
    <View style={styles.container}>
      {/* v2 visible checkbox captcha */}
     

      <Image
        source={bg_image}
        style={[styles.bgImage, { bottom: insets.bottom }]}
        resizeMode="cover"
        pointerEvents="none"
      />

      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        extraScrollHeight={20}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
      >
        <MainBox paddingVertical={68}>
          <LogoBox />

          {/* Email */}
          <View style={styles.inputWrapper}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  style={styles.input}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  activeOutlineColor={errors.email ? themes.redText : themes.purple}
                  outlineColor={errors.email ? themes.redText : themes.mediumText}
                />
              )}
            />
            {errors.email && <AppText style={styles.error}>{errors.email.message}</AppText>}
          </View>

          {/* Password */}
          <View style={styles.inputWrapper}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Password"
                  value={value}
                  onChangeText={onChange}
                  style={styles.input}
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  activeOutlineColor={errors.password ? themes.redText : themes.purple}
                  outlineColor={errors.password ? themes.redText : themes.mediumText}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  right={{
                    icon: showPassword ? EyeOffIcon : EyeIcon,
                    onPress: () => setShowPassword(prev => !prev)
                  }}
                />
              )}
            />
            {errors.password && <AppText style={styles.error}>{errors.password.message}</AppText>}
          </View>

          {/* Login Button */}
          <AppButton
            title="Sign In"
            onPress={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
            fullWidth
          />
        </MainBox>
      </KeyboardAwareScrollView>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: themes.white, position: 'relative' },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 8, paddingVertical: 20 },
  bgImage: { position: 'absolute', left: 0, right: 0, width: '100%', height: SCREEN_HEIGHT * 0.45 },
  input: { backgroundColor: themes.white, borderRadius: 16 },
  inputWrapper: { marginBottom: 12 },
  error: { color: themes.error, fontSize: moderateScale(13), marginTop: 4 },
});