import { StyleSheet, Dimensions } from "react-native";
import fonts from "../../constants/fonts";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    button: {
        marginTop: 30,
        marginHorizontal: width * 0.07,
        height: 55,
        backgroundColor: "#3CB46E",
        borderRadius: 40,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    disabledButton: {
        backgroundColor: "#A5D6B2", 
    },
    label: {
        color: "#fff",
        fontSize: 18,
        fontFamily: fonts.semiBold,
        letterSpacing: 0.5,
        textAlign: "center",
        textAlignVertical: "center",
    },
    disabledLabel: {
        color: "#f1f1f1", 
    },
});

export default styles;
