import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextInput } from 'react-native-paper';

import AppText from '../../../components/AppText';
import AppButton from '../../../components/AppButton';
import { logo } from '../../../assets';
import { EyeIcon, EyeOffIcon } from '../../../assets/Icons';
import { signupSchema } from '../../../schemas/AuthSchema'; // create this
import themes from '../../../themes/colors';
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function SignUpScreen({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = data => {
    console.log('Signup data:', data);
    navigation.replace('MainTabs');
  };

  return (
  <KeyboardAwareScrollView
    style={styles.container}
    contentContainerStyle={styles.scrollContent}
    extraScrollHeight={20}
    keyboardOpeningTime={0}
  >
    {/* Logo */}
    <Image source={logo} style={styles.logo} resizeMode="contain" />

    <AppText type="title" style={styles.title}>Sign Up</AppText>

    {/* Name */}
    <Controller
      control={control}
      name="name"
      render={({ field: { onChange, value } }) => (
        <TextInput
          label="Full Name"
          value={value}
          onChangeText={onChange}
          style={styles.input}
          mode="outlined"
          activeOutlineColor={themes.purple}
          outlineColor={themes.borderGrey}
        />
      )}
    />
    {errors.name && <AppText style={styles.error}>{errors.name.message}</AppText>}

    {/* Email */}
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
          activeOutlineColor={themes.purple}
          outlineColor={themes.borderGrey}
        />
      )}
    />
    {errors.email && <AppText style={styles.error}>{errors.email.message}</AppText>}

    {/* Password */}
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
          activeOutlineColor={themes.purple}
          outlineColor={themes.borderGrey}
          right={
            <TextInput.Icon
              icon={() =>
                showPassword ? (
                  <EyeOffIcon width={22} height={22} color={themes.purple} />
                ) : (
                  <EyeIcon width={22} height={22} color={themes.purple} />
                )
              }
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />
      )}
    />
    {errors.password && <AppText style={styles.error}>{errors.password.message}</AppText>}

    {/* Confirm Password */}
    <Controller
      control={control}
      name="confirmPassword"
      render={({ field: { onChange, value } }) => (
        <TextInput
          label="Confirm Password"
          value={value}
          onChangeText={onChange}
          style={styles.input}
          mode="outlined"
          secureTextEntry={!showConfirmPassword}
          activeOutlineColor={themes.purple}
          outlineColor={themes.borderGrey}
          right={
            <TextInput.Icon
              icon={() =>
                showConfirmPassword ? (
                  <EyeOffIcon width={22} height={22} color={themes.purple} />
                ) : (
                  <EyeIcon width={22} height={22} color={themes.purple} />
                )
              }
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          }
        />
      )}
    />
    {errors.confirmPassword && (
      <AppText style={styles.error}>{errors.confirmPassword.message}</AppText>
    )}

    {/* Signup Button */}
    <AppButton
      title="Create Account"
      onPress={handleSubmit(onSubmit)}
      style={styles.button}
      fullWidth
    />

    {/* Login Link */}
    <View style={styles.loginContainer}>
      <AppText type="body">Already have an account? </AppText>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <AppText type="body" style={styles.loginText}>Login</AppText>
      </TouchableOpacity>
    </View>
  </KeyboardAwareScrollView>
);

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themes.lightGrey,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 25,
    textAlign: 'center',
    color: themes.darkText,
    fontWeight: '700',
  },
  input: {
    marginBottom: 10,
    backgroundColor: themes.cardBg,
  },
  button: {
    marginTop: 20,
    borderRadius: 10,
  },
  error: {
    color: themes.error,
    marginBottom: 5,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  loginText: {
    color: themes.purple,
    marginLeft: 5,
    fontWeight: '600',
  },
});


