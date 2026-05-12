import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
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
import { useAuthStore } from '../../../store/useAuthStore';
import themes from '../../../themes/colors';
import MainBox from '../../../components/MainBox';
import { moderateScale } from '../../../themes/sizes';
import LogoBox from '../../../components/LogoBox';
import Recaptcha from 'react-native-recaptcha-that-works';
import { loginService } from '../../../services/auth/authService';
import { useApiRoutesStore } from '../../../store/useApiRoutesStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function LoginTestScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const pendingForm = useRef(null);
    const recaptchaRef = useRef(null);

    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            email: 'test@gmail.com',
            password: 'admin123'
        },
        resolver: yupResolver(loginSchema),
    });

    // global routes 
    const { routes } = useApiRoutesStore.getState();
    // Step 1: On login button, trigger reCAPTCHA
    const onSubmit = async (data) => {
        pendingForm.current = data;
        recaptchaRef.current.open(); // open invisible v3 captcha
    };

    // Step 2: Handle token from reCAPTCHA
    const handleCaptchaVerify = async (token) => {
        const data = pendingForm.current;

        const body = {
            email: data?.email,
            password: data?.password,
              captcha: `${token}`
        };

        console.log("Sending login request with token:", body);

        try {
            const res = await loginService(routes?.login,body);
            if (res?.status === 200) {
                const { accessToken, ...user } = res?.data;
                useAuthStore.getState().setAuth(accessToken, user);
                console.log("Login successful", user);
            }
        } catch (err) {
            console.log("Login error:", err);
        }
    };

    return (
        <View style={styles.container}>
            {/* reCAPTCHA v3 */}
            <Recaptcha
                ref={recaptchaRef}
                siteKey="6LfKZYQsAAAAABxM_Lr5LTeHvcXlVUEVqR5kU9T4"       // 🔹 replace with your v3 site key
                baseUrl="https://pakglobaltraders.com" // 🔹 must match domain in Google console
                size="invisible"
                onVerify={handleCaptchaVerify}
            />

            {/* Background Image */}
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
                    {/* Logo */}
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
                                    right={
                                        <TextInput.Icon
                                            icon={() =>
                                                showPassword ? (
                                                    <EyeOffIcon
                                                        width={22}
                                                        height={22}
                                                        color={isFocused ? themes.purple : themes.mediumText}
                                                    />
                                                ) : (
                                                    <EyeIcon
                                                        width={22}
                                                        height={22}
                                                        color={isFocused ? themes.purple : themes.mediumText}
                                                    />
                                                )
                                            }
                                            onPress={() => setShowPassword(prev => !prev)}
                                        />
                                    }
                                />
                            )}
                        />
                        {errors.password && <AppText style={styles.error}>{errors.password.message}</AppText>}
                    </View>

                    {/* Login Button */}
                    <AppButton
                        title="Sign In"
                        onPress={handleSubmit(onSubmit)}
                        style={styles.button}
                        isLoading={isSubmitting}
                        fullWidth
                    />

                    {/* Forgot Password */}
                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
                        <AppText type="body" style={styles.forgotText}>Forgot Password?</AppText>
                    </TouchableOpacity>

                    {/* Signup */}
                    <View style={styles.codeContainer}>
                        <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('CodeScreen')}>
                            <AppText type="body" style={{ fontSize: moderateScale(13), color: themes?.darkText }}>Back To School </AppText>
                            <AppText type="body" style={styles.codeText}>Code</AppText>
                        </TouchableOpacity>
                    </View>
                </MainBox>
            </KeyboardAwareScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: themes.white, position: 'relative' },
    scrollView: { flex: 1 },
    scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 8, paddingVertical: 20 },
    bgImage: { position: 'absolute', left: 0, right: 0, width: '100%', height: SCREEN_HEIGHT * 0.45 },
    input: { backgroundColor: themes.white, borderRadius: 16 },
    inputWrapper: { marginBottom: 12 },
    button: {},
    error: { color: themes.error, fontSize: moderateScale(13), marginTop: 4 },
    forgotText: { textAlign: 'right', color: themes.purple, fontSize: moderateScale(14) },
    codeContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 },
    codeText: { fontSize: moderateScale(14), color: themes.purple, fontWeight: '600' },
});