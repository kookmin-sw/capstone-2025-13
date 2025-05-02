import { StyleSheet, Dimensions } from "react-native";
import fonts from "../constants/fonts";

const { width, height } = Dimensions.get("window");

const questTitleStyles = StyleSheet.create({
  imageBackground: {
    width: width,
    height: height * 0.18,
  },
  textContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    fontSize: width * 0.035,
    fontFamily: fonts.laundry,
    color: "#543A1B",
    marginTop: height * 0.105,
  },
  subtitle: {
    fontSize: width * 0.06,
    fontFamily: fonts.laundryBold,
    color: "#543A1B",
  },
});

export default questTitleStyles;
