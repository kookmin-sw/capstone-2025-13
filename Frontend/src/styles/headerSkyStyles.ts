import { StyleSheet, Dimensions } from "react-native";
import fonts from "../constants/fonts";

const { width } = Dimensions.get("window");

const headerSkyStyles = StyleSheet.create({
  background: {
    width: "100%",
    height: width * 0.5,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  container: {
    alignItems: "flex-start",
    justifyContent: "center",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: width * 0.03,
  },
  backButtonWrapper: {
    marginRight: width * 0.03,
  },
  textWrapper: {
    flexDirection: "column",
  },
  title: {
    fontSize: width * 0.08,
    fontFamily: fonts.laundryBold,
    color: "#fff",
  },
  subtitle: {
    fontSize: width * 0.035,
    fontFamily: fonts.laundry,
    color: "#fff",
    marginTop: width * 0.01,
  },
});

export default headerSkyStyles;
