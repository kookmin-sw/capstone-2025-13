module.exports = {
    presets: ['babel-preset-expo'],
    plugins: [
        ['module:react-native-dotenv', {
            moduleName: '@env',
            path: '.env',
            blacklist: null,
            whitelist: null,
            safe: true,
            allowUndefined: true,
        }],
        ['react-native-worklets-core/plugin'],
        ['react-native-reanimated/plugin']
    ]
}