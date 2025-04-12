import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const questStageStyles = StyleSheet.create({
  street: {
    position: "absolute",
    top: width / 1.7,
    left: width / 2,
    transform: [{ translateX: -width / 2 }, { rotate: "50deg" }],
    width: width,
    height: width,
    opacity: 0.8,
    zIndex: 2,
  },
  goalImage: {
    position: "absolute",
    top: width / 2,
    left: width / 2.5,
    width: width * 0.15,
    height: width * 0.2,
    zIndex: 3,
  },
  stageOverlay: {
    position: "absolute",
    top: height * 0.33,
    width: "100%",
    paddingHorizontal: width * 0.1,
    gap: height * 0.06,
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