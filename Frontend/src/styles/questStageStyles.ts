import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const questStageStyles = StyleSheet.create({
  street: {
    position: "absolute",
    top: width / 2,
    left: width / 4.5,
    width: width * 0.7,
    height: height * 0.75, 
    zIndex: 2,
  },
  goalImage: {
    position: "absolute",
    top: width / 2.4,
    left: width / 1.9,
    width: width * 0.25,
    height: width * 0.2,
    zIndex: 3,
  },
  stageOverlay: {
    position: "absolute",
    top: height * 0.36,
    left: height * 0.02,
    width: "100%",
    paddingHorizontal: width * 0.006,
    gap: height * 0.12,
    zIndex: 3,
  },
  stageWrapper: {
    marginHorizontal: width * 0.22,
  },
  missionWrapper: {
    position: "absolute",
    bottom: height * 0.05,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 99,
  },
});


export default questStageStyles;