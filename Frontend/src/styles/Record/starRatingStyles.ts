import { StyleSheet, Dimensions } from "react-native";
import fonts from "../../constants/fonts";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 16,
    },
    starWrapper: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
    },
    caption: {
        letterSpacing: 0.5,
        marginBottom: height * 0.005,
        fontFamily: fonts.laundry,
        marginTop: height * 0.015,
        fontSize: width * 0.033,
        color: "#B0AEAE",
        textAlign: "center",
    },
});

export default styles;
