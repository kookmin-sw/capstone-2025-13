import { StyleSheet } from "react-native";
import fonts from "../constants/fonts";

export default StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "#E9D7B4",
        padding: 22,
        borderRadius: 20,
        shadowColor: "#795C42",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
        alignItems: "center",
        gap: 12,
    },
    icon: {
        marginRight: 8,
        marginLeft: 8,
    },
    title: {
        fontSize: 16,
        color: "#5D432C",
        fontFamily: fonts.laundryBold,
    },
    subtitle: {
        fontSize: 12,
        color: "#5D432C",
        fontFamily: fonts.laundry,
        marginTop: 4,
    },
});
