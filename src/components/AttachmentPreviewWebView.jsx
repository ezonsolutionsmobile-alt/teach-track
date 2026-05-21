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
    ToastAndroid, Alert,
    Share,
    PermissionsAndroid
} from 'react-native';
import AppText from './AppText';
import { CloseIcon } from '../assets/Icons';
import themes from '../themes/colors';
import Pdf from 'react-native-pdf';
import RNFetchBlob from 'react-native-blob-util';
import { moderateScale, verticalScale } from '../themes/sizes';
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
    const [cleanUrl, setCleanUrl] = useState(null);
    const isPdf = previewUrl?.toLowerCase().endsWith('.pdf');

    useEffect(() => {
        if (!visible || !previewUrl) {
            // 🔹 Jab modal close ho, toh saara cache aur paths instant reset karo
            setCleanUrl(null);
            setLocalPath(null);
            return;
        }

        setLoading(true);

        if (isPdf) {
            setCleanUrl(previewUrl);
            const downloadPdf = async () => {
                try {
                    const dirs = RNFetchBlob.fs.dirs;
                    const path = `${dirs.CacheDir}/${Date.now()}.pdf`;
                    await RNFetchBlob.config({ path }).fetch('GET', previewUrl);
                    setLocalPath(path);
                } catch (err) {
                    console.log('PDF download error:', err);
                    setLoading(false);
                }
            };
            downloadPdf();
        } else {
            setLocalPath(null);

            // 🔹 IMAGE CACHE BUSTER: URL ke aage dynamic timestamp lagao taake iOS cache bypass ho jaye
            const separator = previewUrl.includes('?') ? '&' : '?';
            const cacheBustedUrl = `${previewUrl}${separator}cb=${Date.now()}`;
            setCleanUrl(cacheBustedUrl);
        }
    }, [previewUrl, isPdf, visible]);

    if (!visible || !previewUrl) return null;

    // const handleDownload = async () => {
    //     if (!previewUrl) return;

    //     try {
    //         setDownloading(true);

    //         const fileExt = previewUrl.split('.').pop();
    //         const fileName = `file_${Date.now()}.${fileExt}`;
    //         const dirs = RNFetchBlob.fs.dirs;

    //         let path = Platform.OS === 'android'
    //             ? `${dirs.DownloadDir}/${fileName}`
    //             : `${dirs.DocumentDir}/${fileName}`;

    //         await RNFetchBlob.config({
    //             fileCache: true,
    //             addAndroidDownloads: {
    //                 useDownloadManager: true,
    //                 notification: true,
    //                 path: path,
    //                 description: 'File downloaded by app',
    //             },
    //         }).fetch('GET', previewUrl);

    //         if (Platform.OS === 'android') {
    //             ToastAndroid.show('File downloaded to Downloads', ToastAndroid.SHORT);
    //         } else {
    //             Alert.alert('Download', `File saved to Documents:\n${path}`);
    //         }

    //     } catch (err) {
    //         console.log('Download error:', err);
    //         Alert.alert('Download Failed', 'Unable to download file.');
    //     } finally {
    //         setDownloading(false);
    //     }
    // };

    const requestStoragePermission = async () => {
        if (Platform.OS !== 'android') return true;

        // Android 10 (API 29) aur usse neeche ke liye permission chahiye hoti hai
        if (Platform.Version <= 29) {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission Required',
                        message: 'App ko file save karne ke liye storage permission chahiye.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }

        // Android 11+ (API 30+) par Scoped Storage ki wajah se Download Manager ko permission nahi chahiye hoti
        return true;
    };


    // 🛠️ HELPER 1: URL se clean extension aur fileName generate karne ke liye
    const getFileExtensionAndName = (url, isPdf) => {
        const encodedUrl = encodeURI(url);
        const cleanUrlForExt = encodedUrl.split('?')[0];
        let fileExt = cleanUrlForExt.split('.').pop()?.toLowerCase();

        // Extension validation and smart fallback
        if (!fileExt || fileExt.length > 5 || fileExt.includes('/')) {
            if (isPdf) {
                fileExt = 'pdf';
            } else if (url?.toLowerCase().includes('png')) {
                fileExt = 'png';
            } else if (url?.toLowerCase().includes('jpeg') || url?.toLowerCase().includes('jpg')) {
                fileExt = 'jpg';
            } else {
                fileExt = 'bin';
            }
        }

        return {
            encodedUrl,
            fileExt,
            fileName: `Attachment_${Date.now()}.${fileExt}`
        };
    };

    // 🛠️ HELPER 2: Android Scoped Storage + Notification Flow
    const downloadAndroid = async (encodedUrl, fileName, fileExt) => {
        const dirs = RNFetchBlob.fs.dirs;
        const detectedMime = fileExt === 'pdf' ? 'application/pdf' : `image/${fileExt}`;

        const tempPath = `${dirs.CacheDir}/${fileName}`;
        const publicDownloadsDir = '/storage/emulated/0/Download';
        const targetPath = `${publicDownloadsDir}/${fileName}`;

        // 1. App Cache mein download karein
        const res = await RNFetchBlob.config({
            fileCache: true,
            path: tempPath
        }).fetch('GET', encodedUrl);

        if (res.info().status >= 400) {
            throw new Error(`Server returned status: ${res.info().status}`);
        }

        // 2. Check & Create Public Download folder
        const isDir = await RNFetchBlob.fs.isDir(publicDownloadsDir);
        if (!isDir) {
            await RNFetchBlob.fs.mkdir(publicDownloadsDir);
        }

        // 3. Move file to Public Downloads
        await RNFetchBlob.fs.cp(tempPath, targetPath);

        // 4. Cleanup Cache safely
        try {
            await RNFetchBlob.fs.unlink(tempPath);
        } catch (e) {
            console.log('Cache cleanup skipped:', e);
        }

        // 5. Media Scanner Run Karein (Pixel/Android Fix)
        await RNFetchBlob.fs.scanFile([{ path: targetPath, mime: detectedMime }]);

        // 6. Push Native Notification Bar Item
        try {
            if (RNFetchBlob.android) {
                RNFetchBlob.android.addCompleteDownload({
                    title: fileName,
                    description: 'Download Complete',
                    mime: detectedMime,
                    path: targetPath,
                    showNotification: true,
                });
            }
        } catch (notificationError) {
            console.log('Notification trigger error:', notificationError);
        }

        ToastAndroid.show('File saved to public Downloads', ToastAndroid.SHORT);
    };

    // 🛠️ HELPER 3: iOS Storage + Share Sheet Flow
    const downloadIOS = async (encodedUrl, fileName, fileExt) => {
        const dirs = RNFetchBlob.fs.dirs;
        const finalIosPath = `${dirs.DocumentDir}/${fileName}`;

        const res = await RNFetchBlob.config({
            fileCache: true,
            path: finalIosPath
        }).fetch('GET', encodedUrl);

        if (res.info().status >= 400) {
            throw new Error(`Server returned status: ${res.info().status}`);
        }

        const fileExists = await RNFetchBlob.fs.exists(finalIosPath);
        if (!fileExists) {
            throw new Error("File creation failed on disk");
        }

        const mimeType = fileExt === 'pdf' ? 'application/pdf' : `image/${fileExt}`;
        await Share.share({
            url: `file://${finalIosPath}`,
            type: mimeType,
            title: fileName
        });
    };

    // 🚀 MAIN FUNCTION: Jo button click par chalega (Ab yeh bilkul clean hai!)
    const handleDownload = async () => {
        if (!previewUrl) return;

        // 1. Permission Check
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) {
            Alert.alert('Permission Denied', 'Storage permission ke bina file save nahi ho sakti.');
            return;
        }

        try {
            setDownloading(true);

            // 2. Parse URL and get details
            const { encodedUrl, fileName, fileExt } = getFileExtensionAndName(previewUrl, isPdf);

            // 3. Platform wise execution
            if (Platform.OS === 'android') {
                await downloadAndroid(encodedUrl, fileName, fileExt);
            } else {
                await downloadIOS(encodedUrl, fileName, fileExt);
            }

        } catch (err) {
            console.log('Production Download Error:', err);
            Alert.alert(
                'Download Failed',
                'File download nahi ho saki. Koshish karein ke aapka internet theek ho.'
            );
        } finally {
            setDownloading(false);
        }
    };
    // 🔹 Clean close handler taake states instant flush hon 
    const handleClose = () => {
        setLoading(true);
        setCleanUrl(null);
        setLocalPath(null);
        onClose();
    };

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor={themes.white} />
            <Modal visible={visible} animationType="slide" transparent={false}>
                {/* <SafeAreaView style={{ flex: 1, backgroundColor: themes.white }}> */}


                {/* Header */}
                <View style={[styles.headerContainer,
                { height: Platform.OS === 'android' && verticalScale(50), paddingTop: Platform.OS == 'ios' && verticalScale(50) }]}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <TouchableOpacity onPress={handleClose} style={styles.headerButton}>
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
                        cleanUrl && (
                            <Image
                                key={cleanUrl}
                                source={{
                                    uri: cleanUrl,
                                    // 🔹 Force native layers to fetch a fresh request instead of local memory cache
                                    cache: 'reload'
                                }}
                                style={{
                                    flex: 1,
                                    width: '100%',
                                    resizeMode: 'contain',
                                    backgroundColor: themes.white
                                }}
                                onLoadStart={() => setLoading(true)}
                                onLoadEnd={() => setLoading(false)}
                                onError={() => setLoading(false)}
                            />
                        )
                    )}

                </View>
                {/* </SafeAreaView> */}

            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    headerContainer: {

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