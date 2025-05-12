import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        justifyContent: "center",
        marginTop: 16,
        marginBottom: 24,
    },
    starWrapper: {
        flexDirection: "row",
        justifyContent: "center",
    },
    caption: {
        marginTop: height * 0.015,
        fontWeight: "bold",
        fontSize: width * 0.035,
        color: "#B0AEAE",
        textAlign: "center",
    },
});

export default styles;
