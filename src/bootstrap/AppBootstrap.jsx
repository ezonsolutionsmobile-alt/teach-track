import React from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { useApiRoutesStore } from '../store/useApiRoutesStore';
import { useAuthStore } from '../store/useAuthStore';

const AppBootstrap = ({ children }) => {
    const [ready, setReady] = React.useState(false);
    const { loadCode } = useAuthStore()
    const hasRoutesHydrated = useApiRoutesStore(state => state.hasHydrated);

    React.useEffect(() => {
        const prepare = async () => {
            try {
                const themeStore = useThemeStore.getState();
                await loadCode()
                // 1️⃣ Load cached theme
                await themeStore.loadStoredTheme();

            } catch (err) {
                console.log("Bootstrap Error:", err);
            } finally {
                setReady(true);
            }
        };

        prepare();
    }, []);

    // Wait until BOTH ready
    if (!ready || !hasRoutesHydrated) {
        return null; // or Splash screen
    }

    return children;
};

export default AppBootstrap;