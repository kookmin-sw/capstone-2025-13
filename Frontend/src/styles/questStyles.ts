import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const questStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#17B96D",
  },
  scrollContainer: {
    width: "100%",
    paddingBottom: height * 0.2,
  },
  headerWrapper: {
    height: height * 0.2,
    position: "relative",
  },
  circle: {
    position: "absolute",
    top: height * 0.20,
    alignSelf: "center",
    zIndex: 2,
  },
  elementsOverlay: {
    width: "100%",
  },
  elementWrapper: {
    width: width * 0.4,
    marginVertical: height * 0.002,
    zIndex: 4,
  },
  street: {
    position: "absolute",
    width: width * 0.66,
    height: width * 0.4,
    alignSelf: "center",
    zIndex: 3,
  },
});

export default questStyles;
