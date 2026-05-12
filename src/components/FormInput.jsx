import React from "react";
import { View, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import { TextInput } from "react-native-paper";
import AppText from "./AppText";
import { EyeIcon, EyeOffIcon } from "../assets/Icons";
import themes from "../themes/colors";
import { moderateScale } from "../themes/sizes";
import { useThemeStore } from "../store/useThemeStore";

export default function FormInput({
    control,
    name,
    label,
    errors,
    style,
    type = "text", // "text", "email", "password"
    show,
    setShow,
    focused,
    setFocused,
    keyboardType = "default",
}) {
    // Retrieve current app theme from Zustand global store
    const { theme } = useThemeStore();

    const isPassword = type === "password";

    return (
        <View style={style}>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        label={label}
                        value={value}
                        onChangeText={onChange}
                        secureTextEntry={isPassword && !show?.[name]}
                        mode="outlined"
                        style={[styles.input, { fontFamily: 'Inter Regular', height: moderateScale(38), fontSize: moderateScale(theme?.heading_font_size?.h5) }]}
                        labelStyle={{ fontFamily: 'Inter Regular' }} // <-- label font
                        keyboardType={keyboardType}
                        autoCapitalize={"none"}
                        activeOutlineColor={errors[name] ? themes.redText : theme?.theme?.primary}
                        outlineColor={errors[name] ? themes.redText : theme?.theme?.medium_text}
                        onFocus={() => setFocused(name)}
                        onBlur={() => setFocused("")}
                        right={
                            isPassword ? (
                                <TextInput.Icon
                                    icon={() =>
                                        show[name] ? (
                                            <EyeOffIcon
                                                width={22}
                                                height={22}
                                                color={focused === name ? theme?.theme?.primary : theme?.theme?.medium_text}
                                            />
                                        ) : (
                                            <EyeIcon
                                                width={22}
                                                height={22}
                                                color={focused === name ? theme?.theme?.primary : theme?.theme?.medium_text}
                                            />
                                        )
                                    }
                                    onPress={() => setShow((p) => ({ ...p, [name]: !p[name] }))}
                                />
                            ) : null
                        }

                    />

                )}
            />
            {errors[name] && (
                <AppText weight="Regular" style={[styles.error, { fontSize: moderateScale(theme?.text_font_size?.medium_small) }]}>
                    {errors[name].message}
                </AppText>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: themes.white,
        borderRadius: 16,
        // fontSize: moderateScale(18),
    },
    error: {
        color: themes.redText,
        // fontSize: moderateScale(13),
        marginTop: 4,
    },
});
