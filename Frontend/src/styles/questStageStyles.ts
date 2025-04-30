import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const questStageStyles = StyleSheet.create({
  street: {
    position: "absolute",
    top: width / 1.7,
    left: width / 7,
    width: width * 0.8,
    height: height * 0.59, 
    zIndex: 2,
  },
  goalImage: {
    position: "absolute",
    top: width / 2.4,
    left: width / 4,
    width: width * 0.25,
    height: width * 0.2,
    zIndex: 3,
  },
  stageOverlay: {
    position: "absolute",
    top: height * 0.38,
    left: height * 0.03,
    width: "100%",
    paddingHorizontal: height* 0.0005,
    gap: height * 0.07,
    zIndex: 3,
  },
  stageWrapper: {
    marginHorizontal: width * 0.22,
  },
  missionWrapper: {
    position: "absolute",
    bottom: height * 0.0003,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 99,
  },
});


export default questStageStyles;