const defaultTheme = {

    branding: {
        logo: "",
        width: 150,
        height: 150,
        splash_background: "#7B68EE",
        splash_image: "",
        is_splash_background_type: 1,  //1. for splash Background Color ****** 2. for splash Background image


    },

    auth_screen: {
        is_top_image: false,
        top_image: "",     // URL or local asset
        is_bottom_image: false,
        bottom_image: ""
    },
    company_logo: {
        logo: "",
        width: 150,
        height: 150
    },

    school_logo: {
        logo: "",
        width: 200,
        height: 200
    },
    theme: {
        primary: "#7B68EE",
        darkText: '#292D34',      // Main text
        mediumText: '#6B6B6B',    // Secondary text
        lightText: '#A0A0A0',
    },
    attachment: {
        isUpload: true,
        fileSize: "3mb",
        uploadType: ['image/*', 'pdf']
    },
    text_font_size: {
        large: 16,
        large_medium: 15,
        medium: 14,
        medium_small: 13,
        small: 12,
        extraSmall: 11,
    },
    heading_font_size: {
        h1: 28,
        h2: 26,
        h3: 24,
        h4: 20,
        h5: 18,
    },

    feature: {
        attendance: true,
        homework: true,
        exams: true,
        notifications: true
    },

    component: {
        addHome_work_component_name: "addHomeWorkComponent",
    },
    set_timeout: {
        crud: 500,
        toast_message: 3000
    }
};

export default defaultTheme;
