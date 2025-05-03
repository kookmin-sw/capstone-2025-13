import { StyleSheet, Dimensions } from 'react-native';
import fonts from '../constants/fonts';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#000',
    },
    scrollContent: {
    padding: width * 0.05,
    paddingBottom: width * 0.25,
    },
    title: {
    color: '#fff',
    marginTop: width * 0.03,
    },
    mission: {
    color: '#fff',
    fontWeight: 'bold',
    marginVertical: width * 0.02,
    },
    progressChart: {
    alignSelf: 'center',
    marginTop: width * 0.05,
    },
    sectionText: {
    color: '#fff',
    marginVertical: width * 0.04,
    },
    uploadBox: {
    backgroundColor: '#333',
    height: width * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    },
    uploadText: {
    color: '#ccc',
    },
    uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    },
    buttonWrapper: {
    position: 'absolute',
    bottom: 20,
    left: width * 0.05,
    right: width * 0.05,
    },
    sectionTitle: {
    fontFamily: fonts.laundryBold,
    color: "#fff94f",
    alignSelf: "flex-start",
    },
    completeButton: {
    backgroundColor: '#FF3D89',
    borderRadius: 50,
    paddingVertical: width * 0.04,
    alignItems: 'center',
    },
    chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: width * 0.05,
    },
    centerTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    },
});