import React, { useMemo } from 'react';
import {
    Modal,
    View,
    FlatList,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import AppText from '../AppText';
import { moderateScale, scale, verticalScale } from '../../themes/sizes';
import { useThemeStore } from '../../store/useThemeStore';
import AppButton from '../AppButton';
import NoDataFound from '../NoDataFound';
import themes from '../../themes/colors';
import { formatDate } from '../../utils/formatDateType';

const CheckHistoryModal = ({
    visible,
    onClose,
    data = [],
    selectedDay,
    loading
}) => {
    const { theme } = useThemeStore();

    const groupedData = useMemo(() => {
        return data.map(item => ({
            checkIn: item.check_type_in,
            checkOut: item.check_type_out,
        }));
    }, [data]);

    const renderItem = ({ item }) => {
        return (
            <View style={styles.pairContainer}>

                <View style={styles.row}>
                    <View style={[styles.badge, { backgroundColor: '#e6f9f0' }]}>
                        <AppText style={{ color: '#2e7d32' }}>
                            Check In
                        </AppText>
                    </View>
                    <AppText>{item?.checkIn || "--:--"}</AppText>
                </View>

                <View style={styles.row}>
                    <View style={[styles.badge, { backgroundColor: '#ffe5e5' }]}>
                        <AppText style={{ color: '#d32f2f' }}>
                            Check Out
                        </AppText>
                    </View>
                    <AppText>{item?.checkOut || "--:--"}</AppText>
                </View>

                <View style={styles.pairBorder} />

            </View>
        );
    };

    if (!visible) return null;

    return (
        <Modal transparent animationType="fade">
            <View style={styles.overlay}>

                <View style={styles.modalBox}>

                    {/* TITLE */}
                    <AppText
                        weight='Bold'
                        style={[
                            styles.title,
                            { fontSize: moderateScale(theme?.heading_font_size?.h4) }
                        ]}
                    >
                        Check In/Out History
                    </AppText>

                    {/* DATE */}
                    <AppText
                        weight="Medium"
                        style={{
                            textAlign: 'center',
                            paddingBottom: verticalScale(6),
                            marginTop: verticalScale(2),
                            borderBottomWidth: 1,
                            borderColor: themes.borderGrey,
                            borderStyle: "dashed",
                            fontSize: theme?.text_font_size?.medium
                        }}
                        color={theme?.theme?.primary}
                    >
                        {formatDate(
                            new Date(
                                Number(selectedDay?.year),
                                Number(selectedDay?.month) - 1,
                                Number(selectedDay?.date)
                            ),
                            null,
                            true,
                            "full"
                        )}
                    </AppText>

                    {/* 🔥 FLATLIST WITH LOADER */}
                    <FlatList
                        data={groupedData}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}

                        // 🔥 LOADER INSIDE FLATLIST
                        ListFooterComponent={
                            loading ? (
                                <View style={styles.loaderBox}>
                                    <ActivityIndicator size="small" color={theme?.theme?.primary} />
                                    <AppText style={{ marginTop: 6 }}>
                                        Please wait...
                                    </AppText>
                                </View>
                            ) : null
                        }

                        ListEmptyComponent={
                            !loading && (
                                <NoDataFound message={"No Data Found"} />
                            )
                        }
                    />
                    <AppButton title="Close" onPress={onClose} fullWidth />
                </View>
            </View>
        </Modal>
    );
};

export default CheckHistoryModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: '#00000070',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalBox: {
        width: '90%',
        maxHeight: '70%',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: scale(12),
        paddingTop: verticalScale(12),
        paddingBottom: verticalScale(4)
    },

    title: {
        textAlign: 'center',
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },

    pairContainer: {
        paddingVertical: 4,
    },

    pairBorder: {
        height: 1,
        backgroundColor: '#eee',
        marginTop: 4,
    },

    badge: {
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 6,
    },

    // 🔥 LOADER STYLE
    loaderBox: {
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
});