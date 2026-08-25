import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";

import AppText from "../../../components/AppText";
import AppButton from "../../../components/AppButton";
import AuthScreenWrapper from "../../../components/AuthScreenWrapper";
import MainBox from "../../../components/MainBox";

import { moderateScale, verticalScale } from "../../../themes/sizes";
import { useThemeStore } from "../../../store/useThemeStore";
import { ResetCodeCheck, ResetCodeGenerate } from "../../../services/auth/authService";
import { showToast } from "../../../components/ShowToas";
import { bg_image, bg_pattern } from "../../../assets";
import LogoBox from "../../../components/LogoBox";
import Heading from "../../../components/GradientHeading";
import APP_CONFIG from "../../../config/app.config";

export default function OtpScreen({ navigation, route }) {
    const { email } = route.params; // ✅ receive email here

    const { theme } = useThemeStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isDisable, setIsDisable] = useState(false);


    const OTP_LENGTH = 6;
    const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));


    const inputsRef = useRef([]);
    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [resendLoader, setResendLoader] = useState(false);


    /* ✅ Handle Forward Typing */
    const handleChange = (text, index) => {
        if (!/^[0-9]?$/.test(text)) return;

        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text !== "" && index < OTP_LENGTH - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    /* ✅ Handle Backspace Movement */
    const handleKeyPress = ({ nativeEvent }, index) => {

        if (nativeEvent.key !== "Backspace") return;

        const newOtp = [...otp];

        if (otp[index]) {
            newOtp[index] = "";
            setOtp(newOtp);
            return;
        }

        if (index > 0) {
            const prevIndex = index - 1;

            newOtp[prevIndex] = "";
            setOtp(newOtp);

            setTimeout(() => {
                inputsRef.current[prevIndex]?.focus();
            }, 50);
        }
    };

    /* ✅ Verify OTP */
    const handleVerify = async () => {
        const otpValue = otp.join("");
        try {
            setIsDisable(true)
            setIsLoading(true)
            const res = await ResetCodeCheck({ code: otpValue });

            if (res?.data?.status_code === 200) {
                showToast(
                    "success",
                    "OTP Verified",
                    res?.data?.message?.trim() || "OTP verified successfully"
                );
                // ✅ Pass OTP to next screen
                navigation.navigate("ResetPasswordScreen", {
                    otp: otpValue
                });
            } else {
                setIsDisable(false)
                showToast("error", "Error", res?.data?.message);
            }
        } catch (err) {
            setIsDisable(false)
            console.log(err);
        } finally {
            setIsLoading(false)
        }
    };


    const handleResendOtp = async () => {
        try {
            if (!canResend) return;
            setResendLoader(true)
            const res = await ResetCodeGenerate({ email: email })
            if (res?.data?.status_code == 200) {
                showToast("success", "Success", res?.data?.message, theme?.set_timeout?.toast_message)
                setResendTimer(60);
                setCanResend(false);
            } else {
                showToast("error", "Error", res?.data?.message, theme?.set_timeout?.toast_message)

            }

            // if (res?.data?.status_code == 200) {
            //     showToast("success", "Success", res?.data?.message);

            //     setResendTimer(60);
            //     setCanResend(false);
            // }

        } catch (err) {
            console.log(err);
        } finally {
            setResendLoader(false)
        }
    };





    useEffect(() => {
        let interval = null;

        if (resendTimer > 0) {
            setCanResend(false);

            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [resendTimer]);

    return (
        <AuthScreenWrapper backgroundImage={bg_image} backgroundPattern={bg_pattern}>
            {/* <BrandLogo /> */}
            <Heading title={APP_CONFIG?.companyName} />

            <MainBox paddingVertical={verticalScale(60)} style={{ marginTop: verticalScale(theme?.heading_font_size?.h3 - theme?.heading_font_size?.h5 || 6) }}>
                <LogoBox title="EmployeeDesk"
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
                    Enter Verification Code
                </AppText>

                {/* OTP Boxes */}
                <View style={styles.otpContainer}>
                    {otp.map((value, index) => (
                        <TextInput
                            key={index}
                            ref={(el) => (inputsRef.current[index] = el)}
                            value={value}
                            onChangeText={(text) => handleChange(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                            style={[
                                styles.otpBox,
                                {
                                    borderColor: theme?.theme?.border_color,
                                    color: theme?.theme?.dark_text
                                }
                            ]}
                        />
                    ))}
                </View>

                <AppButton
                    title="Verify OTP"
                    onPress={handleVerify}
                    fullWidth
                    isLoading={isLoading}
                    disabled={isDisable}
                />
                {/* Back to Login */}
                <View style={{ alignItems: "center" }}>

                    {/* Back to Forgot Password */}
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ alignSelf: 'center', marginTop: moderateScale(8) }}
                    >
                        <AppText
                            weight="Medium"
                            style={{
                                fontSize: moderateScale(theme?.text_font_size?.medium),
                                color: theme?.theme?.primary
                            }}
                        >
                            Back to Forgot Password
                        </AppText>
                    </TouchableOpacity>

                    {/* Resend OTP */}
                    <TouchableOpacity
                        onPress={handleResendOtp}
                        disabled={!canResend}
                        style={{ alignSelf: 'center', marginTop: moderateScale(6) }}
                    >
                        <AppText
                            weight="Medium"
                            style={{
                                fontSize: moderateScale(theme?.text_font_size?.medium),
                                color: canResend
                                    ? theme?.theme?.primary
                                    : theme?.theme?.dark_text || "#000"
                            }}
                        >
                            {resendLoader
                                ? "Sending OTP..."
                                : canResend
                                    ? "Resend OTP"
                                    : `Resend OTP in ${resendTimer}s`
                            }
                        </AppText>
                    </TouchableOpacity>

                </View>
            </MainBox>
        </AuthScreenWrapper>
    );
}

const styles = StyleSheet.create({

    otpContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: moderateScale(12)
    },

    otpBox: {
        width: moderateScale(44),
        height: moderateScale(48),
        borderWidth: 1,
        borderRadius: moderateScale(10),
        textAlign: "center",
        fontSize: moderateScale(18)
    }
});