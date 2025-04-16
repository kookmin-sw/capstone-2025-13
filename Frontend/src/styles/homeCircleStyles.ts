import { StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

const homeCircleStyles = StyleSheet.create({
    imageContainer: {
        width: "100%",
        height: height * 0.8,
        alignItems: "center",
        justifyContent: "flex-start",
    },
    image: {
        width: "100%",
        height: "100%",
    },
});

export default homeCircleStyles;
