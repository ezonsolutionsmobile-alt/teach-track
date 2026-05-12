// navigation/AuthStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/authScreens/LoginScreen/LoginScreen';
import SignUpScreen from '../screens/authScreens/SignupScreen/SignupScreen';
import ForgotPasswordScreen from '../screens/authScreens/ForgotPasswordScreen/ForgotPasswordScreen';
import CodeScreen from '../screens/authScreens/CodeScreen/CodeScreen';
import OtpScreen from '../screens/authScreens/ForgotPasswordScreen/OtpScreen';
import ResetPasswordScreen from '../screens/authScreens/ForgotPasswordScreen/ResetPasswordScreen';
import PrivacyPolicyScreen from '../screens/legal/PrivacyPolicyScreen';
import TermsAndConditionsScreen from '../screens/legal/TermsAndConditionsScreen';
import { useAuthStore } from '../store/useAuthStore';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  const isCodeScreen = useAuthStore((state) => state?.isCodeScreen);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}
      initialRouteName={isCodeScreen ? "LoginScreen" : "CodeScreen"}
    >
      {/* <Stack.Screen name="SplashScreen" component={SplashScreen} /> */}
      {/* <Stack.Screen name="CodeScreen" component={CodeScreen} /> */}
      <Stack.Screen name="CodeScreen" component={CodeScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />


      {/* Legal / Policy Screens */}
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ title: 'Privacy Policy' }}
      />
      <Stack.Screen
        name="TermsAndConditions"
        component={TermsAndConditionsScreen}
        options={{ title: 'Terms & Conditions' }}
      />
    </Stack.Navigator>
  );
}
