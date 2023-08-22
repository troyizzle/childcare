import { ExpoConfig, ConfigContext } from "@expo/config";

const CLERK_PUBLISHABLE_KEY = "pk_test_cmVsYXhpbmctd2VyZXdvbGYtOTcuY2xlcmsuYWNjb3VudHMuZGV2JA";

const defineConfig = (_ctx: ConfigContext): ExpoConfig => ({
  name: "childcare",
  slug: "childcare",
  scheme: "childcare",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#2e026d",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.troyizzle.daycare",
    buildNumber: "28.0.0"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#2e026d",
    },
  },
  extra: {
    eas: {
      projectId: "60f08b66-4931-4110-8583-3275f751e295",
    },
    CLERK_PUBLISHABLE_KEY,
  },
  plugins: ["./expo-plugins/with-modify-gradle.js"],
});

export default defineConfig;
