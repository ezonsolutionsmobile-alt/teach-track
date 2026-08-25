import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import AppText from '../../../components/AppText';
import LogoBoxSkeleton from '../../../components/Skeletons/LogoBoxSkeleton';
import FormInput from '../../../components/FormInput';
import AppButton from '../../../components/AppButton';
import LogoBox from '../../../components/LogoBox';
import MainBox from '../../../components/MainBox';
import AuthScreenWrapper from '../../../components/AuthScreenWrapper';
import { loginSchema } from '../../../schemas/AuthSchema';
import { loginService } from '../../../services/auth/authService';
import { useAuthStore } from '../../../store/useAuthStore';
import { moderateScale } from '../../../themes/sizes';
import { bg_image, bg_pattern } from '../../../assets';
import { useThemeStore } from '../../../store/useThemeStore';
import ErrorModal from '../../../components/Modals/ErrorModal';
import Heading from '../../../components/GradientHeading';
import { useApiRoutesStore } from '../../../store/useApiRoutesStore';
import APP_CONFIG from '../../../config/app.config';

export default function LoginScreen({ navigation }) {
    // Retrieve current app theme from Zustand global store
    const { theme, fetchTheme } = useThemeStore();

    const [show, setShow] = useState({ password: false });
    const [focused, setFocused] = useState("");

    const [errorModal, setErrorModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // global routes 
    const { routes } = useApiRoutesStore.getState();

    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            email: 'test@gmail.com',
            password: 'admin123',
        },
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        try {
            const res = await loginService(routes?.login, data);
            if (res?.data?.status) {
                const { access_token, user_details } = res?.data;
                useAuthStore.getState().setAuth(
                    access_token,
                    user_details?.data
                );
                // temporary for testing purpose 
                // fetchTheme(routes?.get_employee_app_config_details);
            } else {
                setErrorModal(true)
                setErrorMsg(res?.data?.message || "Login failed");
            }
        } catch (err) {
            console.log(err);
            Alert.alert("Something went wrong");
        }
    };
    return (
        <AuthScreenWrapper backgroundImage={bg_image} backgroundPattern={bg_pattern}>

            {/* error modal  */}
            <ErrorModal visible={errorModal} onClose={() => setErrorModal(false)} message={errorMsg} />
            {/* <BrandLogo /> */}
            <Heading title={APP_CONFIG?.companyName} />
            <MainBox style={{ marginTop: moderateScale(theme?.heading_font_size?.h3 - theme?.heading_font_size?.h5) }}>
                {/* Logo + Title */}
                {!theme?.school_logo?.logo ?
                    <LogoBoxSkeleton />
                    : <LogoBox title="Employee App"
                        titleSize={theme?.heading_font_size?.h1} titleColor={theme?.theme?.dark_text}
                        width={theme?.school_logo?.width} height={theme?.school_logo?.height} />
                }

                {/* Email */}
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

                {/* Password */}
                <FormInput
                    control={control}
                    name="password"
                    label="Password"
                    type="password"
                    errors={errors}
                    show={show}
                    setShow={setShow}
                    focused={focused}
                    setFocused={setFocused}
                />

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
                    <AppText type="body" weight="Medium" style={[styles.forgotText, { color: theme?.theme?.primary, fontSize: moderateScale(theme?.text_font_size?.medium) }]}>
                        Forgot Password?
                    </AppText>
                </TouchableOpacity>

                {/* Back to Code */}
                <View style={styles.codeContainer}>
                    <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('CodeScreen')}>
                        <AppText type="body" weight="Regular" style={{ color: theme?.theme?.dark_text, fontSize: moderateScale(theme?.text_font_size?.medium_small) }}>
                            Back To School
                        </AppText>
                        <AppText type="body" weight="Medium" style={[styles.codeText, { color: theme?.theme?.primary, fontSize: moderateScale(theme?.text_font_size?.medium) }]}>
                            Code
                        </AppText>
                    </TouchableOpacity>
                </View>
            </MainBox>

        </AuthScreenWrapper>
    );
}

const styles = StyleSheet.create({
    inputWrapper: {
        marginBottom: 10
    },
    button: {

    },
    forgotText: {
        textAlign: 'right',
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    codeText: {
        marginLeft: 4,
    },
});
