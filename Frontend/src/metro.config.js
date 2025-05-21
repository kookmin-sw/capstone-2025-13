// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// 기존 tflite 설정 유지
config.resolver.assetExts.push('tflite');

// jpeg-js(.cjs) 를 불러오기 위해 확장자 허용
config.resolver.sourceExts.push('cjs');

// buffer 폴리필 모듈 경로 지정
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  buffer: require.resolve('buffer'),
};

module.exports = config;
