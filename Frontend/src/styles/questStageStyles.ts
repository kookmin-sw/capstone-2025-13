import { StyleSheet, Dimensions } from "react-native";
import fonts from "../constants/fonts";

const { width, height } = Dimensions.get("window");

const questStageStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#17B96D",
  },
  scrollContainer: {
    width: "100%",
  },
  street: {
    position: "absolute",
    right: width / 16,
    width: width,
    height: height,
    top: height * 0.25,
    zIndex: 3,
  },
  elementWrapper: {
    width: width * 0.23,
    marginVertical: height * 0.005,
    zIndex: 4,
  },
  questTitle: {
    width: width*0.7,
    position: "absolute",
    alignSelf: "center",
    zIndex: 3 
  },
  goalImage: {
    position: "absolute",
    top: width / 2.2,
    left: width / 1.6,
    width: width * 0.25,
    height: width * 0.2,
    zIndex: 3,
  },
  stageOverlay: {
    position: "absolute",
    top: height * 0.38,
    left: height * 0.03,
    width: "100%",
    paddingHorizontal: height * 0.0005,
    gap: height * 0.07,
    zIndex: 3,
  },
  stageWrapper: {
    position: "absolute",
    marginHorizontal: width * 0.22,
  },
  stage: {
    position: "absolute",
    width: width * 0.14,
    height: width * 0.14,
    zIndex: 4,
  },
  iconWrapper:{
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center' 
  },
  cloverIcon:{
    position: 'absolute',
    top: -height * 0.04,
    width: width * 0.2,  
    height: width * 0.18, 
    marginRight: width * 0.00001, 
    zIndex: 2,

  },
  textWrapper: {
    position: "absolute",
    top: width * 0.8,
    right: width * 0.1,
    alignItems: "flex-end",
    zIndex: 4,
  },
  lineLargeWrapper: {
    position: "relative",
  },
  lineSmallWrapper: {
    position: "relative",
    marginTop: height * 0.005,
  },
  shadowTextLarge: {
    position: "absolute",
    color: "#18854B",
    fontSize: width * 0.08,
    textShadowColor: "#18854B",
    textShadowOffset: { width: -width * 0.005, height: width * 0.005 },
    textShadowRadius: width * 0.0025,
    fontFamily:fonts.laundryBold,
  },
  mainTextLarge: {
    color: "white",
    fontSize: width * 0.08,
    fontFamily:fonts.laundryBold,
  },
  shadowTextSmall: {
    position: "absolute",
    color: "#18854B",
    fontSize: width * 0.06,
    fontFamily:fonts.laundryBold,
    textShadowColor: "#18854B",
    textShadowOffset: { width: -width * 0.005, height: width * 0.005 },
    textShadowRadius: width * 0.0025,
  },
  mainTextSmall: {
    color: "white",
    fontSize: width * 0.06,
    fontFamily:fonts.laundryBold,
  },
  fullSizeImage: {
    width: "100%",
    height: "100%",
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


export default questStageStyles;
