import { StyleSheet, Dimensions } from "react-native";
import fonts from "../constants/fonts";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: "#3CB46E",
        paddingBottom: 25,
        alignItems: "center",
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    box: {
        width: width * 0.85,
        height: width * 0.5,
        backgroundColor: "#E9F8ED",
        borderRadius: 20,
        justifyContent:"center",
    },
    subtitle: {
        color: "#fff",
        marginTop: 10,
        fontSize: 14,
    },
    emptyText: {
        color: "#1AA85C",
        fontSize: 20,
        fontWeight:"bold",
        fontFamily: fonts.semiBold,
        textAlign: "center",
    },
});

export default styles;
