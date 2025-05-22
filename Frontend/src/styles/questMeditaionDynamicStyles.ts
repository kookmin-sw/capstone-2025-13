import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const dynamic = StyleSheet.create({
    timerText: {
        fontSize: width * 0.22,
        marginVertical: width * 0.05,
    },
    youtubeWrapper: {
        width: width * 0.9,
        height: width * 0.5,
        marginBottom: width * 0.05,
    },
    button: {
        paddingHorizontal: width * 0.15,
        paddingVertical: width * 0.04,
        bottom: width * 0.1,
    },
    buttonText: {
        fontSize: width * 0.045,
    },
    missionTitle: {
        fontSize: width * 0.045,
        marginTop: width * 0.03,
    },
    mainText: {
        fontSize: width * 0.06,
    },
    warningTitle: {
        fontSize: width * 0.045,
        marginTop: width * 0.04,
        marginBottom: width * 0.02,
    },
    description: {
        fontSize: width * 0.035,
        marginBottom: width * 0.01,
    },
    sectionTitle: {
        fontSize: width * 0.045,
        marginTop: width * 0.15,
        marginBottom: width * 0.03,
    },
});