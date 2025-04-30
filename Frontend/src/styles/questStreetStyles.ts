import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const questStreetStyles = StyleSheet.create({
    image: {
      width: width * 0.3,
      height: width * 0.3,
      position: "absolute",
      alignSelf: "center",
      zIndex: -1,
      opacity: 0.9,
    },
  });
  

export default questStreetStyles;