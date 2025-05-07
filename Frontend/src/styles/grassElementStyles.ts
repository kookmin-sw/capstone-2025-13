// styles/treeElementStyles.ts
import { StyleSheet, Dimensions } from "react-native";
import fonts from "../constants/fonts";

const { width } = Dimensions.get("window");
export const baseWidth = width; 

const grassElementStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  icon: {
    resizeMode: "contain", // 모든 트리에 동일
  },
});

export default grassElementStyles;
