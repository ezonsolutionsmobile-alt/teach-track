import { useEffect, useRef } from 'react';
import Sound from 'react-native-sound';

export const useSoundEffect = (soundFileName) => {
    const soundRef = useRef(null);

    useEffect(() => {
        // Category setup
        Sound.setCategory('Playback');

        // Sound load karna
        soundRef.current = new Sound(
            soundFileName,
            Sound.MAIN_BUNDLE,
            (error) => {
                if (error) {
                    console.log('Sound load error:', error);
                    return;
                }
                // console.log('Sound loaded successfully:', soundFileName);
            }
        );

        // Cleanup: Component unmount hone par sound resource free karna
        return () => {
            soundRef.current?.release();
        };
    }, [soundFileName]);

    const playSound = () => {
        if (soundRef.current) {
            soundRef.current.stop(() => {
                soundRef.current.setVolume(1.0);
                soundRef.current.play((success) => {
                    if (!success) {
                        console.log('Playback failed');
                    }
                });
            });
        }
    };

    return playSound;
};