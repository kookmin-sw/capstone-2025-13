import { StyleSheet, Dimensions } from "react-native";
import fonts from "../constants/fonts";

const { width } = Dimensions.get("window");

const forestElementStyles = StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    },
    icon: {
      width: width * 0.38, 
      height: width * 0.35,
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
  
export default forestElementStyles;