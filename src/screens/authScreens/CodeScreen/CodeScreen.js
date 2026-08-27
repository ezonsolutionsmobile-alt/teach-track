import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import AuthScreenWrapper from '../../../components/AuthScreenWrapper';
import AppText from '../../../components/AppText';
import AppButton from '../../../components/AppButton';
import LogoBox from '../../../components/LogoBox';
import MainBox from '../../../components/MainBox';
import { bg_image, bg_pattern } from '../../../assets';
import { codeSchema } from '../../../schemas/AuthSchema';
import { moderateScale, verticalScale } from '../../../themes/sizes';
import themes from '../../../themes/colors';
import FormInput from '../../../components/FormInput';
import { useAuthStore } from '../../../store/useAuthStore';
import { useThemeStore } from '../../../store/useThemeStore';
import { useUserStore } from '../../../store/useUserStore';
import Heading from '../../../components/GradientHeading';
import { GetEmployeeAppRouteList } from '../../../services/global/codeService';
import { showToast } from '../../../components/ShowToas';
import { useApiRoutesStore } from '../../../store/useApiRoutesStore';
import APP_CONFIG from '../../../config/app.config';

export default function CodeScreen({ navigation }) {
    // Retrieve current app theme from Zustand global store
    const { theme, loadStoredTheme, fetchTheme, isThemeLoading } = useThemeStore();
    const { setRoutes, setAssetRoutes, setSchoolCode, setConfigUrl } = useApiRoutesStore();

    const [isDisable, setIsDisable] = useState(false);


    const [focused, setFocused] = useState("");

    const { setCodeScreen, clearKeychainData, clearLocalAuth, user, token } = useAuthStore();
    const { profile } = useUserStore();
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: { schoolCode: theme?.auth_screen?.show_school_code || '' },
        resolver: yupResolver(codeSchema),
    });

    const onSubmit = async (data) => {
        setIsDisable(true)
        try {
            const res = await GetEmployeeAppRouteList({ code: data?.schoolCode })
            if (res?.data?.status) {
                setSchoolCode(data?.schoolCode)
                await clearLocalAuth()
                await clearKeychainData()
                const apiList = res?.data?.data?.api_list || [];
                const assetsApiList = res?.data?.data?.asset_list || [];
                setAssetRoutes(assetsApiList)
                setRoutes(apiList)
                // Find object containing config api
                const configObj = apiList.find(obj =>
                    obj?.get_employee_app_config_details
                );
                // Extract URL
                const configUrl = configObj?.get_employee_app_config_details;
                if (!configUrl) {
                    showToast("error", "Error", "Config URL not found");
                    return;
                }
                setConfigUrl(configUrl)
                // 1️⃣ Load cache instantly
                await loadStoredTheme();
                await fetchTheme(configUrl);
                if (!isThemeLoading) {
                    setCodeScreen(true)
                    navigation.replace('LoginScreen');

                }

            } else {
                setIsDisable(false)
                showToast("error", "Error", res?.data?.message || "Something went wrong")
            }
        } catch (err) {
            setIsDisable(false)
            console.log(err)
        }
    };

    return (
        <AuthScreenWrapper backgroundImage={bg_image} backgroundPattern={bg_pattern}>
            {/* Brand Logo */}
            <Heading title={APP_CONFIG?.companyName} />
            {/* Main auth box */}
            <MainBox paddingVertical={verticalScale(68)} style={{ marginTop: verticalScale(theme?.heading_font_size?.h3 - theme?.heading_font_size?.h5 || 6) }}>
                {/* Logo + Title */}
                <LogoBox
                    title="EmployeeDesk"
                    titleSize={theme?.heading_font_size?.h1} titleColor={theme?.theme?.dark_text}
                    width={theme?.company_logo?.width} height={theme?.company_logo?.height}
                    isCodeScreen={theme?.auth_screen?.show_school_code}
                    appLogo={true}
                />

                {/* School code input */}
                <FormInput
                    control={control}
                    name="schoolCode"
                    label="School Code"
                    type="text"
                    errors={errors}
                    //    show={show}
                    //    setShow={setShow}
                    focused={focused}
                    setFocused={setFocused}
                    style={styles.inputWrapper}
                />

                {/* Continue button */}
                <AppButton
                    title="Next"
                    onPress={handleSubmit(onSubmit)}
                    isLoading={isSubmitting}
                    disabled={isDisable}
                    fullWidth
                    style={styles.button}
                />

                {/* Terms & Conditions */}
                <View style={styles.termsContainer}>
                    <AppText weight="Regular" style={{ color: theme?.theme?.dark_text, fontSize: moderateScale(theme?.text_font_size?.medium_small) }}>
                        By continuing you agree with
                    </AppText>

                    <TouchableOpacity onPress={() => navigation.navigate('TermsAndConditions')}>
                        <AppText weight="Medium" style={{ color: theme?.theme?.primary, marginLeft: 4, fontSize: moderateScale(theme?.text_font_size?.medium_small) }}>
                            Terms & Conditions
                        </AppText>
                    </TouchableOpacity>

                    <AppText weight="Regular" style={{ color: theme?.theme?.dark_text, fontSize: moderateScale(theme?.text_font_size?.medium_small), paddingLeft: 4 }}>
                        and
                    </AppText>
                    <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
                        <AppText weight="Medium" style={{ color: theme?.theme?.primary, marginLeft: 4, fontSize: moderateScale(theme?.text_font_size?.medium_small) }}>
                            Privacy Policy
                        </AppText>
                    </TouchableOpacity>
                </View>
            </MainBox>
        </AuthScreenWrapper>
    );
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: themes.white,
        borderRadius: 16,
        marginBottom: 12,
    },
    button: {
        marginTop: moderateScale(10),
    },
    termsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    termsText: {
        color: themes.darkText,
    },

});
