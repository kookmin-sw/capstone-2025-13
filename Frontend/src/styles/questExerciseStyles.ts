import { StyleSheet, Dimensions } from 'react-native';
import fonts from '../constants/fonts';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#000',
    },
    scrollContent: {
    padding: width * 0.05,
    paddingBottom: width * 0.25,
    },
    backButtonWrapper: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        marginTop: width * 0.05,
     },
    title: {
    marginLeft: width * 0.04,
    color: '#fff',
    marginTop: width * 0.03,
    fontFamily: fonts.laundryBold,
    },
    mission: {
    marginLeft: width * 0.04,
    color: '#fff',
    fontWeight: 'bold',

    fontFamily: fonts.laundryBold,
    },
    progressChart: {
    alignSelf: 'center',
    marginTop: width * 0.05,
    },
    sectionText: {
    color: '#fff',
    marginVertical: width * 0.04,
    fontFamily: fonts.laundryBold,
    },
    uploadBox: {
    marginTop: width * 0.03,
    backgroundColor: '#333',
    height: width * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    },
    uploadText: {
    color: '#ccc',
    fontFamily: fonts.laundryBold,
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
    alignItems: 'center',
    },
    sectionTitle: {
    fontFamily: fonts.laundryBold,
    color: "#fff94f",
    alignSelf: "flex-start",
    },
    warningTitle: {
        color: "#fff",
        fontFamily: fonts.laundry,
        fontSize: width * 0.04,
      },
      description: {
        color: "#ccc",
        fontFamily: fonts.laundry,
        fontSize: width * 0.03,
        marginVertical: height * 0.004,
        lineHeight: width * 0.045,
      },
    completeButton: {
    fontFamily: fonts.laundryBold,
    backgroundColor: '#FF3D89',
    borderRadius: 20,
    width: width* 0.4,
    paddingVertical: width * 0.04,
    alignItems: 'center',
    },
    chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: width * 0.01,
    },
    centerTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    marginTop: width * 0.05,
    fontFamily: fonts.laundryBold,
    },
    modalContent: {
      maxWidth: "90%",
      backgroundColor: "#fff",
      borderRadius: 20,
      paddingVertical: 20,
      paddingHorizontal: 24,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4,
      position: "absolute",
      top: "40%",  // 화면 위쪽에서 30% 위치
    },
});