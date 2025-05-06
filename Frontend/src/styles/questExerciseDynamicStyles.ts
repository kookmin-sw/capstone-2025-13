import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const dynamic = StyleSheet.create({
    missionTitle: {
        fontSize: width * 0.045,
    },
    mainText: {
        fontSize: width * 0.06,
    },
    sectionTitle: {
        fontSize: width * 0.045,
        marginTop: width * 0.15,
        marginBottom: width * 0.03,
    },
    uploadText: {
        fontSize: width * 0.04,
    },
    stepCount: {
        fontSize: width * 0.12,
        color: '#fff',
        fontWeight: 'bold',
    },
    stepGoal: {
        fontSize: width * 0.04,
        color: '#ccc',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});