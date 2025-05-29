import dotenv from "dotenv"

const config = dotenv.config()

export default {
  expo: {
    name: "wooong",
    slug: "wooong",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/Images/wooong-logo.png",
    userInterfaceStyle: "light",
    newArchEnabled: false,
    splash: {
      image: "./assets/Images/wooong-logo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    plugins: [
      "expo-audio",
      "expo-video",
      "expo-secure-store",
      "react-native-health-connect",
      [
        "expo-build-properties",
        {
          android: {
            compileSdkVersion: 35,
            targetSdkVersion: 35,
            minSdkVersion: 26
          },
          ios: {
            deploymentTarget: "15.1"
          }
        }
      ],
      [
        "react-native-vision-camera",
        {
          cameraPermissionText: "$(PRODUCT_NAME) needs access to your Camera."
        }
      ],
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location."
        }
      ]
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "space.mori.wooong",
      entitlements: {
        "com.apple.developer.devicecheck.appattest-environment": "development",
        "aps-environment": "production",
        "com.apple.developer.healthkit": true
      },
      buildNumber: "109",
      appleTeamId: "Y56G5PTS2K",
      infoPlist: {
        NSCameraUsageDescription: "$(PRODUCT_NAME)가 당신의 카메라를 사용합니다.",
        NSHealthUpdateUsageDescription: "$(PRODUCT_NAME)가 걸음수 추적을 위해 건강 정보를 사용합니다.",
        ITSAppUsesNonExemptEncryption: false,
        LSMinimumSystemVersion: "15.1"
      },
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_IOS_API_KEY,
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/Images/wooong-logo.png",
        backgroundColor: "#ffffff"
      },
      package: "space.mori.wooong",
      versionCode: 90,
      permissions: [
        "android.permission.RECORD_AUDIO",
        "android.permission.MODIFY_AUDIO_SETTINGS",
        "android.permission.CAMERA",
        "android.permission.POST_NOTIFICATIONS",
        "android.permission.health.READ_STEPS",
        "android.permission.health.WRITE_STEPS",
        "android.permission.health.READ_ACTIVE_CALORIES_BURNED"
      ],
      config: {
        "googleMaps": {
          "apiKey": process.env.GOOGLE_MAPS_API_KEY
        }
      }
    },
    web: {
      favicon: "./assets/Images/wooong-logo.png"
    },
    extra: {
      eas: {
        projectId: "9be9ecfd-1267-47dd-9930-304a748660b1"
      }
    },
    owner: "wooong"
  }
}