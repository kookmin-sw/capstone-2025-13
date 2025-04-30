// styles/treeElementStyles.ts
import { StyleSheet, Dimensions } from "react-native";
import fonts from "../constants/fonts";

const { width } = Dimensions.get("window");
export const baseWidth = width; 

const treeElementStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  icon: {
    resizeMode: "contain", // 모든 트리에 동일
  },
  nameContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    width: width * 0.35,
    height: width * 0.1,
    resizeMode: "contain",
  },
  nameText: {
    position: "absolute",
    fontFamily: fonts.bold,
    color: "#543A1B",
    fontSize: width * 0.04,
  },
});

export default treeElementStyles;
