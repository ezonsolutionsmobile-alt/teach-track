import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Image,
    ActivityIndicator,
    Platform,
    ToastAndroid, Alert
} from 'react-native';
import AppText from './AppText';
import { CloseIcon } from '../assets/Icons';
import themes from '../themes/colors';
import Pdf from 'react-native-pdf';
import RNFetchBlob from 'react-native-blob-util';
import { moderateScale } from '../themes/sizes';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AttachmentPreviewWebView({
    visible,
    onClose,
    previewUrl,
    title = 'Preview',
    theme
}) {
    const [loading, setLoading] = useState(true);
    const [localPath, setLocalPath] = useState(null);
    const [downloading, setDownloading] = useState(false);
    const isPdf = previewUrl?.toLowerCase().endsWith('.pdf');

    useEffect(() => {
        setLoading(true);
        if (isPdf && previewUrl) {
            const downloadPdf = async () => {
                try {
                    const dirs = RNFetchBlob.fs.dirs;
                    const path = `${dirs.CacheDir}/${Date.now()}.pdf`;
                    await RNFetchBlob.config({ path }).fetch('GET', previewUrl);
                    setLocalPath(path);
                } catch (err) {
                    console.log('PDF download error:', err);
                } finally {
                    setLoading(false);
                }
            };
            downloadPdf();
        } else {
            setLoading(false);
            setLocalPath(null);
        }
    }, [previewUrl, isPdf]);

    if (!visible || !previewUrl) return null;

    const handleDownload = async () => {
        if (!previewUrl) return;

        try {
            setDownloading(true); // show loader

            const fileExt = previewUrl.split('.').pop();
            const fileName = `file_${Date.now()}.${fileExt}`;
            const dirs = RNFetchBlob.fs.dirs;

            let path = Platform.OS === 'android'
                ? `${dirs.DownloadDir}/${fileName}`
                : `${dirs.DocumentDir}/${fileName}`;

            await RNFetchBlob.config({
                fileCache: true,
                addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: true,
                    path: path,
                    description: 'File downloaded by app',
                },
            }).fetch('GET', previewUrl);

            if (Platform.OS === 'android') {
                ToastAndroid.show('File downloaded to Downloads', ToastAndroid.SHORT);
            } else {
                Alert.alert('Download', `File saved to Documents:\n${path}`);
            }

        } catch (err) {
            console.log('Download error:', err);
            Alert.alert('Download Failed', 'Unable to download file.');
        } finally {
            setDownloading(false); // hide loader
        }
    };
    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <SafeAreaView style={{ flex: 1, backgroundColor: themes.white }}>

                <StatusBar barStyle="dark-content" backgroundColor={themes.white} />

                {/* Header */}
                <View style={styles.headerContainer}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <TouchableOpacity onPress={onClose} style={styles.headerButton}>
                            <CloseIcon width={24} height={24} color={themes.darkText} />
                        </TouchableOpacity>

                        <AppText style={{ color: theme?.theme?.dark_text, fontSize: moderateScale(theme?.text_font_size?.large), }}>{title}</AppText>
                    </View>

                    <TouchableOpacity onPress={handleDownload} style={styles.headerButton} disabled={downloading}>
                        {downloading ? (
                            <AppText weight='SemiBold' style={{ color: theme?.theme?.primary, fontSize: moderateScale(theme?.text_font_size?.medium) }}>Downloading...</AppText>
                        ) : (
                            <AppText weight='SemiBold' style={{ color: theme?.theme?.primary, fontSize: moderateScale(theme?.text_font_size?.medium), textDecorationLine: 'underline' }}>Download</AppText>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={{ flex: 1 }}>

                    {/* 🔄 Loader */}
                    {loading && (
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="large" />
                        </View>
                    )}

                    {/* 📄 PDF */}
                    {isPdf ? (
                        localPath ? (
                            <Pdf
                                source={{ uri: 'file://' + localPath }}
                                style={{ flex: 1 }}
                                onLoadComplete={() => setLoading(false)}
                                onError={(error) => {
                                    console.log('PDF load error:', error);
                                    setLoading(false);
                                }}
                            />
                        ) : (
                            <View style={styles.center}>
                                <ActivityIndicator />
                            </View>
                        )
                    ) : (
                        /* 🖼 Image */
                        <Image
                            source={{ uri: previewUrl }}
                            style={{
                                flex: 1,
                                width: '100%',
                                resizeMode: 'contain',
                                backgroundColor: themes.white
                            }}
                            onLoadStart={() => setLoading(true)}   // 🔥 important
                            onLoadEnd={() => setLoading(false)}
                            onError={() => setLoading(false)}
                        />
                    )}

                </View>
            </SafeAreaView>

        </Modal>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: themes.white,
    },
    headerButton: {
        padding: 6,
    },

    downloadText: {
    },
    loaderContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: themes.white,
        zIndex: 10,
    },
});