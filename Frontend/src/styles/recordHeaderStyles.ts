import { Dimensions, StyleSheet } from "react-native";
import fonts from "../constants/fonts";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    header: {
        marginTop: height * 0.07, 
        paddingHorizontal: width * 0.05,
        flexDirection: "row",
        alignItems: "flex-start",
    },
    backButtonWrapper: {
        top: width * 0.02,
        marginRight: width * 0.01,
        zIndex: 11,
    },
    textWrapper: {
        flexDirection: "column",
        flexShrink: 1,
    },
    dateOnly: {
        fontSize: width * 0.055,
        fontWeight: "bold",
        color: "#3CB46E",
        fontFamily: fonts.laundryBold,
        marginLeft: width * 0.01,
    },
    titleText: {
        fontSize: width * 0.09,
        fontWeight: "bold",
        color: "#3CB46E",
        fontFamily: fonts.laundryBold,
        marginTop: height * 0.003,
        marginLeft: width * 0.01,
    },
});

export default styles;
