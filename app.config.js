export default {
    expo: {
        name: "SurveysFrontend",
        slug: "SurveysFrontend",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "myapp",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        ios: {
            supportsTablet: true
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#ffffff"
            }
        },
        web: {
            bundler: "metro",
            output: "single",
            favicon: "./assets/images/logo.png"
        },
        plugins: [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/splash-icon.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#ffffff"
                }
            ]
        ],
        experiments: {
            typedRoutes: true
        },
        extra: {
            API_DOMAIN: process.env.API_DOMAIN,
            FRONT_DOMAIN: process.env.FRONT_DOMAIN
        },
    }
}
