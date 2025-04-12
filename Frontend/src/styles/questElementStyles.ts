import { StyleSheet, Dimensions } from "react-native";
import fonts from "../constants/fonts";

const { width } = Dimensions.get("window");

const questElementStyles = StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    },
    icon: {
      width: width * 0.25,
      height: width * 0.25,
      marginBottom: width * 0.02,
    },
    nameContainer: {
      position: "relative",
      justifyContent: "center",
      alignItems: "center",
    },
    name: {
      width: width * 0.3,
      height: width * 0.1,
      resizeMode: "contain",
    },
    nameText: {
      position: "absolute",
      fontFamily: fonts.medium,
      color: "#fff",
      fontSize: width * 0.04,
    },
  });
  
export default questElementStyles;