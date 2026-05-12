import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import AppText from '../components/AppText';
import AttachmentPreviewWebView from '../components/AttachmentPreviewWebView';
import NoDataFound from '../components/NoDataFound';
import themes from '../themes/colors';
import { moderateScale, verticalScale, scale } from '../themes/sizes';
import { EditIcon, DeleteIcon, FileIcon, CalendarIcon1 } from '../assets/Icons'; // <-- Eye icon imported
import { useThemeStore } from '../store/useThemeStore';
import { formatDate } from '../utils/formatDateType';
import { useHomeWorkStore } from '../store/useHomeWorkStore';
import { useApiRoutesStore } from '../store/useApiRoutesStore';
import moment from 'moment';

export default function HomeworkHistoryList({ data = [], onEdit, onRemove, selected, loadMore, onRefresh }) {
    // Retrieve current app theme from Zustand global store
    const { theme } = useThemeStore();
    const { count, refreshing, loadingMore } = useHomeWorkStore();
    const { assetRoutes } = useApiRoutesStore();

    const [previewUrl, setPreviewUrl] = useState(null);

    const handlePreview = (url) => {
        setPreviewUrl(url);
    };


    const closePreview = () => setPreviewUrl(null);


    const renderItem = ({ item }) => {
        return (
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
                <View style={{ paddingHorizontal: 8 }}>
                    <AppText style={[styles.description, {  color: theme?.theme?.dark_text,fontSize: moderateScale(theme?.text_font_size?.large) }]}>{item?.home_work}</AppText>

                    {/* Actions */}
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <AppText
                            style={[
                                {
                                    color: theme?.theme?.primary,
                                    fontSize: moderateScale(theme?.text_font_size?.small)
                                }
                            ]}
                        >
                            {formatDate(item?.created_at, "DD-MM-YYYY, h:mm a")}
                        </AppText>
                        <View style={styles.actions}>

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
                </View>
                {/* Description */}
            </View >
        );

    }
    const hasMore = data?.length < count;
    return (
        <>
            <FlatList
                data={data}
                scrollEventThrottle={16}
                // keyExtractor={(item) => item?.id?.toString()}
                keyExtractor={(item, index) => `${item?.id ?? index}-${index}`}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                refreshing={refreshing}
                onRefresh={onRefresh}
                onEndReached={loadMore}
                onEndReachedThreshold={0.2}
                ListFooterComponent={() => {
                    if ((loadingMore && data?.length > 0)) {
                        return <ActivityIndicator size="large" />;
                    }

                    if (hasMore && data.length > 0) {
                        return (
                            <AppText type='title' style={{ fontSize: moderateScale(theme?.text_font_size?.medium_small), textAlign: 'center', padding: 4 }} color={theme?.theme?.dark_text + "50"}>
                                Scroll to load more...
                            </AppText>
                        );
                    }

                    if (!hasMore && data.length > 0) {
                        return (
                            // <Text style={{ textAlign: 'center', padding: 10, color: 'gray' }}>
                            <AppText type='title' style={{ fontSize: moderateScale(theme?.text_font_size?.medium_small), textAlign: 'center', padding: 4 }} color={theme?.theme?.dark_text + "50"}>
                                No more data available
                            </AppText>
                        );
                    }

                    return null;
                }}
                ListEmptyComponent={<NoDataFound message={selected?.value ? "No Data Found" : 'Please select a year session first '} />}
            />
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
    listContainer: {
        paddingVertical: verticalScale(8),
        paddingBottom: verticalScale(8),
        flexGrow: 1
    },

    card: {
        backgroundColor: themes.white,
        // paddingHorizontal: 8,
        // paddingVertical: 4,
        marginVertical: verticalScale(4),
        borderRadius: 10,
        borderWidth: 1,
        borderColor: themes.borderGrey,
    },

    date: {
        marginBottom: verticalScale(4),
    },

    description: {
        // color: themes.darkText,
        marginTop: verticalScale(2),
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
