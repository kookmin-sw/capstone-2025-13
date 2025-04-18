import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const peachTreeStyles = StyleSheet.create({
    image: {
      width: width * 0.5,
      height: width * 0.5,
      position: "absolute",
      alignSelf: "center",
      zIndex: -1,
      opacity: 0.9,
    },
  });
  

export default peachTreeStyles;