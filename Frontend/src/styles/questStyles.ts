import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const questStyles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContainer: {
      paddingBottom: height * 0.1,
    },
    headerWrapper: {
      position: "relative",
      height: height * 0.20,
    },
    circle: {
      position: "absolute",
      top: height * 0.20,
      alignSelf: "center",
      zIndex: 2,
    },
    questSection: {
      minHeight: height * 0.6,
      position: "relative",
    },
    street: {
      position: "absolute",
      width: width * 0.66,
      height: width * 0.4,
      alignSelf: "center",
      zIndex: 2,
    },
    elementsOverlay: {
        position: "absolute",
        top: height * 0.05,
        width: "100%",
        paddingHorizontal: width * 0.03,
        gap: height * 0.05,
        zIndex: 3,
      },
    elementWrapper: {
        marginHorizontal: width * 0.025,
    },
});  
  

export default questStyles;