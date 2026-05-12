import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useNavigation } from "@react-navigation/native";

import CustomHeader from "../../../components/CustomHeader";
import MainBox from "../../../components/MainBox";
import AppText from "../../../components/AppText";
import FormInput from "../../../components/FormInput";
import AppButton from "../../../components/AppButton";
import themes from "../../../themes/colors";
import { moderateScale, scale, verticalScale } from "../../../themes/sizes";
import globalStyles from "../../../themes/globalStyles";
import { changePass } from "../../../assets";
import CustomStatusBar from "../../../components/CustomStatusBar";
import { useThemeStore } from "../../../store/useThemeStore";
import { updatePasswordschema } from "../../../schemas/UserSchema";
import { EmployeePasswordUpdate } from "../../../services/profile/profileServices";
import { showToast } from "../../../components/ShowToas";
import { useAuthStore } from "../../../store/useAuthStore";



export default function ChangePasswordScreen() {
    const navigation = useNavigation();
    // Retrieve current app theme from Zustand global store
    const { theme } = useThemeStore();
    const { logout, clearLocalAuth } = useAuthStore()

    const [isDisable, setIsDisable] = useState(false)

    const [show, setShow] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [focused, setFocused] = useState("");

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        resolver: yupResolver(updatePasswordschema),
    });

    const onSubmit = async (data) => {
        const body = {
            current_password: data?.currentPassword,
            new_password: data?.newPassword
        }
        try {
            setIsDisable(true)
            const res = await EmployeePasswordUpdate(body)
            if (res?.data?.status) {
                showToast("success", "Success", res?.data?.message, theme?.set_timeout?.toast_message)
                clearLocalAuth()
            } else {
                showToast("error", "Error", res?.data?.message, theme?.set_timeout?.toast_message)
                setIsDisable(false)
            }
        } catch (err) {
            setIsDisable(false)
            console.log(err)
        }
    };


    return (
        <>
            <CustomStatusBar backgroundColor={theme?.theme?.primary} barStyle="light-content" translucent={true} />
            <View style={{ flex: 1, backgroundColor: themes.white }}>
                <CustomHeader
                    title="Change Password"
                    titleSize={theme?.heading_font_size?.h4} containerStyle={{ backgroundColor: theme?.theme?.primary }}
                    isBack onBackPress={() => navigation.goBack()} />

                <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    <MainBox paddingVertical={verticalScale(24)} paddingHorizontal={scale(16)}>

                        {/* Title with Lock Icon */}
                        <View style={styles.titleRow}>
                            <Image source={changePass} style={styles.changePass} resizeMode="contain" />
                            <AppText weight="Bold" style={{ fontSize: moderateScale(theme?.heading_font_size?.h4), color: theme?.theme?.dark_text, textAlign: 'center' }}>Update your password</AppText>
                            <AppText style={[styles.subtitle, { fontSize: moderateScale(theme?.text_font_size?.medium), color: theme?.theme?.medium_text }]}>
                                Please enter your current password and choose a new secure password.
                            </AppText>
                        </View>

                        <FormInput
                            control={control}
                            name="currentPassword"
                            label="Current Password"
                            type="password"
                            errors={errors}
                            show={show}
                            setShow={setShow}
                            focused={focused}
                            setFocused={setFocused}
                            style={styles.inputWrapper}
                        />
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
                            style={styles.inputWrapper}
                        />
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
                        // style={styles.inputWrapper}
                        />
                        <AppButton
                            title="Update Password"
                            onPress={handleSubmit(onSubmit)}
                            isLoading={isSubmitting}
                            fullWidth
                            style={styles.button}
                            disabled={isDisable}
                        />
                        <AppText style={{ fontSize: theme?.text_font_size?.small }}>Password must be at least 8 characters ,include uppercase, lowercase, number & special character.</AppText>
                        {/* <AppText style={{ fontSize: theme?.text_font_size?.medium_small }}>Password must be at least 8 characters, 1 uppercase, 1 lowecase, 1 number & 1 special char.</AppText> */}
                    </MainBox>
                </KeyboardAwareScrollView>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: globalStyles?.mainBoxWrapper?.paddingHorizontal,
        paddingVertical: globalStyles?.mainBoxWrapper?.paddingVertical,
    },

    changePass: {
        height: moderateScale(100),
        width: moderateScale(100),
        marginBottom: 10
    },
    titleRow: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        marginBottom: 25,
    },
    title: {
        fontSize: moderateScale(20),
        textAlign: "center",
        color: themes.darkText,
    },
    subtitle: {
        textAlign: "center",
        paddingHorizontal: 20,
    },
    inputWrapper: {
        marginBottom: moderateScale(4),
    },

    input: {
        backgroundColor: themes.white,
        borderRadius: 16,
    },

    button: {
        marginTop: 10,
    },

    error: {
        color: themes.error,
        fontSize: moderateScale(13),
        marginTop: 4,
    },
});
