import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import AppText from '../../../components/AppText';
import FormInput from '../../../components/FormInput';
import AppButton from '../../../components/AppButton';
import LogoBoxSkeleton from '../../../components/Skeletons/LogoBoxSkeleton';
import LogoBox from '../../../components/LogoBox';
import MainBox from '../../../components/MainBox';
import AuthScreenWrapper from '../../../components/AuthScreenWrapper';
import { loginSchema } from '../../../schemas/AuthSchema';
import { loginService } from '../../../services/auth/authService';
import { useAuthStore } from '../../../store/useAuthStore';
import { moderateScale, verticalScale } from '../../../themes/sizes';
import { bg_image, bg_pattern } from '../../../assets';
import { useThemeStore } from '../../../store/useThemeStore';
import ErrorModal from '../../../components/Modals/ErrorModal';
import Heading from '../../../components/GradientHeading';
import { useApiRoutesStore } from '../../../store/useApiRoutesStore';
import Recaptcha from 'react-native-recaptcha-that-works';
import QuickLoginSection from '../../../components/QuickLoginSection';
import ReactNativeBiometrics from 'react-native-biometrics';
import * as Keychain from "react-native-keychain";
import EnableBiometricModal from '../../../components/Modals/EnableBiometricModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_BIOMETRIC_KEY, STORAGE_KEY } from '../../userScreens/ProfileScreen/SettingsScreen';
import { showToast } from '../../../components/ShowToas';
import { useTabStore } from '../../../store/useTabStore';

