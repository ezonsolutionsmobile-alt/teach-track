import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AppText from '../components/AppText';
import themes from '../themes/colors';
import { moderateScale, scale, verticalScale } from '../themes/sizes';
import { EditIcon, DeleteIcon, FileIcon, CalendarIcon1 } from '../assets/Icons';
import { useThemeStore } from '../store/useThemeStore';
import globalStyles from '../themes/globalStyles';
import { formatDate } from '../utils/formatDateType';
import AttachmentPreviewWebView from './AttachmentPreviewWebView';
import { useApiRoutesStore } from '../store/useApiRoutesStore';

export default function HomeworkHistoryListItem({
    item,
    onEdit,
    onRemove,
    onPreviewAttachment,
    activeTab
}) {

    const { theme } = useThemeStore();
    const [previewUrl, setPreviewUrl] = useState(null);
    const { assetRoutes } = useApiRoutesStore();
    const handlePreview = (url) => {
        setPreviewUrl(url);
    };
    const closePreview = () => setPreviewUrl(null);

    return (
        <>
            <View style={styles.card}>
                {/* Date */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center', // vertical center
                        backgroundColor: themes?.overlayGrey,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        gap: 4
                    }}
                >
                    <CalendarIcon1 width={18} height={22} color={theme?.theme?.primary} />
                    <AppText
                        style={{
                            color: theme?.theme?.dark_text,
                            fontSize: moderateScale(theme?.text_font_size?.large),
                            marginLeft: 4, // small space between icon and text
                        }}
                        weight="SemiBold"
                    >
                        {formatDate(item?.home_work_date, "DD-MM-YYYY")}
                    </AppText>
                </View>
                {activeTab == "Active" ? <View style={{ paddingHorizontal: 8 }}>
                    <AppText style={[styles.description, { fontSize: moderateScale(theme?.text_font_size?.large) }]}>{item?.home_work}</AppText>

                    {/* Actions */}
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <AppText
                            style={[
                                {
                                    color: theme?.theme?.primary,
                                    fontSize: moderateScale(theme?.text_font_size?.small)
                                }
                            ]}
                        >{formatDate(item?.created_at, "DD-MM-YYYY, h:mm a")}
                        </AppText>
                        <View style={styles.actions}>

                            {/* {Object?.keys(item?.attachments)?.length > 0 && (
                )} */}
                            {item?.docs && (
                                <TouchableOpacity
                                    onPress={() =>
                                        handlePreview(
                                             `${assetRoutes?.homework_docs + item?.docs}`,
                                            item?.docs?.toLowerCase().endsWith(".pdf") ? "pdf" : "image"
                                        )
                                    }
                                    style={styles.actionButton}>
                                    <FileIcon width={20} height={20} color={theme?.theme?.primary} type={item?.docs?.toLowerCase().endsWith(".pdf") ? "pdf" : "image"} />
                                </TouchableOpacity>

                            )}
                            <TouchableOpacity onPress={() => onEdit(item)} style={styles.actionButton}>
                                <EditIcon width={18} height={22} color={theme?.theme?.primary} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => onRemove(item)} style={styles.actionButton}>
                                <DeleteIcon width={18} height={22} color={themes.redText} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View> :
                    <View style={{ paddingHorizontal: 8 }}>
                        <AppText style={[styles.description, { fontSize: moderateScale(theme?.text_font_size?.medium_small) }]}>{item?.home_work}</AppText>

                        {/* Actions */}
                        {/* Actions */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <AppText
                                style={[
                                    styles.createdDate,
                                    {
                                        color: themes?.error,
                                        fontSize: moderateScale(theme?.text_font_size?.small),
                                    }
                                ]}
                            >{formatDate(item?.updated_at, "DD-MM-YYYY, h:mm a")}
                            </AppText>
                            {item?.docs && (
                                <TouchableOpacity
                                    onPress={() =>
                                        handlePreview(
                                            `https://www.urschooling.com/sms_main/public/assets/qvms/homework_docs/${item?.docs}`,
                                            item?.docs?.toLowerCase().endsWith(".pdf") ? "pdf" : "image"
                                        )
                                    }
                                    style={styles.actionButton}>
                                    <FileIcon width={20} height={20} color={theme?.theme?.primary} type={item?.docs?.toLowerCase().endsWith(".pdf") ? "pdf" : "image"} />
                                </TouchableOpacity>

                            )}
                        </View>
                    </View>
                }
            </View >
            <AttachmentPreviewWebView
                visible={!!previewUrl}
                previewUrl={previewUrl}
                onClose={closePreview}
                title="Attachment Preview"
                theme={theme}
            />
        </>
    );
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: globalStyles?.mainBoxWrapper?.paddingHorizontal,
        backgroundColor: themes.white,
        // paddingHorizontal: 8,
        // paddingVertical: 4,
        marginVertical: verticalScale(4),
        borderRadius: 10,
        borderWidth: 1,
        borderColor: themes.borderGrey,
    },

    date: {
        color: themes.mediumText,
        marginBottom: verticalScale(4),
    },

    description: {
        marginBottom: verticalScale(4),
        lineHeight: 20,
    },

    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },

    actionButton: {
        padding: 6,
        paddingHorizontal: scale(8),
    },
});