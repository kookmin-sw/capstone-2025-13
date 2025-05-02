import { StyleSheet } from "react-native";
import fonts from "../constants/fonts";

const styles = StyleSheet.create({
    header: {
        marginTop: 60,
        paddingHorizontal: 24,
    },
    dateOnly: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#3CB46E",
        fontFamily: fonts.laundryBold,
        marginTop: 20,
        marginLeft: 4,
    },
    titleText: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#3CB46E",
        fontFamily: fonts.laundryBold,
        marginTop: 2,
    },
});

export default styles;
