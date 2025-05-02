import { StyleSheet, Dimensions } from "react-native";
import fonts from "../constants/fonts";

const { width, height } = Dimensions.get("window");

const questStageStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#17B96D",
  },
  street: {
    position: "absolute",
    right: width / 16,
    width: width,
    height: height,
    top: height * 0.25,
    zIndex: 3,
  },
  questTitle: {
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
});


export default questStageStyles;
