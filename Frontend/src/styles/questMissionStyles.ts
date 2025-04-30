import { StyleSheet, Dimensions } from "react-native";
import fonts from "../constants/fonts";

const { width, height } = Dimensions.get("window");

const questMissionStyles = StyleSheet.create({
  container: {
    padding: width * 0.04,
    alignItems: "center",
  },
  columnContainer: {
    flexDirection: "column", 
    alignItems: "center",  
    justifyContent: "center",
  },
  missiontitle: {
    fontSize: width * 0.045, 
    marginBottom: height * 0.005,
    textAlign: "center",
    color: "#fff"
  },
  missionicon: {
    width: width * 0.5,  
    height: width * 0.15,
    resizeMode: "contain",
  },
  missionTextContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: fonts.extraBold,
  },
  missionText: {
    color: "black",
    fontSize: width * 0.03,
    fontFamily: fonts.bold,
  },
});

export default questMissionStyles;
