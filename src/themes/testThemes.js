const defaultTheme = {
    appName: "EduTrack",

    branding: {
        logo: "",
        splashBackground: "#bf0354",
        splashImage: "",
        useGradient: true,
        gradients: [
            { type: "linear", colors: ["#bf0354", "#e7650d"], angle: 45 },
            { type: "linear", colors: ["#12233b", "#455c73"], angle: 90 },
            { type: "radial", colors: ["#e7650d", "#bf0354"], center: { x: 0.5, y: 0.5 }, radius: 0.8 }
        ],

        authScreens: {
            isTopImage: false,
            topImage: "",     // URL or local asset
            isBottomImage: false,
            bottomImage: ""
        }
    },
    companyLogo: {
        src: "",
        width: 120,
        height: 40
    },

    school: {
        logo: {
            src: "",
            width: 100,
            height: 35
        }
    },
    theme: {
        primary: "#e7650d",
        secondary: "#12233b",
        background: "#455c73",
        card: "#ffffff",
        text: "#1e293b",
        radius: 10,
        buttonStyle: "rounded",

        // shadows
        shadow: {
            light: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
            medium: { shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 5 },
            heavy: { shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 8 }
        },

        // gradients
        useGradientForButtons: true,
        buttonGradients: [
            { type: "linear", colors: ["#e7650d", "#f9a825"], angle: 45 },
            { type: "linear", colors: ["#12233b", "#455c73"], angle: 90 },
            { type: "radial", colors: ["#00C875", "#2F80ED"], center: { x: 0.5, y: 0.5 }, radius: 0.8 }
        ],
        useGradientForCards: false,
        cardGradients: [
            { type: "linear", colors: ["#e7650d", "#f9a825"], angle: 45 },
            { type: "linear", colors: ["#12233b", "#455c73"], angle: 90 },
            { type: "radial", colors: ["#00C875", "#2F80ED"], center: { x: 0.5, y: 0.5 }, radius: 0.8 }
        ],

        // spacing & sizing
        spacing: {
            padding: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
            paddingHorizontal: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
            paddingVertical: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },

            margin: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
            marginHorizontal: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
            marginVertical: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },

            gap: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 }
        },

        size: {
            buttonHeight: 48,
            cardHeight: 120,
            headerHeight: 60,
            footerHeight: 50
        },

        board: {
            default: { width: 1, color: "#E5E5EA", style: "solid", radius: 10 },
            top: { width: 2, color: "#bf0354", style: "solid" },
            bottom: { width: 2, color: "#12233b", style: "dashed" },
            left: { width: 1, color: "#e7650d", style: "solid" },
            right: { width: 1, color: "#455c73", style: "dotted" }
        }
    },

    fonts: {
        family: "System",
        small: 12,
        medium: 14,
        large: 18,
        heading: 22,
        lineHeight: 1.5,
        letterSpacing: 0
    },

    features: {
        attendance: true,
        homework: true,
        exams: true,
        notifications: true,
        maintenance: false
    },

    layout: {
        // sidebar: "icon-label",
        fixedHeader: true,
        compact: false
    }
};

export default defaultTheme;
