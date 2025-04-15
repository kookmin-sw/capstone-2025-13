import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 20,
        left: 24,
        right: 24,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    bubble: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#3FA057",
        justifyContent: "center",
        alignItems: "center",
    },
});
