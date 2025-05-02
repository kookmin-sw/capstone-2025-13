import { StyleSheet, Dimensions } from "react-native";

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
  questTitleTop: {
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
  }
});

export default questStageStyles;
