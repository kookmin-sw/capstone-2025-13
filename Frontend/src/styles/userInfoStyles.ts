import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const userInfoStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#17B96D",
  },
});

export default userInfoStyles;