export default function LoginScreen({ navigation }) {
    const { theme, fetchTheme } = useThemeStore();
    const { setActiveTab, setLastHomeScreen } = useTabStore();
    const [show, setShow] = useState({ password: false });
    const [focused, setFocused] = useState("");

    const [errorModal, setErrorModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDisable, setIsDisable] = useState(false);

    const { routes } = useApiRoutesStore.getState();
    const [captchaVisible, setCaptchaVisible] = useState(false);
    const pendingForm = useRef(null);
    const recaptchaRef = useRef(null);
    const [isEnabled, setIsEnabled] = useState(false);
    const [loginResponse, setLoginResponse] = useState(null);
    const [showBiometricModal, setShowBiometricModal] = useState(false);


    const rnBiometrics = new ReactNativeBiometrics();

    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: yupResolver(loginSchema),
    });

    const handleBiometricLogin = async () => {
        try {
            // 1. Check karein ki sensor available hai (FaceID/TouchID/Biometrics)
            const { available, biometryType } = await rnBiometrics.isSensorAvailable();
            console.log(available, "availableavailableavailable><<><><><><", biometryType)
            if (!available) {
                console.log(biometryType, "biometryTypebiometryType")
                Alert.alert("Biometrics not available", "Please enable Face ID or Fingerprint in your device settings.");
                return;
            }
            const { success } = await rnBiometrics.simplePrompt({
                promptMessage: 'Login with Face ID / Fingerprint',
            });

            if (!success) return;

            const credentials = await Keychain.getGenericPassword({ service: APP_BIOMETRIC_KEY });
            console.log(credentials, "credentialscredentialscredentials")
            if (!credentials) {
                Alert.alert("No saved session found. Please login again.");
                return;
            }
            const token = credentials.password;
            // 👉 same structure as login response
            const storedUser = useAuthStore.getState().user;

            useAuthStore.getState().setAuth(
                token,
                storedUser,
            );

            setActiveTab('HomeStack')
            setLastHomeScreen('HomeScreen')

        } catch (e) {
            console.log("biometric error:", e);
        }
    };


    // Close reCAPTCHA modal
    const handleCaptchaClose = () => {
        setIsLoading(false);
        setIsDisable(false);
        setCaptchaVisible(false);        // hide overlay
        recaptchaRef.current.close();
    };

    const resetToHome = () => {
        setIsDisable(false)
        setActiveTab('HomeStack')
        setLastHomeScreen('HomeScreen')
    }

    // Trigger reCAPTCHA on login press
    const onSubmit = async (data) => {

    pendingForm.current = data;
        recaptchaRef.current.open(); // shows reCAPTCHA checkbox
        setCaptchaVisible(true)

        // const body = {
        //     email: data.email,
        //     password: data.password,
        //     // recaptcha_token: token,
        // };
        // try {
        //     setIsLoading(true)
        //     setIsDisable(true)
        //     const res = await loginService(routes?.login, body);
        //     if (res?.data?.status) {
        //         const { access_token, user_details } = res?.data;

        //         const biometricEnabled = await AsyncStorage.getItem(STORAGE_KEY);

        //         if (biometricEnabled === "true") {
        //             useAuthStore.getState().setAuth(
        //                 access_token,
        //                 user_details?.data
        //             );
        //             resetToHome()
        //             setShowBiometricModal(false);

        //         } else {
        //             setLoginResponse(res?.data)
        //             // Agar enabled nahi hai toh Modal dikhao
        //             setShowBiometricModal(true);
        //         }


        //     } else {
        //         setErrorModal(true)
        //         setIsDisable(false)
        //         setErrorMsg(res?.data?.message || "Login failed");
        //     }
        // } catch (err) {
        //     console.log(err);
        //     Alert.alert("Something went wrong");
        // } finally {
        //     setIsLoading(false)
        //     setCaptchaVisible(false)
        // }
    };
    // Handle token from reCAPTCHA v2
    const handleCaptchaVerify = async (token) => {
        const data = pendingForm.current;

        const body = {
            email: data.email,
            password: data.password,
            recaptcha_token: token,
        };
        try {
            setIsLoading(true)
            setIsDisable(true)
            const res = await loginService(routes?.login, body);
            if (res?.data?.status) {
                  await useAuthStore?.getState()?.clearKeychainData()
                const { access_token, user_details } = res?.data;

                const biometricEnabled = await AsyncStorage.getItem(STORAGE_KEY);

                if (biometricEnabled === "true") {
                    useAuthStore.getState().setAuth(
                        access_token,
                        user_details?.data
                    );
                    resetToHome()
                    setShowBiometricModal(false);

                } else {
                    setLoginResponse(res?.data)
                    // Agar enabled nahi hai toh Modal dikhao
                    setShowBiometricModal(true);
                }


            } else {
                setErrorModal(true)
                setIsDisable(false)
                setErrorMsg(res?.data?.message || "Login failed");
            }
        } catch (err) {
            console.log(err);
            Alert.alert("Something went wrong");
        } finally {
            setIsLoading(false)
            setCaptchaVisible(false)
        }
    };




    const handleBiometricFlow = async (enableBiometric = false) => {
        try {
            const { access_token, user_details } = loginResponse;

            // 1. Always set auth first
            useAuthStore.getState().setAuth(
                access_token,
                user_details?.data
            );

            // 2. If biometric enabled
            if (enableBiometric) {
                await AsyncStorage.setItem(STORAGE_KEY, "true");

                await Keychain.setGenericPassword("biometric", access_token, {
                    service: APP_BIOMETRIC_KEY,
                });
            }

            resetToHome();
            setShowBiometricModal(false);
            // 4. Toast message
            showToast(
                "success",
                "",
                enableBiometric
                    ? "Biometric login enabled!"
                    : "Login successful!"
            );

        } catch (error) {
            console.log("Error in biometric flow:", error);
        }
    };

    console.log(isEnabled, "isEnabledisEnabledisEnabledisEnabledisEnabledisEnabled")
    return (
        <AuthScreenWrapper backgroundImage={bg_image} backgroundPattern={bg_pattern}>
            {/* Error Modal */}
            <ErrorModal visible={errorModal} onClose={() => setErrorModal(false)} message={errorMsg} />

            {/* Heading */}
            <Heading title="EZONSOLUTION" />

            <MainBox style={{ marginTop: verticalScale(theme?.heading_font_size?.h3 - theme?.heading_font_size?.h5 || 6) }}>
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
                {/* Login Button */}
                <AppButton
                    title="Sign In"
                    onPress={handleSubmit(onSubmit)}
                    style={styles.button}
                    isLoading={isLoading}
                    disabled={isDisable}
                    fullWidth
                />

                <QuickLoginSection onEnable={handleBiometricLogin} isEnabled={isEnabled} setIsEnabled={setIsEnabled} />
                {/* Forgot Password */}
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
                    <AppText type="body" weight="Medium" style={[styles.forgotText, { color: theme?.theme?.primary, fontSize: moderateScale(theme?.text_font_size?.medium) }]}>
                        Forgot Password?
                    </AppText>
                </TouchableOpacity>

                {/* Back to Code */}
                <View style={styles.codeContainer}>
                    <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.replace('CodeScreen')}>
                        <AppText type="body" weight="Regular" style={{ color: theme?.theme?.dark_text, fontSize: moderateScale(theme?.text_font_size?.medium_small) }}>
                            Back To School
                        </AppText>
                        <AppText type="body" weight="Medium" style={[styles.codeText, { color: theme?.theme?.primary, fontSize: moderateScale(theme?.text_font_size?.medium) }]}>
                            Code
                        </AppText>
                    </TouchableOpacity>
                </View>
            </MainBox>

            {/* reCAPTCHA v2 Component */}
            <Recaptcha
                ref={recaptchaRef}
                siteKey={theme?.frontend_recaptcha_key} // replace with your actual site key
                baseUrl="https://urschooling.com" // replace with your domain
                onVerify={handleCaptchaVerify}
                onClose={handleCaptchaClose}
                size="normal"
                headerComponent={
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            padding: 10,
                            backgroundColor: '#605c5c', // optional: give header a subtle background
                            opacity: 0.8
                        }}
                    >
                        <TouchableOpacity
                            onPress={handleCaptchaClose}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 18,
                                backgroundColor: '#ffffff',
                                justifyContent: 'center',
                                alignItems: 'center',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.2,
                                shadowRadius: 2,
                                elevation: 3, // for Android shadow
                                opacity: 1
                            }}
                        >
                            <AppText style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>×</AppText>
                        </TouchableOpacity>
                    </View>
                }
            />
            {/* Custom close button overlay */}
            {/* {captchaVisible && (
                <Modal transparent animationType="fade">
                    <View style={{
                        flex: 1,
                        justifyContent: 'flex-start',
                        alignItems: 'flex-end',
                        padding: 10,
                        backgroundColor: 'rgba(0,0,0,0.2)'  // optional overlay darkening
                    }}>
                        <TouchableOpacity
                            onPress={handleCaptchaClose}
                            style={{
                                width: 35,
                                height: 35,
                                borderRadius: 18,
                                backgroundColor: 'white',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <AppText style={{ fontSize: 18, fontWeight: 'bold' }}>×</AppText>
                        </TouchableOpacity>
                    </View>
                </Modal>
            )} */}

            <EnableBiometricModal
                visible={showBiometricModal}
                onEnable={() => handleBiometricFlow(true)}
                onSkip={() => handleBiometricFlow(false)}
            />
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