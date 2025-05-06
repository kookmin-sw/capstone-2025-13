import { StyleSheet, Dimensions } from 'react-native';
import fonts from '../constants/fonts';

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
        fontFamily: fonts.laundryBold,
        fontSize: width * 0.1,
        color: '#fff',
    },
    stepGoal: {
        fontFamily: fonts.laundryBold,
        fontSize: width * 0.035,
        color: '#ccc',
    },
    buttonText: {
        fontFamily: fonts.laundryBold,
        fontSize: width * 0.04,
        fontWeight: '600',
        color: '#fff',
    },
});