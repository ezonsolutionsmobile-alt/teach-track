import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import AppText from '../../../components/AppText';
import FormInput from '../../../components/FormInput';
import AppButton from '../../../components/AppButton';
import LogoBox from '../../../components/LogoBox';
import MainBox from '../../../components/MainBox';
import AuthScreenWrapper from '../../../components/AuthScreenWrapper';
import { resetPasswordSchema } from '../../../schemas/AuthSchema';
import { PasswordReset, resetPasswordService } from '../../../services/auth/authService';
import { moderateScale, verticalScale } from '../../../themes/sizes';
import { bg_image, bg_pattern } from '../../../assets';
import { useThemeStore } from '../../../store/useThemeStore';
import ErrorModal from '../../../components/Modals/ErrorModal';
import { showToast } from '../../../components/ShowToas';
import Heading from '../../../components/GradientHeading';

export default function ResetPasswordScreen({ navigation, route }) {
    const { otp } = route.params; // ✅ receive otp here

    const { theme } = useThemeStore();

    const [show, setShow] = useState({
        newPassword: false,
        confirmPassword: false
    });

    const [focused, setFocused] = useState("");
    const [errorModal, setErrorModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isDisable, setIsDisable] = useState(false);



    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
        },
        resolver: yupResolver(resetPasswordSchema),
    });

    const onSubmit = async (data) => {
        try {
            setIsDisable(true)
            const res = await PasswordReset({
                code: otp,
                pwd: data.newPassword
            });

            if (res?.data?.status_code === 200) {

                showToast(
                    "success",
                    "Password Updated",
                    res?.data?.message?.trim() || "Your password has been updated successfully"
                );
                navigation.navigate("LoginScreen");
            } else {
                setIsDisable(false)
                setErrorModal(true);
                setErrorMsg(res?.data?.message || "Reset failed");
            }

        } catch (err) {
            setIsDisable(false)
            setErrorModal(true);
            setErrorMsg("Something went wrong");
        }
    };

    return (
        <AuthScreenWrapper backgroundImage={bg_image} backgroundPattern={bg_pattern}>

            <ErrorModal
                visible={errorModal}
                onClose={() => setErrorModal(false)}
                message={errorMsg}
                title="Password Reset Failed"
            />

            {/* <BrandLogo /> */}
            <Heading title="EZONSOLUTION" />

            <MainBox style={{ marginTop: verticalScale(theme?.heading_font_size?.h3 - theme?.heading_font_size?.h5 || 6) }}>

                {/* Logo + Title */}
                <LogoBox title="Employee App"
                    titleSize={theme?.heading_font_size?.h1} titleColor={theme?.theme?.dark_text}
                    width={theme?.school_logo?.width} height={theme?.school_logo?.height} />

                <AppText
                    type="title"
                    weight="Medium"
                    style={{
                        textAlign: "center",
                        marginBottom: verticalScale(8),
                        fontSize: moderateScale(theme?.text_font_size?.large),
                        color: theme?.theme?.medium_text
                    }}
                >
                    Reset Password
                </AppText>

                {/* New Password */}
                <FormInput
                    control={control}
                    name="newPassword"
                    label="New Password"
                    type="password"
                    errors={errors}
                    show={show}
                    setShow={setShow}
                    focused={focused}
                    setFocused={setFocused}
                />

                {/* Confirm Password */}
                <FormInput
                    control={control}
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    errors={errors}
                    show={show}
                    setShow={setShow}
                    focused={focused}
                    setFocused={setFocused}
                />

                <AppButton
                    title="Update Password"
                    onPress={handleSubmit(onSubmit)}
                    isLoading={isSubmitting}
                    disabled={isDisable}
                    fullWidth
                />
                {/* Back to Login */}
                <TouchableOpacity
                    onPress={() => navigation.navigate('LoginScreen')}
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

const styles = StyleSheet.create({});